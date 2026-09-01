/* The step-by-step wizard: state, rendering, validation and the
   invitation-letter generator. Presentation-only concerns (WhatsApp share,
   clipboard, logging) live in whatsapp.js so this file stays focused on
   "what step are we on and is it valid". */
window.DOD = window.DOD || {};

(function () {
  var TOTAL_STEPS = 7;

  var state = {
    step: 1,
    guestTypes: new Set(),
    intent: null,
    template: null,
    templateManual: false,
    tone: null,
    cards: new Set(),
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

  function recommendedTemplate() {
    var intent = window.DOD.DATA.intents.find(function (i) { return i.id === state.intent; });
    return intent ? intent.recommends : "legacy";
  }

  function currentTemplateId() {
    return state.templateManual ? state.template : recommendedTemplate();
  }

  // ---- Validation -----------------------------------------------------

  function isStepValid(step) {
    switch (step) {
      case 1: return state.guestTypes.size > 0;
      case 2: return !!state.intent;
      case 3: return !!currentTemplateId();
      case 4: return !!state.tone;
      case 5: return state.cards.size >= 3 && state.cards.size <= 5;
      case 6: return !!state.hostName.trim() && !!state.date && !!state.time;
      default: return true;
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
    var tpl = window.DOD.DATA.templates.find(function (x) { return x.id === currentTemplateId(); });
    var templateLabel = state.dinnerTitle.trim() || t(tpl.name);
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

  var stepRenderers = {
    1: function (container) {
      container.appendChild(el("h3", { id: "step-heading", tabindex: "-1", "data-i18n": "step1.title", text: t("step1.title") }));
      container.appendChild(el("p", { class: "step-subtitle", "data-i18n": "step1.subtitle", text: t("step1.subtitle") }));
      renderChoiceList(container, window.DOD.DATA.guestTypes, {
        type: "checkbox", name: "guestType", selectedSet: state.guestTypes,
        groupLabel: t("step1.title"),
        onChange: function (id, checked) {
          if (checked) state.guestTypes.add(id); else state.guestTypes.delete(id);
          refreshNav();
        }
      });
    },
    2: function (container) {
      container.appendChild(el("h3", { id: "step-heading", tabindex: "-1", text: t("step2.title") }));
      container.appendChild(el("p", { class: "step-subtitle", text: t("step2.subtitle") }));
      renderChoiceList(container, window.DOD.DATA.intents, {
        type: "radio", name: "intent", selectedValue: state.intent,
        groupLabel: t("step2.title"),
        onChange: function (id) { state.intent = id; refreshNav(); }
      });
      container.appendChild(el("p", { class: "note-box", text: t("step2.crisisNote") }));
    },
    3: function (container) {
      container.appendChild(el("h3", { id: "step-heading", tabindex: "-1", text: t("step3.title") }));
      container.appendChild(el("p", { class: "step-subtitle", text: t("step3.subtitle") }));
      var rec = recommendedTemplate();
      var grid = el("div", { class: "template-grid", role: "radiogroup", "aria-label": t("step3.title") });
      window.DOD.DATA.templates.forEach(function (tpl) {
        var id = "template-" + tpl.id;
        var input = el("input", { type: "radio", id: id, name: "template", value: tpl.id });
        if (currentTemplateId() === tpl.id) input.setAttribute("checked", "checked");
        input.addEventListener("change", function () {
          state.template = tpl.id;
          state.templateManual = true;
          refreshNav();
        });
        var badge = (!state.templateManual && tpl.id === rec)
          ? el("span", { class: "badge", text: t("step3.recommendedBadge") })
          : null;
        var card = el("label", { for: id, class: "template-card" }, [
          input,
          el("strong", { text: t(tpl.name) }),
          el("p", { text: t(tpl.purpose) }),
          el("p", { class: "muted", text: t(tpl.fit) }),
          el("p", { class: "muted", text: t(tpl.intensity) }),
          badge
        ]);
        grid.appendChild(card);
      });
      container.appendChild(grid);
    },
    4: function (container) {
      container.appendChild(el("h3", { id: "step-heading", tabindex: "-1", text: t("step4.title") }));
      container.appendChild(el("p", { class: "step-subtitle", text: t("step4.subtitle") }));
      renderChoiceList(container, window.DOD.DATA.tones, {
        type: "radio", name: "tone", selectedValue: state.tone,
        groupLabel: t("step4.title"),
        onChange: function (id) { state.tone = id; refreshNav(); }
      });
    },
    5: function (container) {
      container.appendChild(el("h3", { id: "step-heading", tabindex: "-1", text: t("step5.title") }));
      container.appendChild(el("p", { class: "step-subtitle", text: t("step5.subtitle") }));
      window.DOD.DATA.cardGroups.forEach(function (group) {
        var groupWrap = el("fieldset", { class: "card-group" });
        groupWrap.appendChild(el("legend", { text: t(group.titleI18n) }));
        if (group.needsReview) {
          groupWrap.appendChild(el("span", { class: "badge badge-warning", text: t("step5.acpBadge") }));
        }
        var list = el("div", { class: "choice-grid" });
        group.cards.forEach(function (card) {
          var id = "card-" + card.id;
          var input = el("input", { type: "checkbox", id: id, name: "card", value: card.id });
          if (state.cards.has(card.id)) input.setAttribute("checked", "checked");
          input.addEventListener("change", function () {
            if (input.checked) {
              if (state.cards.size >= 5) {
                input.checked = false;
                announce(t("step5.error"));
                return;
              }
              state.cards.add(card.id);
            } else {
              state.cards.delete(card.id);
            }
            refreshNav();
          });
          list.appendChild(el("label", { for: id, class: "choice-card" }, [input, el("span", { text: t(card.i18n) })]));
        });
        groupWrap.appendChild(list);
        container.appendChild(groupWrap);
      });
    },
    6: function (container) {
      container.appendChild(el("h3", { id: "step-heading", tabindex: "-1", text: t("step6.title") }));
      container.appendChild(el("p", { class: "step-subtitle", text: t("step6.subtitle") }));
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
    7: function (container) {
      container.appendChild(el("h3", { id: "step-heading", tabindex: "-1", text: t("step7.title") }));
      container.appendChild(el("p", { class: "step-subtitle", text: t("step7.subtitle") }));
      var textareaId = "letter-text";
      container.appendChild(el("label", { for: textareaId, class: "field-label", text: t("step7.letterLabel") }));
      var textarea = el("textarea", { id: textareaId, rows: "12", class: "letter-textarea" });
      textarea.value = buildLetter();
      container.appendChild(textarea);
      container.appendChild(el("p", { class: "note-box", text: t("step7.principleNote") }));

      var actions = el("div", { class: "letter-actions" });
      var waBtn = el("button", { type: "button", class: "btn btn-primary", id: "btn-send-whatsapp", text: t("step7.sendWhatsapp") });
      var copyBtn = el("button", { type: "button", class: "btn btn-secondary", id: "btn-copy-text", text: t("step7.copyText") });
      var status = el("span", { id: "send-status", class: "send-status", role: "status", "aria-live": "polite" });
      actions.appendChild(waBtn);
      actions.appendChild(copyBtn);
      actions.appendChild(status);
      container.appendChild(actions);
      container.appendChild(el("p", { class: "muted small", text: t("step7.logNote") }));

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
    return {
      guestTypes: Array.from(state.guestTypes),
      intent: state.intent,
      template: currentTemplateId(),
      templateManual: state.templateManual,
      tone: state.tone,
      cards: Array.from(state.cards),
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
    els.nextBtn.textContent = state.step === 6 ? t("wizard.finish") : t("wizard.next");
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
