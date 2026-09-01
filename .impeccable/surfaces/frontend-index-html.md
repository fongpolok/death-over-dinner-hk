---
version: 1
slug: "frontend-index-html"
primary_target: "frontend/index.html"
related_targets: ["frontend/css/styles.css"]
---

## Scope & mode

Whole site (`frontend/index.html` + `css/styles.css` + wizard JS): Persuade. Total visual revamp — replace the incumbent cream/red/teal "nonprofit landing page" world entirely; product truth, copy, wizard logic, bilingual TC/EN toggle, and the safety/legal boundaries are preserved unchanged.

## Audience, job, action, proof, constraints

- Audience: HK Cantonese-speaking adult considering hosting a "death over dinner" for their own family/friends (memento mori graduate or vetted direct applicant). Secondary: their eventual invited guests, who may click through from a shared invitation.
- Job: go from "I have a wish to talk about this" to "I understand this is safe, guided, and doable" to "I start the wizard."
- Action: primary CTA "開始籌備我嘅生死晚餐" (start the wizard); secondary "先了解吓點運作" (learn how it works).
- Proof: the 9-stage supported journey, the three support tiers, the explicit legal/ethical boundary section, the crisis-line resources — all real content already written, none invented.
- Constraints: bilingual TC/EN toggle must keep working; wizard step machine, WhatsApp share, and clipboard copy must keep working; ACP/legal content must stay marked pending review; pricing stays "to be confirmed"; org name/logo stay placeholder (now expressed through the new world's own placeholder identity treatment, not the old generic wordmark).

## Chosen direction: "Airborne Letters"

World: HK airmail correspondence (航空信 / 家書). The whole site reads as a letter — onion-skin paper texture, diagonal red-and-blue airmail chevron borders, postal stamps and cancellation marks as UI chrome, typewriter-set headlines, torn/peeling paper reveals between sections. Every section is a distinct piece of correspondence (an aerogramme, a postcard, a stamped card) rather than a generic "card" or "panel."

Palette (Full palette, 4 named roles): onion-skin paper `#f4efe1` (ground), airmail red `#b1272d` (primary accent / stamps), airmail blue `#1a3e72` (secondary accent / secondary stamps), ink `#2b2620` (text, typewriter marks). Existing teal/gold retire; existing red survives as the airmail red role (same hue family, now load-bearing rather than decorative).

Typography: keep Noto Serif HK / Noto Sans HK for CJK+Latin harmony (bilingual coverage no alternative face offers); add a typewriter-character Latin/numeral face for postmark dates, stamp numerals, and small English UI labels — not a banned generic AI display face, chosen for its postal-ephemera character.

Memorable moment: the hero's sealed aerogramme visibly "opens" (a real scroll/peel interaction, not just a static image) to reveal the offer — this is the site's signature interaction and should recur in miniature wherever content is "revealed" (accordion-style reveals in journey/safety sections use the same peel/unfold motion vocabulary).

## Unresolved decisions

None outstanding — resolved during build (see Build record below).

## Build record

- Approved comp: `.impeccable/mocks/hero-approved.png` (sidecar `.impeccable/mocks/hero-approved.json`, `approved: true`), the "Airborne Letters" card from the direction round, generated with nano_banana_pro.
- Resolved: every marketing section became its own piece of mail — About = taped margin notes (not a uniform icon grid), Templates = three differently-bordered invitation cards (brass/red/blue), Journey = a dashed postal-route timeline, Support = perforated postage-denomination cards, Safety = pinned notices plus a double-ruled telegram box for the legal/crisis content.
- Placeholder brand mark shipped at `frontend/assets/logo-placeholder.svg` — a circular postmark bearing "三渡棧" / "MEMENTOS" plus an explicit "暫定品牌 / PLACEHOLDER" cancellation mark.
- DESIGN.md and `.impeccable/design.json` written from the built world (see project root).
- Fixed during inspection: the diagonal endorsement stamp (carrying the old hero-eyebrow copy) initially overlapped the headline on mobile and truncated the English translation — resolved by making it wrap and re-anchoring its rotation per breakpoint; header overflowed horizontally on phones — resolved by dropping the brand subtitle and shrinking the mark under 640px; wizard progress bar animated `width` (layout-thrash finding from `detect.mjs`) — resolved by switching to `transform: scaleX()` plus a separately-positioned plane marker driven by measured pixel width; two safety/note components used a banned colored `border-left` — resolved with a pinned-tack motif and a dashed top/bottom ticket-stub treatment respectively.

## Wizard content redesign (question-bank reorganisation)

The wizard's card bank and flow were rebuilt from `Life and death prog_Question Bank.docx` (~36 source questions), explicitly *not* following deathoverdinner.org's structure (pick a menu → get that menu's cards). New flow, 8 steps:

1. **Why now** — intent selection (unchanged mechanic) plus a new, private, unsent reflection (Q37 from the source doc) — never logged, never in the letter. This is the wizard's own answer to "guide the host to think about life and death while filling in the form."
2–6. **Five life-and-death themes** reorganised from the source document by subject, not by dinner package: Fate/Self/Time, Love & the Unsaid, Meaning/Legacy/Memory, Fear/Awakening/Loss, Medical Wishes & Dignity (needsReview retained on this last one only). Each theme step shows one of the document's heavier questions as a read-only "sit with this" prompt (`.reflection-prompt`, new component — dashed top/bottom rule, italic serif, no colored side border), then lets the host optionally pick 0-5 short cards for the table from that theme. The old single 3-5-card gate now applies globally, checked once on the last theme step (Medical) rather than in its own dedicated step.
3. **Guest audience + logistics (final section, moved per brief)** — who's coming, invitation tone, and date/time/location/host name, all merged into one step immediately before the letter is generated. This replaces the old opening "who's coming" step.
4. **Review & send** — unchanged mechanically; the letter's named template (Legacy/ACP) is now *derived* from whether any Medical-theme card was picked, rather than chosen up front from a menu.

Two real, previously-undetected bugs were found and fixed during this pass (present since the original build, not introduced by the redesign): `.btn[hidden]` was not actually hidden (the `.btn` class's `display:inline-flex` outranked the `[hidden]` UA rule, so the Next button stayed visible on the final wizard step) — fixed with an explicit `.btn[hidden]{display:none}` override; and the wizard's Back button had no `data-i18n` attribute, so it never translated to English — fixed. Also added `scroll-margin-top` to `section` so anchor-nav no longer lands content under the sticky header.
