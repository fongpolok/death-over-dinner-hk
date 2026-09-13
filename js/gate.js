/* Item 7: a legal/ethics + grief-crisis precaution screen the host must
   actively acknowledge before the questionnaire (wizard.js) is reachable
   at all. Deliberately NOT wired into app.js's generic bootstrap, since
   the wizard must not init/render until this gate is passed. Remembers
   acknowledgement per tab (sessionStorage) so returning to this page
   later in the same visit doesn't force a re-read. */
(function () {
  var SESSION_KEY = "dod-gate-ack";

  function showWizard() {
    var gate = document.getElementById("wizard-gate");
    var wrap = document.getElementById("wizard-panel-wrap");
    if (gate) gate.hidden = true;
    if (wrap) wrap.hidden = false;
    if (window.DOD.wizard) window.DOD.wizard.init();
  }

  function init() {
    var gate = document.getElementById("wizard-gate");
    if (!gate) return;

    var already = false;
    try { already = sessionStorage.getItem(SESSION_KEY) === "1"; } catch (e) { /* ignore */ }
    if (already) {
      showWizard();
      return;
    }

    var checkbox = document.getElementById("gate-ack-checkbox");
    var startBtn = document.getElementById("gate-start");
    var errorEl = document.getElementById("gate-error");

    startBtn.addEventListener("click", function () {
      if (!checkbox.checked) {
        errorEl.textContent = window.DOD.t("gate.ack.error");
        return;
      }
      errorEl.textContent = "";
      try { sessionStorage.setItem(SESSION_KEY, "1"); } catch (e) { /* ignore */ }
      showWizard();
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
