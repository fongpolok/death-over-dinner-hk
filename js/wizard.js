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
    guestNames: "",
    allergy: null, // "yes" | "no" | null (unanswered)
    allergyDetails: "",
    email: "",
    phone: ""
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
          !!state.hostName.trim() && !!state.date && !!state.time &&
          (state.allergy !== "yes" || !!state.allergyDetails.trim());
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

  /* The selected cards, each paired with the theme title it came from --
     shared by both the plain-text letter and the fixed invitation-card
     rendering, so the two presentations can never drift apart. */
  function selectedTopics() {
    var topics = [];
    themeGroups().forEach(function (group) {
      group.cards.forEach(function (card) {
        if (state.cards.has(card.id)) {
          topics.push({ theme: t(group.titleI18n), text: t(card.i18n) });
        }
      });
    });
    return topics;
  }

  function guestGreeting() {
    var names = state.guestNames.trim();
    var sep = window.DOD.currentLang === "tc" ? "、" : ", ";
    return names
      ? names.split(",").map(function (s) { return s.trim(); }).filter(Boolean).join(sep)
      : t("letter.greetingGeneric");
  }

  function templateLabel() {
    return state.dinnerTitle.trim() || t("templates." + deriveTemplateId() + ".name");
  }

  /* Item 9: everything the fixed invitation needs, structured once and
     consumed by both the read-only HTML card and the plain-text version
     used for WhatsApp / clipboard / the email body. */
  function buildLetterData() {
    return {
      orgStatement: t("letter.orgStatement", { host: state.hostName.trim() }),
      greeting: guestGreeting(),
      intro: t("letter.intro." + state.tone),
      template: templateLabel(),
      topics: selectedTopics(),
      flow: [t("letter.flow1"), t("letter.flow2"), t("letter.flow3"), t("letter.flow4"), t("letter.flow5")],
      menu: [t("letter.menu1"), t("letter.menu2"), t("letter.menu3")],
      date: state.date ? formatDate(state.date) : "",
      time: state.time || "",
      location: state.location.trim(),
      allergy: state.allergy === "yes" ? state.allergyDetails.trim() : "",
      closing: t("letter.closing"),
      host: state.hostName.trim(),
      disclaimer: t("letter.disclaimerBody")
    };
  }

  function buildLetterText() {
    var d = buildLetterData();
    var lines = [];
    lines.push(d.orgStatement);
    lines.push("");
    lines.push(d.greeting + (window.DOD.currentLang === "tc" ? "：" : ","));
    lines.push("");
    lines.push(d.intro);
    lines.push("");
    lines.push(t("letter.templateNote", { template: d.template }));
    if (d.topics.length) {
      lines.push("");
      lines.push(t("letter.topicsHeading"));
      d.topics.forEach(function (topic) { lines.push("- " + topic.text + "（" + topic.theme + "）"); });
      lines.push(t("letter.topicsNote"));
    }
    lines.push("");
    lines.push(t("letter.flowHeading"));
    d.flow.forEach(function (line, i) { lines.push((i + 1) + ". " + line); });
    lines.push("");
    lines.push(t("letter.menuHeading"));
    d.menu.forEach(function (line) { lines.push("- " + line); });
    lines.push("");
    lines.push(t("letter.detailsIntro"));
    if (d.date) lines.push(t("letter.detailDate", { date: d.date }));
    if (d.time) lines.push(t("letter.detailTime", { time: d.time }));
    if (d.location) lines.push(t("letter.detailLocation", { location: d.location }));
    if (d.allergy) lines.push(t("letter.detailAllergy", { allergy: d.allergy }));
    lines.push("");
    lines.push(d.closing);
    lines.push("");
    lines.push(t("letter.signOff", { host: d.host }));
    lines.push("");
    lines.push(t("letter.disclaimerHeading") + "：" + d.disclaimer);
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
  function renderThemeStep(container, group, isFirstTheme) {
    container.appendChild(el("h3", { id: "step-heading", tabindex: "-1", text: t(group.titleI18n) }));
    container.appendChild(el("p", { class: "step-subtitle", text: t("theme.subtitle", { picked: state.cards.size }) }));
    // Item 8 (instructions): stated once, on the first theme step, rather
    // than repeated on every one of the five -- skipping a whole theme and
    // picking more than one card within a theme are both fine.
    if (isFirstTheme) {
      container.appendChild(el("div", { class: "note-box" }, [
        el("strong", { text: t("wizard.instructions.title") }),
        el("p", { text: t("wizard.instructions.body") })
      ]));
    }
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

    2: function (container) { renderThemeStep(container, themeGroupForStep(2), true); },
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

      var locationField = textField("location", "field.location", "field.location.ph", state.location, false, function (v) { state.location = v; });
      // Item 10: a wheelchair-accessibility note placed right where the
      // host is already thinking about the venue, not buried elsewhere.
      locationField.appendChild(el("p", { class: "muted small", text: t("field.location.accessibilityNote") }));
      form.appendChild(locationField);

      form.appendChild(textField("guests", "field.guests", "field.guests.ph", state.guestNames, false, function (v) { state.guestNames = v; }));
      container.appendChild(form);

      // Item 8: food allergy / dietary restriction question, with a detail
      // field that only appears (and is only required) when the answer is
      // "yes" -- kept as its own block since it isn't a plain text field.
      var allergyBlock = el("div", { class: "field" });
      allergyBlock.appendChild(el("h4", { text: t("field.allergy.question") }));
      var detailsWrap = el("div", { class: "field", id: "allergy-details-wrap" });
      detailsWrap.hidden = state.allergy !== "yes";
      var detailsInput = el("textarea", { id: "field-allergyDetails", class: "letter-textarea", rows: "2", placeholder: t("field.allergy.detailsPlaceholder") });
      detailsInput.value = state.allergyDetails;
      detailsInput.addEventListener("input", function () { state.allergyDetails = detailsInput.value; refreshNav(); });
      detailsWrap.appendChild(el("label", { for: "field-allergyDetails", text: t("field.allergy.detailsLabel") + " *" }));
      detailsWrap.appendChild(detailsInput);

      renderChoiceList(allergyBlock, [
        { id: "yes", i18n: "field.allergy.yes" },
        { id: "no", i18n: "field.allergy.no" }
      ], {
        type: "radio", name: "allergy", selectedValue: state.allergy,
        groupLabel: t("field.allergy.question"),
        onChange: function (id) {
          state.allergy = id;
          detailsWrap.hidden = id !== "yes";
          refreshNav();
        }
      });
      allergyBlock.appendChild(detailsWrap);
      container.appendChild(allergyBlock);
    },

    8: function (container) {
      container.appendChild(el("h3", { id: "step-heading", tabindex: "-1", text: t("step8.title") }));
      container.appendChild(el("p", { class: "step-subtitle", text: t("step8.subtitle") }));

      // Item 9.5: a fixed, read-only rendering -- no textarea, no editing.
      // The plain-text version used for WhatsApp/copy/email is built from
      // the exact same buildLetterData() so the two can't disagree.
      container.appendChild(el("p", { class: "field-label", text: t("step8.letterLabel") }));
      container.appendChild(renderInvitationCard());
      container.appendChild(el("p", { class: "note-box", text: t("step8.principleNote") }));

      var actions = el("div", { class: "letter-actions" });
      var waBtn = el("button", { type: "button", class: "btn btn-primary", id: "btn-send-whatsapp", text: t("step8.sendWhatsapp") });
      var copyBtn = el("button", { type: "button", class: "btn btn-secondary", id: "btn-copy-text", text: t("step8.copyText") });
      var printBtn = el("button", { type: "button", class: "btn btn-secondary", id: "btn-print-pdf", text: t("step8.printPdf") });
      var status = el("span", { id: "send-status", class: "send-status", role: "status", "aria-live": "polite" });
      actions.appendChild(waBtn);
      actions.appendChild(copyBtn);
      actions.appendChild(printBtn);
      actions.appendChild(status);
      container.appendChild(actions);
      container.appendChild(el("p", { class: "muted small", text: t("download.instructions") }));
      container.appendChild(el("p", { class: "muted small", text: t("step8.logNote") }));

      window.DOD.wireSendActions({
        getText: buildLetterText,
        whatsappBtn: waBtn,
        copyBtn: copyBtn,
        printBtn: printBtn,
        statusEl: status,
        getPayload: buildSubmissionPayload
      });

      // Item 9.6: collect email/phone and actually attempt to send.
      var sendPanel = el("div", { class: "send-panel" });
      sendPanel.appendChild(el("h4", { text: t("letter.sendSection.title") }));
      sendPanel.appendChild(el("p", { class: "step-subtitle", text: t("letter.sendSection.subtitle") }));
      var sendForm = el("div", { class: "field-grid" });

      var emailInput = el("input", { type: "email", id: "field-email", value: state.email, placeholder: t("field.email.ph"), required: "required" });
      emailInput.addEventListener("input", function () { state.email = emailInput.value; refreshNav(); });
      sendForm.appendChild(el("div", { class: "field" }, [
        el("label", { for: "field-email", text: t("field.email") + " *" }),
        emailInput
      ]));

      var phoneInput = el("input", { type: "tel", id: "field-phone", value: state.phone, placeholder: t("field.phone.ph") });
      phoneInput.addEventListener("input", function () { state.phone = phoneInput.value; });
      sendForm.appendChild(el("div", { class: "field" }, [
        el("label", { for: "field-phone", text: t("field.phone") }),
        phoneInput
      ]));
      sendPanel.appendChild(sendForm);

      var emailStatus = el("span", { id: "email-status", class: "send-status", role: "status", "aria-live": "polite" });
      var emailBtn = el("button", { type: "button", class: "btn btn-primary", id: "btn-send-email", text: t("letter.sendEmail") });
      emailBtn.addEventListener("click", function () {
        if (!isValidEmail(state.email)) {
          emailStatus.textContent = t("field.email.error");
          return;
        }
        window.DOD.sendInvitationEmail({
          email: state.email.trim(),
          phone: state.phone.trim(),
          getText: buildLetterText,
          sendBtn: emailBtn,
          statusEl: emailStatus,
          getPayload: buildSubmissionPayload
        });
      });
      var emailActions = el("div", { class: "letter-actions" });
      emailActions.appendChild(emailBtn);
      emailActions.appendChild(emailStatus);
      sendPanel.appendChild(emailActions);
      container.appendChild(sendPanel);
    }
  };

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  /* The read-only invitation itself: org statement, topics, run-of-show +
     menu, then a disclaimer -- item 9's fixed design, built from the same
     structured data as the plain-text version above. */
  function renderInvitationCard() {
    var d = buildLetterData();
    var card = el("div", { class: "invitation-card" });
    card.appendChild(el("div", { class: "invitation-org", text: d.orgStatement }));
    card.appendChild(el("p", { text: d.greeting + (window.DOD.currentLang === "tc" ? "：" : ",") }));
    card.appendChild(el("p", { text: d.intro }));
    card.appendChild(el("p", { text: t("letter.templateNote", { template: d.template }) }));

    if (d.topics.length) {
      card.appendChild(el("h4", { text: t("letter.topicsHeading") }));
      var topicsList = el("ul");
      d.topics.forEach(function (topic) {
        topicsList.appendChild(el("li", { text: topic.text + "（" + topic.theme + "）" }));
      });
      card.appendChild(topicsList);
      card.appendChild(el("p", { class: "muted small", text: t("letter.topicsNote") }));
    }

    card.appendChild(el("h4", { text: t("letter.flowHeading") }));
    var flowList = el("ul");
    d.flow.forEach(function (line) { flowList.appendChild(el("li", { text: line })); });
    card.appendChild(flowList);

    card.appendChild(el("h4", { text: t("letter.menuHeading") }));
    var menuList = el("ul");
    d.menu.forEach(function (line) { menuList.appendChild(el("li", { text: line })); });
    card.appendChild(menuList);

    card.appendChild(el("h4", { text: t("letter.detailsIntro") }));
    var detailsList = el("ul");
    if (d.date) detailsList.appendChild(el("li", { text: t("letter.detailDate", { date: d.date }) }));
    if (d.time) detailsList.appendChild(el("li", { text: t("letter.detailTime", { time: d.time }) }));
    if (d.location) detailsList.appendChild(el("li", { text: t("letter.detailLocation", { location: d.location }) }));
    if (d.allergy) detailsList.appendChild(el("li", { text: t("letter.detailAllergy", { allergy: d.allergy }) }));
    card.appendChild(detailsList);

    card.appendChild(el("p", { text: d.closing }));
    card.appendChild(el("p", { text: t("letter.signOff", { host: d.host }) }));

    var disclaimer = el("div", { class: "invitation-disclaimer" });
    disclaimer.appendChild(el("strong", { text: t("letter.disclaimerHeading") }));
    disclaimer.appendChild(el("p", { text: d.disclaimer }));
    card.appendChild(disclaimer);

    return card;
  }

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
      allergy: state.allergy,
      allergyDetails: state.allergy === "yes" ? state.allergyDetails : "",
      lang: window.DOD.currentLang
      // state.email/state.phone are attached by sendInvitationEmail()
      // itself (to_email/to_phone) rather than duplicated here; the
      // WhatsApp/copy/print actions never need or see them.
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

  var initialised = false;

  window.DOD.wizard = {
    init: function () { initialised = true; init(); },
    // called by app.js after a language switch -- a no-op until init() has
    // actually run (e.g. the precaution gate in wizard.html hasn't been
    // acknowledged yet, so els.content etc. don't exist)
    rerender: function () { if (initialised) renderStep(); },
    getState: function () { return state; }
  };
})();
