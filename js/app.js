/* Bootstraps the page: language toggle, mobile nav, and wizard init.
   Kept last in load order so it can assume i18n.js, data.js, wizard.js
   and whatsapp.js are already loaded. */
(function () {
  function updateDynamicText() {
    var copyright = document.getElementById("footer-copyright");
    if (copyright) {
      copyright.textContent = window.DOD.t("footer.copyright", { year: new Date().getFullYear() });
    }
  }

  function setLanguage(lang) {
    window.DOD.currentLang = lang;
    document.documentElement.lang = window.DOD.t("meta.htmlLang");
    window.DOD.applyStaticI18n(document);
    updateDynamicText();
    if (window.DOD.wizard) window.DOD.wizard.rerender();
    var toggle = document.getElementById("lang-toggle");
    if (toggle) toggle.setAttribute("aria-pressed", String(lang === "en"));
    try { localStorage.setItem("dod-lang", lang); } catch (e) { /* private mode: ignore */ }
  }

  function initLanguage() {
    var saved = null;
    try { saved = localStorage.getItem("dod-lang"); } catch (e) { /* ignore */ }
    setLanguage(saved === "en" ? "en" : "tc");
    var toggle = document.getElementById("lang-toggle");
    toggle.addEventListener("click", function () {
      setLanguage(window.DOD.currentLang === "tc" ? "en" : "tc");
    });
  }

  function initMobileNav() {
    var toggle = document.getElementById("nav-toggle");
    var menu = document.getElementById("nav-menu");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", function () {
      var isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    window.DOD.wizard.init(); // must run before initLanguage(), which triggers a wizard re-render
    initLanguage();
    initMobileNav();
  });
})();
