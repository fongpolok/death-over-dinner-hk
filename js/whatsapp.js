/* Turns the generated letter into a WhatsApp share link / clipboard copy,
   and makes a best-effort, non-blocking attempt to log the submission to
   the optional local Flask backend. None of this is required for sending
   to work — if the backend isn't running, the log call just fails quietly. */
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
    fetch("/api/submissions", {
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
        opts.statusEl.textContent = window.DOD.t("step7.copied");
        setTimeout(function () { opts.statusEl.textContent = ""; }, 3000);
      });
    });
  };
})();
