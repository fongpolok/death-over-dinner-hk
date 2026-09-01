# 生死晚餐 Death Over Dinner (HK) — prototype

A bilingual (Traditional Chinese / English) invitation site for a Hong
Kong "death over dinner" service, built from `螢幕截圖 2026-08-22
下午1.36.01.md` (the dinner-structure planning document) and modelled on
the step-by-step wizard at deathoverdinner.org.

## What's here

```
frontend/            static site — this is the actual product
  index.html
  css/styles.css
  js/i18n.js          bilingual text dictionary + language-switch helpers
  js/data.js           the "question bank": wizard options + conversation cards
  js/wizard.js         step state machine, validation, letter generation
  js/whatsapp.js        WhatsApp share link, clipboard copy, submission logging
  assets/logo-placeholder.svg

backend/             OPTIONAL local preview + logging server (Python/Flask)
  config.py           tunable settings (env vars, see below)
  logging_setup.py     rotating file + console logging
  app.py               Flask app: serves frontend/, logs submissions

environment.yml       conda environment named "death over dinner hk"
data/                 submissions.log is written here at runtime (gitignored-worthy)
```

## Running it

**Option A — just the website, no Python at all:**
Open `frontend/index.html` directly in a browser. Everything works
(language toggle, wizard, WhatsApp send, copy-to-clipboard) except the
local submission log, which silently no-ops without a server.

**Option B — with the optional Python preview/logging server:**

```bash
conda env create -f environment.yml
conda activate death-over-dinner-hk
python -m backend.app
# then open http://127.0.0.1:5000/
```

Note: the name is `death-over-dinner-hk` (hyphenated), not `death over
dinner hk` as literally requested — conda's environment-name validation
hard-rejects spaces (`CondaValueError: Environment names cannot contain
any of these characters: {':', '/', '#', ' '}`), so a name with spaces
cannot exist as a normal named environment at all.

Tunable parameters (env vars, or CLI flags on `python -m backend.app`):

| Env var | CLI flag | Default | Purpose |
|---|---|---|---|
| `DOD_HOST` | `--host` | `127.0.0.1` | bind address |
| `DOD_PORT` | `--port` | `5000` | port |
| `DOD_DEBUG` | `--debug` | `false` | Flask debug mode |
| `DOD_LOG_LEVEL` | `--log-level` | `INFO` | logging verbosity |
| `DOD_LOG_DIR` | — | `./data` | where `submissions.log` is written |
| `DOD_LOG_MAX_BYTES` | — | `1000000` | log rotation size |
| `DOD_LOG_BACKUP_COUNT` | — | `5` | rotated log files kept |
| `DOD_STATIC_DIR` | — | `./frontend` | what the server serves |

The server does **not** send real email or WhatsApp messages — sending is
entirely client-side (a `wa.me` share link). It only serves the static
files and writes a local log line each time someone generates/sends/copies
an invitation, for your own team's visibility during testing.

## Known content gaps (see chat for the full list)

- Company name/logo: placeholder ("三渡棧 Mementos", `assets/logo-placeholder.svg").
- ACP ("晚晴版") conversation-card wording is flagged in the UI as pending
  clinical/social-work review, per the source planning document.
- Pricing is shown as "to be confirmed" everywhere per the source document.
