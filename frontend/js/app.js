/* Bootstraps every page: language toggle, style-theme toggle, mobile nav,
   and (only on wizard.html, where wizard.js is actually loaded) the
   wizard. Kept last in load order so it can assume i18n.js and (where
   present) data.js/wizard.js/whatsapp.js are already loaded. */
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
    if (toggle) {
      toggle.addEventListener("click", function () {
        setLanguage(window.DOD.currentLang === "tc" ? "en" : "tc");
      });
    }
  }

  /* Item 4: the landing page's duality choice (Hong Kong / Western) sets
     this for the whole site, not just the page it was chosen on. A footer
     control lets it be changed again from anywhere. */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var label = document.getElementById("theme-toggle-label");
    if (label) label.setAttribute("data-i18n", theme === "western" ? "nav.themeToggle.toHk" : "nav.themeToggle.toWestern");
    window.DOD.applyStaticI18n(document);
    try { localStorage.setItem("dod-theme", theme); } catch (e) { /* ignore */ }
  }

  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem("dod-theme"); } catch (e) { /* ignore */ }
    applyTheme(saved === "western" ? "western" : "hk");
    var toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        applyTheme(document.documentElement.getAttribute("data-theme") === "western" ? "hk" : "western");
      });
    }
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
    // On wizard.html, gate.js calls window.DOD.wizard.init() itself once
    // the precaution gate is acknowledged -- the wizard must not render
    // (or steal focus) before that. Everywhere else window.DOD.wizard is
    // simply undefined, so setLanguage()'s rerender() call stays a no-op.
    initTheme();
    initLanguage();
    initMobileNav();
  });
})();
