# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are **hosts (主辦人)** in Hong Kong who want to organize a structured "life and death conversation" dinner for their own family or friends. Two entry paths:

- **Path A — Graduate path (primary/preferred source):** people who completed the organization's separate immersive experience, "memento mori," and were invited at its close to consider hosting a dinner as a next step. They arrive already screened and already trust the organization's philosophy.
- **Path B — Direct path (open to outsiders):** people who never did memento mori but share the org's philosophy. They go through a short (15–20 min) intake conversation, which screens for motivation misalignment (e.g. wanting to arrange after-death logistics, or being in acute family crisis) and assesses whether they're emotionally ready to carry the host role.

The host is always the protagonist and content owner — the org is explicitly a "backstage production team," never the one leading the conversation or deciding the guest list/topics.

Secondary audience: the invited dinner guests (family/friends of the host) — they are never sold to directly; the product's invitation-design guidance exists to protect them from being blindsided.

## Product Purpose

Converts a person's vague wish to "talk about life and death with people close to me" into a concrete, executable, safety-netted real dinner. The site is the entry point into a multi-week supported journey (intake → motivation/purpose interview → theme & dialogue design → guest invitation design → venue/catering coordination → the dinner itself → post-dinner follow-up), run by org staff (dinner coordinator, conversation consultant, optional on-site facilitator, on-call counsellor for higher-intensity dinners).

Success = the host actually holds the dinner, says the thing they wanted to say, and feels it was safe and well-supported — not merely that they filled in a form.

## Positioning

Inverse of the org's own "memento mori" program: memento mori is org-designed, participant-experienced; this dinner is **host-initiated and host-owned, org-supported**. The org is never the content owner.

Versus the model it's explicitly patterned on (deathoverdinner.org, a self-service toolkit), this product's differentiator is a **staffed, tiered support journey** — a named coordinator as single point of contact end-to-end, a conversation consultant who helps design what's actually said, optional on-site facilitation, and a counsellor on call for the higher-intensity ("晚晴版"/ACP) template — rather than a one-time download-and-go kit.

## Operating Context

- Bilingual, **Cantonese-first**: Traditional Chinese (zh-Hant-HK) is the primary voice throughout copy, cards, and forms; English is the secondary/toggled language.
- Three dinner templates the host picks or blends: **傳承版 Legacy** (life story, gratitude, values — lower/mid emotional intensity, recommended default for first-time hosts), **晚晴版 ACP** (explicit end-of-life/medical-care-wish conversation — mid/high intensity, only offered to hosts with some prior preparation), **自訂版 Custom** (host-defined theme).
- A wizard on the site walks the host through setup and generates a shareable "letter"/invitation; submission is sent via a client-side WhatsApp (`wa.me`) share link and optional clipboard copy — the org's server does not send real email or WhatsApp messages itself, it only optionally logs that a submission happened (for the team's own visibility during testing).
- Three support tiers exist behind the scenes (full / half / self-serve kit), priced by tier, with the graduate path (Path A) as a likely candidate for preferential/subsidized pricing — none of this is on the site as real numbers yet.
- Sits alongside a sibling program, "memento mori," referenced throughout as the org's other (org-led, immersive) offering and as this product's primary lead-generation channel.

## Capabilities and Constraints

- Frontend is a static site (plain HTML/CSS/JS: `frontend/index.html`, `css/styles.css`, `js/i18n.js`, `js/data.js`, `js/wizard.js`, `js/whatsapp.js`, `js/app.js`) — works standalone by opening `index.html`, no build step.
- Optional local Flask server (`backend/`) serves the static frontend and writes a local rotating log of submissions for internal visibility only; it is not required for the product to function and sends no real messages itself.
- Undecided/explicitly open: real pricing numbers per tier (shown as "to be confirmed" everywhere); the organization's real name and logo (currently placeholder "三渡棧 Mementos" / `logo-placeholder.svg`); the full text of the dialogue cards and host handbook; the intake-interview question list; the catering/venue partner list; the AD/ACP referral resource list (pending legal/medical advisor confirmation, since relevant HK legislation just took effect in 2026 and implementation details are still developing).

## Brand Commitments

- Working name for the organization: **三渡棧 Mementos** — explicitly a placeholder, not final.
- Program name for this offering: **生死晚餐 Death Over Dinner**, internally also called **Memento Amoris** (paired conceptually with the org's "memento mori" program — mori/amoris naming is intentional and should be preserved).
- Voice: warm, direct, conversational Cantonese register (colloquial 廣東話 written form, not formal written Chinese) — matches the existing site copy; not corporate or clinical.

## Evidence on Hand

- Full planning/spec document already in-repo: `螢幕截圖 2026-08-22 下午1.36.01.md` (structure for eligibility paths, dinner templates, staffing roles, the full 9-stage journey, the day-of run-of-show timing table, dialogue-card design direction, psychological/relational safety considerations, legal/ethical boundaries around AD/ACP, and the three-tier support/pricing model).
- Working frontend already implements the wizard, bilingual copy, and WhatsApp-based submission flow described above.
- No real testimonials, case studies, press, pricing, or finalized legal/medical referral list exist yet — future work must not fabricate any of these; the site currently and correctly marks them as pending/TBC.
- ACP ("晚晴版") conversation-card wording is explicitly flagged in-repo as pending clinical/social-work review before real use.

## Product Principles

1. **The host owns the content; the org stays backstage.** Every surface should reinforce that the org supports rather than directs — no design or copy choice should make the org read as the star or authority over the host's story.
2. **No ambush, ever.** Anything that touches guest-facing invitation design must make the dinner's nature legible up front so a guest can consent to attend with open eyes.
3. **The org never plays lawyer or doctor.** Any AD/ACP-adjacent content stays at the level of general awareness and values conversation, and clearly routes real legal/medical decisions to outside professionals — this boundary is load-bearing, not a style note.
4. **Placeholder facts stay visibly placeholder.** Pricing, org name/logo, and unreviewed clinical wording must not be dressed up as final in the UI — mark uncertainty rather than paper over it.
5. **Emotional intensity is staged, not front-loaded.** Legacy-template (lower intensity) is the safe default entry point; ACP-template (higher intensity) content is gated to hosts with more preparation — this pacing logic should be respected wherever the journey is presented, not just in the planning doc.
