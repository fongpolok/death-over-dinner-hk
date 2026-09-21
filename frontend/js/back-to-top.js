/* A "back to top" control on every page. Injected rather than written into
   each page's markup so the twelve pages stay in sync; it only appears once
   the visitor has scrolled a screen's worth, so short pages never show it. */
(function () {
  var SHOW_AFTER_PX = 400;

  function init() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "back-to-top";
    btn.hidden = true;
    btn.setAttribute("data-i18n-aria-label", "backToTop");
    btn.setAttribute("aria-label", window.DOD.t("backToTop"));
    btn.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      '<path d="M10 16V4" /><path d="M4.5 9.5L10 4l5.5 5.5" /></svg>';
    document.body.appendChild(btn);

    var ticking = false;
    function update() {
      btn.hidden = window.scrollY < SHOW_AFTER_PX;
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();

    btn.addEventListener("click", function (event) {
      var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      // Keyboard activation (detail === 0): move focus to the top too, or
      // the next Tab jumps straight back down here. Skipped for mouse/touch
      // because the skip link is visible whenever it has focus.
      if (event.detail === 0) {
        var skip = document.querySelector(".skip-link");
        if (skip) skip.focus({ preventScroll: true });
      }
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
