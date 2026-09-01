/* The step-by-step wizard: state, rendering, validation and the
   invitation-letter generator. Presentation-only concerns (WhatsApp share,
   clipboard, logging) live in whatsapp.js so this file stays focused on
   "what step are we on and is it valid".

   Flow (deliberately not deathoverdinner.org's "pick a menu, get your
   cards" order): the host is asked WHY before anything else, then walks
   five life-and-death themes in turn — reading one of the source
   document's deeper questions as a private prompt, then optionally
   choosing a few shorter cards for the table — and only at the very end
   decides WHO is actually coming and when. */
window.DOD = window.DOD || {};

(function () {
  var TOTAL_STEPS = 8;
  var THEME_STEP_START = 2; // steps 2-6 are the five theme groups
  var THEME_STEP_END = 6;
  var GUEST_STEP = 7;
  var REVIEW_STEP = 8;

  var state = {
    step: 1,
    intent: null,
    privateNote: "", // never sent anywhere; the host's own reflection
    cards: new Set(),
    guestTypes: new Set(),
    tone: null,
    hostName: "",
    dinnerTitle: "",
    date: "",
    time: "",
    location: "",
    guestNames: ""
  };

  var els = {}; // cached DOM refs, filled by init()

  function t(key, vars) {
    return window.DOD.t(key, vars);
  }

  function themeGroups() {
    return window.DOD.DATA.cardGroups;
  }

  function themeGroupForStep(step) {
    return themeGroups()[step - THEME_STEP_START];
  }

  /* The dinner's overall register is derived from what the host actually
     spent time on, not chosen up front from a menu: any pick from the
     medical/dignity theme marks the whole dinner as touching that
     territory, otherwise it defaults to the gentler legacy register. A
     custom dinner title (set in the final step) always overrides the
     displayed name regardless of this. */
  function deriveTemplateId() {
    var medical = themeGroups().filter(function (g) { return g.id === "medical"; })[0];
    if (medical && medical.cards.some(function (c) { return state.cards.has(c.id); })) {
      return "acp";
    }
    return "legacy";
  }

  // ---- Validation -----------------------------------------------------

  function isStepValid(step) {
    switch (step) {
      case 1: return !!state.intent;
      case THEME_STEP_END: return state.cards.size >= 3 && state.cards.size <= 5;
      case GUEST_STEP:
        return state.guestTypes.size > 0 && !!state.tone &&
          !!state.hostName.trim() && !!state.date && !!state.time;
      default: return true; // the other theme steps are opt-in, not gated
    }
  }

  // ---- Letter generation ------------------------------------------------

  function formatDate(value) {
    if (!value) return "";
    var locale = window.DOD.currentLang === "tc" ? "zh-HK" : "en-HK";
    try {
      var d = new Date(value + "T00:00:00");
      return d.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric", weekday: "long" });
    } catch (e) {
      return value;
    }
  }

  function buildLetter() {
    var lines = [];
    var names = state.guestNames.trim();
    var sep = window.DOD.currentLang === "tc" ? "、" : ", ";
    var greeting = names
      ? names.split(",").map(function (s) { return s.trim(); }).filter(Boolean).join(sep)
      : t("letter.greetingGeneric");
    lines.push(greeting + (window.DOD.currentLang === "tc" ? "：" : ","));
    lines.push("");
    lines.push(t("letter.intro." + state.tone));
    lines.push("");
    var templateLabel = state.dinnerTitle.trim() || t("templates." + deriveTemplateId() + ".name");
    lines.push(t("letter.templateNote", { template: templateLabel }));
    lines.push("");
    lines.push(t("letter.detailsIntro"));
    if (state.date) lines.push(t("letter.detailDate", { date: formatDate(state.date) }));
    if (state.time) lines.push(t("letter.detailTime", { time: state.time }));
    if (state.location.trim()) lines.push(t("letter.detailLocation", { location: state.location.trim() }));
    lines.push("");
    lines.push(t("letter.closing"));
    lines.push("");
    lines.push(t("letter.signOff", { host: state.hostName.trim() }));
    return lines.join("\n");
  }

  // ---- Rendering --------------------------------------------------------

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else if (k === "html") node.innerHTML = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  function renderChoiceList(container, items, opts) {
    // opts: {type: 'checkbox'|'radio', name, selectedSet or selectedValue, onChange}
    var list = el("div", { class: "choice-grid", role: opts.type === "radio" ? "radiogroup" : "group", "aria-label": opts.groupLabel || "" });
    items.forEach(function (item) {
      var id = opts.name + "-" + item.id;
      var input = el("input", { type: opts.type, id: id, name: opts.name, value: item.id });
      var checked = opts.type === "radio" ? opts.selectedValue === item.id : opts.selectedSet.has(item.id);
      if (checked) input.setAttribute("checked", "checked");
      input.addEventListener("change", function () { opts.onChange(item.id, input.checked); });
      var label = el("label", { for: id, class: "choice-card" }, [
        input,
        el("span", { text: t(item.i18n) })
      ]);
      list.appendChild(label);
    });
    container.appendChild(list);
  }

  function renderReflection(container, reflectionI18nKey) {
    container.appendChild(el("div", { class: "reflection-prompt" }, [
      el("span", { class: "reflection-kicker", text: t("theme.reflectionKicker") }),
      el("p", { text: t(reflectionI18nKey) })
    ]));
  }

  /* Shared renderer for the five theme steps (2-6): a reflection to read,
     then this theme's cards to optionally choose from. Validation for the
     whole set lives on the last theme step (see isStepValid). */
  function renderThemeStep(container, group) {
    container.appendChild(el("h3", { id: "step-heading", tabindex: "-1", text: t(group.titleI18n) }));
    container.appendChild(el("p", { class: "step-subtitle", text: t("theme.subtitle", { picked: state.cards.size }) }));
    renderReflection(container, group.reflectionI18n);
    if (group.needsReview) {
      container.appendChild(el("span", { class: "badge badge-warning", text: t("step5.acpBadge") }));
    }
    renderChoiceList(container, group.cards, {
      type: "checkbox", name: "card-" + group.id, selectedSet: state.cards,
      groupLabel: t(group.titleI18n),
      onChange: function (id, checked) {
        if (checked) {
          if (state.cards.size >= 5) {
            var input = document.getElementById("card-" + group.id + "-" + id);
            if (input) input.checked = false;
            announce(t("theme.cardsMax"));
            return;
          }
          state.cards.add(id);
        } else {
          state.cards.delete(id);
        }
        refreshNav();
        var subtitle = els.content.querySelector(".step-subtitle");
        if (subtitle) subtitle.textContent = t("theme.subtitle", { picked: state.cards.size });
      }
    });
  }

  var stepRenderers = {
    1: function (container) {
      container.appendChild(el("h3", { id: "step-heading", tabindex: "-1", text: t("step1.title") }));
      container.appendChild(el("p", { class: "step-subtitle", text: t("step1.subtitle") }));
      renderChoiceList(container, window.DOD.DATA.intents, {
        type: "radio", name: "intent", selectedValue: state.intent,
        groupLabel: t("step1.title"),
        onChange: function (id) { state.intent = id; refreshNav(); }
      });
      container.appendChild(el("p", { class: "note-box", text: t("step1.crisisNote") }));

      container.appendChild(el("div", { class: "reflection-prompt" }, [
        el("span", { class: "reflection-kicker", text: t("theme.reflectionKicker") }),
        el("p", { text: t("step1.reflectionPrompt") })
      ]));
      var noteId = "field-privateNote";
      container.appendChild(el("label", { for: noteId, class: "field-label", text: t("step1.reflectionLabel") }));
      var textarea = el("textarea", { id: noteId, rows: "4", class: "letter-textarea", placeholder: t("step1.reflectionPlaceholder") });
      textarea.value = state.privateNote;
      textarea.addEventListener("input", function () { state.privateNote = textarea.value; });
      container.appendChild(textarea);
      container.appendChild(el("p", { class: "muted small", text: t("step1.reflectionNote") }));
    },

    2: function (container) { renderThemeStep(container, themeGroupForStep(2)); },
    3: function (container) { renderThemeStep(container, themeGroupForStep(3)); },
    4: function (container) { renderThemeStep(container, themeGroupForStep(4)); },
    5: function (container) { renderThemeStep(container, themeGroupForStep(5)); },
    6: function (container) { renderThemeStep(container, themeGroupForStep(6)); },

    7: function (container) {
      container.appendChild(el("h3", { id: "step-heading", tabindex: "-1", text: t("step7.title") }));
      container.appendChild(el("p", { class: "step-subtitle", text: t("step7.subtitle") }));

      container.appendChild(el("h4", { text: t("step7.guestsHeading") }));
      renderChoiceList(container, window.DOD.DATA.guestTypes, {
        type: "checkbox", name: "guestType", selectedSet: state.guestTypes,
        groupLabel: t("step7.guestsHeading"),
        onChange: function (id, checked) {
          if (checked) state.guestTypes.add(id); else state.guestTypes.delete(id);
          refreshNav();
        }
      });

      container.appendChild(el("h4", { text: t("step7.toneHeading") }));
      renderChoiceList(container, window.DOD.DATA.tones, {
        type: "radio", name: "tone", selectedValue: state.tone,
        groupLabel: t("step7.toneHeading"),
        onChange: function (id) { state.tone = id; refreshNav(); }
      });

      container.appendChild(el("h4", { text: t("step7.detailsHeading") }));
      var form = el("div", { class: "field-grid" });

      function textField(fieldId, labelKey, phKey, value, required, onInput, type) {
        var inputId = "field-" + fieldId;
        var input = el("input", { type: type || "text", id: inputId, value: value || "" });
        if (phKey) input.setAttribute("placeholder", t(phKey));
        if (required) input.setAttribute("required", "required");
        input.addEventListener("input", function () { onInput(input.value); refreshNav(); });
        return el("div", { class: "field" }, [
          el("label", { for: inputId, text: t(labelKey) + (required ? " *" : "") }),
          input
        ]);
      }

      form.appendChild(textField("hostName", "field.hostName", "field.hostName.ph", state.hostName, true, function (v) { state.hostName = v; }));
      form.appendChild(textField("dinnerTitle", "field.dinnerTitle", "field.dinnerTitle.ph", state.dinnerTitle, false, function (v) { state.dinnerTitle = v; }));
      form.appendChild(textField("date", "field.date", null, state.date, true, function (v) { state.date = v; }, "date"));
      form.appendChild(textField("time", "field.time", null, state.time, true, function (v) { state.time = v; }, "time"));
      form.appendChild(textField("location", "field.location", "field.location.ph", state.location, false, function (v) { state.location = v; }));
      form.appendChild(textField("guests", "field.guests", "field.guests.ph", state.guestNames, false, function (v) { state.guestNames = v; }));
      container.appendChild(form);
    },

    8: function (container) {
      container.appendChild(el("h3", { id: "step-heading", tabindex: "-1", text: t("step8.title") }));
      container.appendChild(el("p", { class: "step-subtitle", text: t("step8.subtitle") }));
      var textareaId = "letter-text";
      container.appendChild(el("label", { for: textareaId, class: "field-label", text: t("step8.letterLabel") }));
      var textarea = el("textarea", { id: textareaId, rows: "12", class: "letter-textarea" });
      textarea.value = buildLetter();
      container.appendChild(textarea);
      container.appendChild(el("p", { class: "note-box", text: t("step8.principleNote") }));

      var actions = el("div", { class: "letter-actions" });
      var waBtn = el("button", { type: "button", class: "btn btn-primary", id: "btn-send-whatsapp", text: t("step8.sendWhatsapp") });
      var copyBtn = el("button", { type: "button", class: "btn btn-secondary", id: "btn-copy-text", text: t("step8.copyText") });
      var status = el("span", { id: "send-status", class: "send-status", role: "status", "aria-live": "polite" });
      actions.appendChild(waBtn);
      actions.appendChild(copyBtn);
      actions.appendChild(status);
      container.appendChild(actions);
      container.appendChild(el("p", { class: "muted small", text: t("step8.logNote") }));

      window.DOD.wireSendActions({
        getText: function () { return textarea.value; },
        whatsappBtn: waBtn,
        copyBtn: copyBtn,
        statusEl: status,
        getPayload: function () { return buildSubmissionPayload(); }
      });
    }
  };

  function buildSubmissionPayload() {
    // state.privateNote is deliberately excluded: it's the host's own
    // reflection, never logged and never sent.
    return {
      intent: state.intent,
      template: deriveTemplateId(),
      cards: Array.from(state.cards),
      guestTypes: Array.from(state.guestTypes),
      tone: state.tone,
      hostName: state.hostName,
      dinnerTitle: state.dinnerTitle,
      date: state.date,
      time: state.time,
      location: state.location,
      guestNames: state.guestNames,
      lang: window.DOD.currentLang
    };
  }

  function announce(message) {
    if (els.live) els.live.textContent = message;
  }

  function refreshNav() {
    var valid = isStepValid(state.step);
    if (els.nextBtn) els.nextBtn.disabled = !valid;
    if (els.errorEl) {
      els.errorEl.textContent = "";
    }
  }

  function renderStep() {
    els.content.innerHTML = "";
    stepRenderers[state.step](els.content);
    els.progress.textContent = t("wizard.progress", { current: state.step, total: TOTAL_STEPS });
    var progressFraction = state.step / TOTAL_STEPS;
    els.progressBar.style.transform = "scaleX(" + progressFraction + ")";
    if (els.progressPlane) {
      var trackWidth = els.progressTrack ? els.progressTrack.clientWidth : 0;
      els.progressPlane.style.transform = "translateX(" + (trackWidth * progressFraction) + "px)";
    }
    els.backBtn.hidden = state.step === 1;
    els.nextBtn.hidden = state.step === TOTAL_STEPS;
    els.nextBtn.textContent = state.step === TOTAL_STEPS - 1 ? t("wizard.finish") : t("wizard.next");
    refreshNav();
    // preventScroll: focusing the heading should announce the step to
    // screen readers without hijacking scroll position -- most notably on
    // first page load, where this would otherwise yank the viewport down
    // to the wizard before the visitor has scrolled there themselves.
    var heading = document.getElementById("step-heading");
    if (heading) heading.focus({ preventScroll: true });
  }

  function goNext() {
    if (!isStepValid(state.step)) {
      var errKey = "step" + state.step + ".error";
      announce(t(errKey));
      if (els.errorEl) els.errorEl.textContent = t(errKey);
      return;
    }
    if (state.step < TOTAL_STEPS) {
      state.step += 1;
      renderStep();
    }
  }

  function goBack() {
    if (state.step > 1) {
      state.step -= 1;
      renderStep();
    }
  }

  function init() {
    els.content = document.getElementById("wizard-step-content");
    els.progress = document.getElementById("wizard-progress-text");
    els.progressBar = document.getElementById("wizard-progress-bar");
    els.progressTrack = els.progressBar ? els.progressBar.parentElement : null;
    els.progressPlane = document.getElementById("wizard-progress-plane");
    els.backBtn = document.getElementById("wizard-back");
    els.nextBtn = document.getElementById("wizard-next");
    els.live = document.getElementById("wizard-live");
    els.errorEl = document.getElementById("wizard-error");

    els.backBtn.addEventListener("click", goBack);
    els.nextBtn.addEventListener("click", goNext);

    renderStep();
  }

  window.DOD.wizard = {
    init: init,
    rerender: renderStep, // called by app.js after a language switch
    getState: function () { return state; }
  };
})();
