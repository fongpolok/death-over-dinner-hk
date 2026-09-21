/* Contact-page enquiry form. Posts to the optional Flask backend's
   /api/enquiry route and is honest about every outcome: emailed, only
   logged (no inbox configured), or not sent at all -- which is what
   happens on a static host like GitHub Pages, where there is no backend
   to receive it. It never reports success it can't confirm. */
(function () {
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function init() {
    var form = document.getElementById("enquiry-form");
    if (!form) return;
    var errorEl = document.getElementById("enquiry-error");
    var statusEl = document.getElementById("enquiry-status");
    var submitBtn = document.getElementById("enquiry-submit");
    var t = window.DOD.t;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      errorEl.textContent = "";
      statusEl.textContent = "";

      var data = {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        phone: form.elements.phone.value.trim(),
        type: form.elements.type.value,
        message: form.elements.message.value.trim()
      };

      var firstInvalid = null;
      if (!data.name) firstInvalid = form.elements.name;
      else if (!EMAIL_RE.test(data.email)) firstInvalid = form.elements.email;
      else if (!data.message) firstInvalid = form.elements.message;
      else if (!form.elements.consent.checked) firstInvalid = form.elements.consent;
      if (firstInvalid) {
        errorEl.textContent = t("contact.form.error.required");
        firstInvalid.focus();
        return;
      }

      submitBtn.disabled = true;
      statusEl.textContent = t("contact.form.sending");

      fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          return res.json()
            .catch(function () { return {}; })
            .then(function (body) { return { res: res, body: body }; });
        })
        .then(function (r) {
          if (r.res.ok && r.body.status === "sent") {
            statusEl.textContent = t("contact.form.status.sent");
            form.reset();
          } else if (r.res.ok && r.body.status === "logged_not_configured") {
            statusEl.textContent = t("contact.form.status.logged");
            form.reset();
          } else if (r.res.status === 404 || r.res.status === 405) {
            // No backend behind this host (e.g. GitHub Pages).
            statusEl.textContent = t("contact.form.status.unavailable");
          } else {
            statusEl.textContent = t("contact.form.status.failed");
          }
        })
        .catch(function () {
          statusEl.textContent = t("contact.form.status.unavailable");
        })
        .then(function () { submitBtn.disabled = false; });
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
