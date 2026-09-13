/* Plays the ~7.5s intro splash once per tab, then crossfades it away to
   reveal the real page (already fully rendered underneath it). The video
   is purely decorative: every path here ends in the splash being hidden,
   so a slow network, a failed video load, or a browser blocking autoplay
   can never strand a visitor in front of it. */
(function () {
  var SESSION_KEY = "dod-intro-shown";
  var FALLBACK_HIDE_MS = 8300; // video is 7.5s; this is a safety net, not the primary trigger

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function alreadyShownThisTab() {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "1";
    } catch (e) {
      return false; // private mode / storage blocked: just show it again, no harm done
    }
  }

  function markShown() {
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch (e) { /* ignore */ }
  }

  function init() {
    var splash = document.getElementById("intro-splash");
    if (!splash) return;

    if (prefersReducedMotion() || alreadyShownThisTab()) {
      splash.hidden = true;
      return;
    }

    markShown();

    var video = document.getElementById("intro-video");
    var skipBtn = document.getElementById("intro-skip");
    var hidden = false;

    function hide() {
      if (hidden) return;
      hidden = true;
      splash.classList.add("is-fading");
      window.setTimeout(function () {
        splash.hidden = true;
      }, 650); // matches the CSS opacity transition duration
    }

    var fallbackTimer = window.setTimeout(hide, FALLBACK_HIDE_MS);

    function hideNow() {
      window.clearTimeout(fallbackTimer);
      hide();
    }

    skipBtn.addEventListener("click", hideNow);
    video.addEventListener("ended", hideNow);
    video.addEventListener("error", hideNow); // e.g. the file failed to load at all

    // Start the crossfade slightly before the video's own last frame so it
    // overlaps with the in-video fade-to-white instead of cutting after it.
    video.addEventListener("timeupdate", function () {
      if (video.duration && video.currentTime >= video.duration - 0.6) {
        hideNow();
      }
    });

    // Autoplay can be blocked even when muted, in rare browser configurations.
    // If play() rejects, don't leave the visitor staring at a frozen frame.
    var playResult = video.play();
    if (playResult && typeof playResult.catch === "function") {
      playResult.catch(hideNow);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
