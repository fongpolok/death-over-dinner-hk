---
name: 生死晚餐 Death Over Dinner (HK)
description: A par-avion letter finally sent — the whole site reads as Hong Kong airmail correspondence.
colors:
  paper: "#f4efe1"
  paper-alt: "#ebe0c7"
  paper-white: "#fbf8f0"
  ink: "#2b2620"
  ink-soft: "#55493c"
  airmail-red: "#b1272d"
  airmail-red-deep: "#8a1e23"
  airmail-blue: "#1a3e72"
  airmail-blue-deep: "#122c52"
  night-post: "#191f34"
  brass: "#a9812f"
  torn-line: "#d9c8a3"
  on-accent: "#ffffff"
  selected-tint: "#fdf1f1"
typography:
  display:
    fontFamily: "Noto Serif HK, PingFang HK, Georgia, serif"
    fontSize: "clamp(2rem, 5vw, 3.4rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Noto Serif HK, PingFang HK, Georgia, serif"
    fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: "Noto Serif HK, PingFang HK, Georgia, serif"
    fontSize: "clamp(1.15rem, 2.5vw, 1.5rem)"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Noto Sans HK, PingFang HK, Microsoft JhengHei, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  body-sm:
    fontFamily: "Noto Sans HK, PingFang HK, Microsoft JhengHei, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
  label:
    fontFamily: "Noto Sans HK, PingFang HK, Microsoft JhengHei, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 700
  caption:
    fontFamily: "Noto Sans HK, PingFang HK, Microsoft JhengHei, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 400
  micro:
    fontFamily: "Noto Sans HK, PingFang HK, Microsoft JhengHei, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
  control:
    fontFamily: "inherit"
    fontSize: "1rem"
    fontWeight: 700
  postmark:
    fontFamily: "Special Elite, Courier New, monospace"
    fontSize: "0.5rem – 0.62rem (fluid: shrinks at the hero-stamp-refit and card breakpoints; see design.json breakpoints)"
    fontWeight: 400
    letterSpacing: "0.02em"
rounded:
  xs: "2px"
  sm: "3px"
  md: "6px"
spacing:
  1: "0.5rem"
  2: "1rem"
  3: "1.5rem"
  4: "2.5rem"
  5: "4rem"
components:
  button-primary:
    backgroundColor: "{colors.airmail-red}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.75rem"
  button-primary-hover:
    backgroundColor: "{colors.airmail-red-deep}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.airmail-blue}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.75rem"
  button-secondary-hover:
    backgroundColor: "{colors.airmail-blue}"
    textColor: "#ffffff"
---

# Design System: 生死晚餐 Death Over Dinner (HK) — Airborne Letters

## Overview

**Creative North Star: "Airborne Letters"**

The site is not a page about a dinner; it is the letter the visitor has been meaning to send. Every surface borrows its materials from Hong Kong par-avion correspondence — onion-skin paper, the diagonal red-and-blue airmail chevron, ink rubber stamps, typewritten postmarks — because the product's actual mechanism is a host finally saying, in person, what a letter would otherwise carry unsent. This is a **Persuade** surface: the world exists to make hosting feel like an act of love a visitor can start today, not a service to browse.

The world was chosen over the roll's own assignment ("The Long Table," a mahjong-table system) specifically because it dramatizes the product's central promise — *the words you never sent* — more directly than any alternative considered, at the acknowledged cost of being the more expected reach for a correspondence metaphor. It replaces the incumbent system entirely: a cream/red/teal "modern nonprofit landing page" with rounded cards and a kicker-led hero, the exact category default this rebuild exists to leave behind.

**Key Characteristics:**
- Every section is a distinct piece of mail — sealed aerogramme, pinned notice, postage-denomination card — never a generic rounded panel.
- The hero visibly unseals on load (one authored moment, skipped under reduced motion).
- Controls are ink rubber stamps: rotated, roughened at the edge via an SVG turbulence filter, never flat rounded buttons.
- Kickers/eyebrows are refused outright (per the project's craft floor); the hero's eyebrow copy survives as a diagonal postal endorsement stamp instead of a pill above the headline.
- Bilingual by construction: Traditional Chinese (Cantonese register) leads, English is a full parallel translation, and every postal motif was built to hold both without truncating either.

## Colors

Warm, paper-toned, and restrained outside its two postal accents — the palette reads as a physical object under lamplight, not a UI theme.

### Primary
- **Airmail Red** (`#b1272d`): the primary accent. Carries the primary CTA, the diagonal endorsement stamp, the postal-route numerals in the journey timeline, and the ACP template's identifying border. Rationed — it marks the thing the story needs, never decoration.

### Secondary
- **Airmail Blue** (`#1a3e72`): the secondary accent. Carries links, the secondary CTA, the wizard's focus ring, and the Custom template's dashed identifying border.

### Neutral
- **Onion-Skin Paper** (`#f4efe1`): the page ground.
- **Aged Paper** (`#ebe0c7`): alternating section band, behind the templates and safety sections.
- **Sheet White** (`#fbf8f0`): the "closest to the pen" surface — envelope interior, cards, the wizard desk.
- **Correspondence Ink** (`#2b2620`): primary text on paper.
- **Faded Ink** (`#55493c`): secondary text, tinted from the ink hue rather than gray, per the project's contrast floor.
- **Night Post** (`#191f34`): the dark ground for the journey timeline and footer — a night airmail sky rather than a generic "dark mode" navy.
- **Brass** (`#a9812f`): decorative only — grommets on the support-tier cards, the placeholder postmark's tone. Never used for text.
- **Torn-Paper Line** (`#d9c8a3`): dividers, dashed borders, deckle-edge suggestion.
- **On-Accent** (`#ffffff`): text/icon color set on any solid accent fill (primary button, badges, `::selection`) — never used as a surface color on its own.
- **Selected Tint** (`#fdf1f1`): the checked/selected background for choice cards in the wizard — a pale wash of airmail red, used only for that one state.

### Named Rules
**The Rationed Red Rule.** Airmail red never decorates; it appears only on the primary action, the thing currently selected, or the topic that needs the most weight (ACP). A page with red on more than a handful of elements has drifted.

## Typography

**Display Font:** Noto Serif HK (with PingFang HK, Georgia, serif)
**Body Font:** Noto Sans HK (with PingFang HK, Microsoft JhengHei, sans-serif)
**Label/Mono Font:** Special Elite (with Courier New, monospace)

**Character:** A formal, warm serif for the letter's own voice (headlines) against a plain sans for the surrounding prose — the same pairing logic as a real typewritten letter with a printed letterhead. Special Elite is reserved entirely for postal marks: postmark numerals, date stamps, small English chrome (nav toggle labels, progress text) — it is never used for body copy, in either language, so it stays a material accent rather than a second competing voice.

### Hierarchy
- **Display** (700, `clamp(2rem, 5vw, 3.4rem)`, 1.25): the hero headline only, always Noto Serif HK.
- **Headline** (700, `clamp(1.5rem, 3.5vw, 2.25rem)`, 1.25): section titles (`h2`).
- **Title** (700, `clamp(1.15rem, 2.5vw, 1.5rem)`, 1.25): card and step headings (`h3`).
- **Body** (400, 1.0625rem, 1.65, max 70ch): running prose.
- **Body-sm** (400, 0.95rem): secondary prose inside compact containers — choice cards, note boxes.
- **Label** (700, 0.9rem): metadata that still needs to read as an instruction — progress text, field labels, "who this tier suits" lines.
- **Caption** (400, 0.85rem): small print — the hero's postal disclaimer, footer meta.
- **Micro** (700, 0.75rem): the smallest UI marks — badges.
- **Control** (700, 1rem, `font: inherit` base): every button label — a control-density size distinct from body text.
- **Postmark label** (400, Special Elite): postal chrome only — never a content label. This role is genuinely multi-step rather than one fixed size, because each postal mark (the brand subtitle, the corner stamp, the diagonal endorsement stamp) is its own small object with its own scale, further reduced at the hero-stamp-refit breakpoint (640px) so it never overlaps the headline in either language. Concrete steps in use: 0.8rem (header brand subtitle), 0.62rem / 0.5rem (endorsement stamp, desktop / mobile), 0.55rem (corner postal stamp, desktop), 0.46rem (corner postal stamp, mobile), 0.58rem (endorsement stamp, current build value). Stitch's single-value `fontSize` field can't hold a set, so these live here in prose as the token's real range rather than each being force-fit into its own frontmatter role.

### Named Rules
**The One-Voice-Per-Material Rule.** Noto Serif HK speaks; Noto Sans HK explains; Special Elite stamps. No component borrows a second family for emphasis — weight and size carry hierarchy instead.

## Layout

Single-column content max-width 72rem, `.container` pattern inherited from the incumbent build. Sections alternate paper / aged-paper / night-post banding for rhythm rather than dividers. The hero is the one asymmetric composition: a padded chevron-striped frame (`.envelope`) containing a white "sheet" (`.envelope-sheet`) that unseals via a clip-path reveal on load. Below the fold, layout returns to conventional stacked sections, each internally organized as a grid of postal-object cards (`auto-fit, minmax(...)`) rather than a fixed column count, so the grid re-flows to one column under ~780px without a hard breakpoint per section. Two deliberate exceptions carry hard breakpoints: the header (nav collapses to a toggled sheet below 720px) and the hero's diagonal endorsement stamp (its rotated footprint is re-sized and re-anchored below 640px so it never overlaps the headline — a fixed-size rotated element cannot rely on fluid layout alone).

## Elevation & Depth

Mostly flat with two deliberate lifts: the envelope frame (`0 18px 40px rgba(25,20,10,0.18)`) reads as a physical object resting on the page, and the wizard panel (`0 12px 40px rgba(25,20,10,0.15)`) reads as a writing surface. Cards otherwise sit flush with a 1px border rather than a shadow — depth in this system comes from *material* (paper layering, ink roughness, grommets, tape) more than from cast shadow.

### Named Rules
**The Object-Not-Panel Rule.** A card earns depth by being a specific postal object (a pinned notice, a taped note, a denomination stamp) before it earns a shadow. Reach for material first.

## Shapes

Corners are small and utilitarian (2px / 3px / 6px) — this is a paper-and-ink world, not a soft-app world, so nothing reaches for a large rounded radius. The 2px step is reserved specifically for objects meant to read as actual paper or card stock (the envelope's inner sheet, the corner postage stamp), which have near-square corners in life; 3px and 6px are the UI-chrome steps (inputs, buttons, panels). Distinctive silhouettes carry the identity beyond radius: the template cards' clipped deckle corner (`clip-path` jagged notch), the support tiers' scalloped perforated edge (`mask-image` radial-gradient repeat), and the buttons' roughened ink-stamp edge (SVG `feTurbulence` + `feDisplacementMap` via `filter: url(#stampRough)`, defined once in `index.html` and shared by every button and badge). Perfect circles (the postmark medallions, tier-card grommet, safety-card pin) are a separate shape category from the corner-radius scale entirely — dots and medallions, not rounded rectangles.

## Components

### Buttons
- **Shape:** 6px radius, rotated -0.6deg, edge roughened by the shared `#stampRough` SVG filter — every button reads as a rubber ink stamp, never a flat rounded rectangle.
- **Primary:** airmail red (`#b1272d`) fill, white text, `0 2px 0 #8a1e23` hard offset for a "stamped down" feel.
- **Secondary:** airmail blue outline and text, fills blue with white text on hover.
- **Disabled:** 0.5 opacity plus a slight desaturation, filter retained.

### Cards / Containers
- **Note cards** (About section): asymmetric, individually rotated (-1.6° / 1.1° / -0.8°), a colored "washi-tape" strip pinned at the top — deliberately not a uniform 3-up icon grid.
- **Template cards:** deckle-clipped corner; each of the three templates carries its own identifying border (brass solid / red solid / blue dashed) rather than a shared treatment, so intensity is legible before reading the copy.
- **Tier cards:** a brass grommet dot top-right, reading as a punched postage denomination.
- **Safety cards:** a pinned-notice tack (a small red circle overlapping the top edge) — not a colored side border, which the project's craft floor bans outright.
- **Legal / crisis boxes:** double-ruled top and bottom border, uppercase Special Elite headings — an official telegram-notice register, reserved for the two highest-stakes disclosures on the page.

### Inputs / Fields
- **Style:** bottom-ruled rather than fully bordered (`border-bottom: 2px solid`), paper-white fill — a ledger-line feel.
- **Focus:** bottom rule shifts to airmail blue.

### Navigation
- Sticky header on paper, dashed (not solid) bottom rule. Mobile collapses to a toggled sheet below 720px; below 640px the brand subtitle is dropped and the mark shrinks rather than letting the row overflow.

### Signature component: the wizard progress line
The step progress is a dashed "postal route" with a solid red fill (`transform: scaleX()`, not `width`, to stay off the layout-thrash path) and a ✈ marker that travels along it via measured `translateX()`, positioned by JS reading the track's rendered width — not a generic progress bar.

### Reflection prompt
- **Character:** something to read, not an instruction to act on — the wizard's mechanism for making the host think about life and death while filling in the form, not just configuring a dinner.
- **Style:** dashed top and bottom rule (the `.note-box` ticket-stub motif, reused), a small Special Elite kicker ("諗吓：" / "Sit with this:"), body set in italic Noto Serif HK, ink-soft color — deliberately quieter than `.note-box`'s upright sans instructions.
- **Content rule:** carries the source question bank's longer, heavier questions; the bank's shorter questions become selectable cards instead. A question never appears in both places.

## Do's and Don'ts

### Do:
- **Do** ration airmail red to the primary action, the selected state, and the ACP template — never as page decoration.
- **Do** give every card family its own fastening motif (tape, grommet, pin, deckle-clip) rather than reusing one card shell everywhere.
- **Do** keep Special Elite confined to postal/numeric chrome; body and headline voice stay Noto Sans/Serif HK.
- **Do** animate the stamp roughness and envelope unseal via `filter`/`clip-path`/`transform`, never `width`/`height`/`margin`.

### Don't:
- **Don't** use a kicker or eyebrow pill above any heading — banned outright by this project's craft floor; use the diagonal endorsement stamp (or omit) instead.
- **Don't** put a colored `border-left`/`border-right` above 1px on any card — this reads as the most recognizable AI-slop tell; use a pin, grommet, or top rule instead.
- **Don't** introduce a large soft-app border radius (12px+) anywhere — this world's corners stay small and utilitarian.
- **Don't** let the diagonal hero stamp's fixed rotated box run past the sheet edge — verify both languages at the narrowest supported width whenever its copy changes.
