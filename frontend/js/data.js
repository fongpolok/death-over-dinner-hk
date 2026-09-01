/* The "question bank": every selectable option in the wizard, plus the
   conversation-card bank from the dinner-structure reference document.
   Kept separate from wizard logic so the bank can be edited/extended
   without touching how the wizard behaves. */
window.DOD = window.DOD || {};

window.DOD.DATA = {
  guestTypes: [
    { id: "parents", i18n: "opt.parents" },
    { id: "partner", i18n: "opt.partner" },
    { id: "children", i18n: "opt.children" },
    { id: "siblings", i18n: "opt.siblings" },
    { id: "elders", i18n: "opt.elders" },
    { id: "friends", i18n: "opt.friends" },
    { id: "colleagues", i18n: "opt.colleagues" },
    { id: "notsure", i18n: "opt.notsure" }
  ],

  intents: [
    { id: "acp", i18n: "intent.acp", recommends: "acp" },
    { id: "loss", i18n: "intent.loss", recommends: "acp" },
    { id: "repair", i18n: "intent.repair", recommends: "legacy" },
    { id: "legacy", i18n: "intent.legacy", recommends: "legacy" },
    { id: "selfPlan", i18n: "intent.selfPlan", recommends: "acp" },
    { id: "explore", i18n: "intent.explore", recommends: "legacy" }
  ],

  templates: [
    {
      id: "legacy",
      name: "templates.legacy.name",
      purpose: "templates.legacy.purpose",
      fit: "templates.legacy.fit",
      intensity: "templates.legacy.intensity"
    },
    {
      id: "acp",
      name: "templates.acp.name",
      purpose: "templates.acp.purpose",
      fit: "templates.acp.fit",
      intensity: "templates.acp.intensity"
    },
    {
      id: "custom",
      name: "templates.custom.name",
      purpose: "templates.custom.purpose",
      fit: "templates.custom.fit",
      intensity: "templates.custom.intensity"
    }
  ],

  tones: [
    { id: "warm", i18n: "tone.warm" },
    { id: "solemn", i18n: "tone.solemn" },
    { id: "light", i18n: "tone.light" }
  ],

  /* Conversation-card bank, grouped to match the source document's
     three card categories. ACP cards are flagged: their wording is
     explicitly marked in the reference document as pending review by
     a clinical/social-work professional before real-world use. */
  cardGroups: [
    {
      id: "warmup",
      titleI18n: "step5.groupWarmup",
      needsReview: false,
      cards: [
        { id: "w1", i18n: "card.w1" },
        { id: "w2", i18n: "card.w2" }
      ]
    },
    {
      id: "legacy",
      titleI18n: "step5.groupLegacy",
      needsReview: false,
      cards: [
        { id: "l1", i18n: "card.l1" },
        { id: "l2", i18n: "card.l2" },
        { id: "l3", i18n: "card.l3" },
        { id: "l4", i18n: "card.l4" }
      ]
    },
    {
      id: "acp",
      titleI18n: "step5.groupAcp",
      needsReview: true,
      cards: [
        { id: "a1", i18n: "card.a1" },
        { id: "a2", i18n: "card.a2" },
        { id: "a3", i18n: "card.a3" }
      ]
    }
  ]
};
