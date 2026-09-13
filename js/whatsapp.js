/* Turns the generated letter into a WhatsApp share link, a clipboard copy,
   a print/PDF export, or a real emailed invitation -- and makes a
   best-effort, non-blocking attempt to log the submission to the optional
   local Flask backend. None of this is required for WhatsApp/copy/print to
   work -- if the backend isn't running, the log call just fails quietly.
   Email is the one action that genuinely needs the backend (and, on top
   of that, real SMTP credentials configured there -- see backend/.env). */
window.DOD = window.DOD || {};

(function () {
  function buildWhatsAppUrl(text) {
    return "https://wa.me/?text=" + encodeURIComponent(text);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback for older browsers / non-secure contexts.
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  function logSubmissionBestEffort(payload) {
    return fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch(function (err) {
      console.debug("[submissions] local logging server not reachable (this is fine if you're not running the optional Python preview server):", err.message);
    });
  }

  window.DOD.wireSendActions = function wireSendActions(opts) {
    opts.whatsappBtn.addEventListener("click", function () {
      logSubmissionBestEffort(Object.assign({ action: "whatsapp" }, opts.getPayload()));
      window.open(buildWhatsAppUrl(opts.getText()), "_blank", "noopener");
    });

    opts.copyBtn.addEventListener("click", function () {
      copyToClipboard(opts.getText()).then(function () {
        logSubmissionBestEffort(Object.assign({ action: "copy" }, opts.getPayload()));
        opts.statusEl.textContent = window.DOD.t("step8.copied");
        setTimeout(function () { opts.statusEl.textContent = ""; }, 3000);
      });
    });

    if (opts.printBtn) {
      opts.printBtn.addEventListener("click", function () {
        logSubmissionBestEffort(Object.assign({ action: "print" }, opts.getPayload()));
        window.print();
      });
    }
  };

  /* Item 9.6: actually send the invitation by email through the optional
     Flask backend's /api/send-invitation endpoint. Honest about the two
     ways this can end without an error: real SMTP success, or the backend
     being reachable but not yet configured with credentials -- the UI text
     for each case is supplied by the caller (wizard.js) via opts, since
     the exact wording is themed/translated there. */
  window.DOD.sendInvitationEmail = function sendInvitationEmail(opts) {
    opts.statusEl.textContent = window.DOD.t("letter.emailSending");
    opts.sendBtn.disabled = true;
    fetch("/api/send-invitation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.assign({
        to_email: opts.email,
        to_phone: opts.phone,
        letter_text: opts.getText()
      }, opts.getPayload()))
    })
      .then(function (res) { return res.json().then(function (body) { return { ok: res.ok, body: body }; }); })
      .then(function (result) {
        opts.sendBtn.disabled = false;
        if (result.ok && result.body.status === "sent") {
          opts.statusEl.textContent = window.DOD.t("letter.emailSentOk");
        } else if (result.ok && result.body.status === "logged_not_configured") {
          opts.statusEl.textContent = window.DOD.t("letter.emailNotConfigured");
        } else {
          opts.statusEl.textContent = window.DOD.t("letter.emailFailed");
        }
      })
      .catch(function () {
        // The backend isn't running at all -- same honest fallback as the
        // "not configured" case: recorded nowhere server-side, so say so.
        opts.sendBtn.disabled = false;
        opts.statusEl.textContent = window.DOD.t("letter.emailNotConfigured");
      });
  };
})();
