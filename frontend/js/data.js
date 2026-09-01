/* The "question bank": every selectable option in the wizard, plus the
   conversation-card bank drawn from "Life and death prog_Question Bank.docx".

   Deliberately NOT deathoverdinner.org's structure (pick a menu, then get
   that menu's card pack). Instead the source document's ~36 questions are
   grouped by the life-and-death issue they actually raise, and each theme
   carries two kinds of content:
     - `reflectionI18n`: one of the document's heavier, longer questions,
       shown read-only as something for the HOST to sit with while they
       fill in the form — never sent anywhere, never printed as a card.
     - `cards`: shorter, table-ready prompts (adapted from the document
       where needed) the host can choose to hand to guests on the night.

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
    { id: "acp", i18n: "intent.acp" },
    { id: "loss", i18n: "intent.loss" },
    { id: "repair", i18n: "intent.repair" },
    { id: "legacy", i18n: "intent.legacy" },
    { id: "selfPlan", i18n: "intent.selfPlan" },
    { id: "explore", i18n: "intent.explore" }
  ],

  tones: [
    { id: "warm", i18n: "tone.warm" },
    { id: "solemn", i18n: "tone.solemn" },
    { id: "light", i18n: "tone.light" }
  ],

  /* Five life-and-death themes, reorganised from the source question bank
     by subject rather than by "dinner package". needsReview marks the one
     theme (medical/dignity) whose wording is explicitly flagged in the
     source document as pending clinical/social-work review. */
  cardGroups: [
    {
      id: "fate",
      titleI18n: "theme.fate.title",
      reflectionI18n: "theme.fate.reflection",
      needsReview: false,
      cards: [
        { id: "f1", i18n: "card.f1" },
        { id: "f2", i18n: "card.f2" },
        { id: "f3", i18n: "card.f3" },
        { id: "f4", i18n: "card.f4" },
        { id: "f5", i18n: "card.f5" }
      ]
    },
    {
      id: "love",
      titleI18n: "theme.love.title",
      reflectionI18n: "theme.love.reflection",
      needsReview: false,
      cards: [
        { id: "lv1", i18n: "card.lv1" },
        { id: "lv2", i18n: "card.lv2" },
        { id: "lv3", i18n: "card.lv3" },
        { id: "lv4", i18n: "card.lv4" },
        { id: "lv5", i18n: "card.lv5" }
      ]
    },
    {
      id: "legacy",
      titleI18n: "theme.legacy.title",
      reflectionI18n: "theme.legacy.reflection",
      needsReview: false,
      cards: [
        { id: "lg1", i18n: "card.lg1" },
        { id: "lg2", i18n: "card.lg2" },
        { id: "lg3", i18n: "card.lg3" },
        { id: "lg4", i18n: "card.lg4" },
        { id: "lg5", i18n: "card.lg5" },
        { id: "lg6", i18n: "card.lg6" }
      ]
    },
    {
      id: "fear",
      titleI18n: "theme.fear.title",
      reflectionI18n: "theme.fear.reflection",
      needsReview: false,
      cards: [
        { id: "fr1", i18n: "card.fr1" },
        { id: "fr2", i18n: "card.fr2" },
        { id: "fr3", i18n: "card.fr3" },
        { id: "fr4", i18n: "card.fr4" },
        { id: "fr5", i18n: "card.fr5" }
      ]
    },
    {
      id: "medical",
      titleI18n: "theme.medical.title",
      reflectionI18n: "theme.medical.reflection",
      needsReview: true,
      cards: [
        { id: "md1", i18n: "card.md1" },
        { id: "md2", i18n: "card.md2" },
        { id: "md3", i18n: "card.md3" },
        { id: "md4", i18n: "card.md4" },
        { id: "md5", i18n: "card.md5" }
      ]
    }
  ]
};
