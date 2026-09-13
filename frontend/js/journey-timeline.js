/* Reveals the 籌備流程 timeline one stop at a time on first scroll into
   view -- the journey being "walked", not a generic scroll fade. Accepted
   via Impeccable live mode (cascade-stagger lane, number-pulse on).
   Stagger interval baked at its accepted value (80ms); prefers-reduced-motion
   skips the delay entirely rather than relying only on the site-wide
   duration override, so there's no lag even before that rule applies. */
(function () {
  var STAGGER_MS = 80;

  function init() {
    var el = document.getElementById("journey-timeline");
    if (!el) return;
    var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var items = el.querySelectorAll(".timeline-item");

    function reveal() {
      items.forEach(function (item, i) {
        item.style.transitionDelay = (reduced ? 0 : i * STAGGER_MS) + "ms";
      });
      el.classList.add("dod-motion-in");
    }

    if (reduced || !("IntersectionObserver" in window)) {
      reveal();
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { reveal(); io.unobserve(el); }
      });
    }, { threshold: 0.2 });
    io.observe(el);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
