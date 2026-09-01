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
