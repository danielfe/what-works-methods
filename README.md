# What Works — practical dementia caregiving methods

A calm, searchable field guide of **specific, evidence-informed things to try** when caring
for someone with dementia. Built for caregivers who are tired and short on time: you arrive
with a problem ("she won't bathe", "he asks to go home"), and leave with something concrete to
try in the next ten minutes.

A project of **The Holding Co**. Content is synthesized from the THCo dementia knowledge wiki,
which draws on the Alzheimer's Association, NIA, Alzheimer's Society (UK), NHS, Family Caregiver
Alliance, Dementia UK, Teepa Snow, Pauline Boss, and peer-reviewed sources.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

Stack: React 19 + Vite. No backend, no database — all content lives in `src/data.js`.
A tiny hash router (`#/`, `#/method/<slug>`, `#/about`) keeps it dependency-free and trivially hostable as a static site.

## What's here

- **36 methods** across 6 topics (Talking & connecting, Everyday care, Activity & purpose,
  Sleep & evenings, Home & safety, You the caregiver).
- **Search** by what's happening ("won't shower", "up all night") — weighted toward the
  *situation* a caregiver actually types.
- **Browse / filter** by topic, dementia stage (early/middle/late), effort (in the moment /
  set up once / build a habit), and an honest **evidence label** (research-backed / clinical
  guidance / caregiver-tested).
- **"Hardest right now"** quick entries for the most common crisis moments.
- **Method detail**: the situation it's for, why it works, numbered steps, what to say / what to
  avoid, what to watch out for, sources, and related methods.
- **Tool affordances** ("Coming soon") that hint at the next layer — practice a conversation
  with an AI coach, watch a how-to video, get a printable, set a reminder, build a playlist.

## The method schema

Each method (`src/data.js`) is designed around what a stressed caregiver needs:

| Field | Why it's there |
|---|---|
| `title` | An action, in plain words |
| `summary` | The promise, in one sentence |
| `situations[]` | The trigger — what the caregiver is actually living. Primary search + "Use this when" |
| `topic`, `stages[]`, `effort`, `evidence` | The filter dimensions |
| `why` | The mechanism — builds trust and sticks better than a bare instruction |
| `steps[]` | Concrete how-to |
| `say[]` / `dontSay[]` | Scripts for the hard conversations |
| `watchOut[]` | Cautions and red flags (medical "get it checked" signals) |
| `tool` | A hint at the future tool that helps you *use* the method |
| `sources[]` | Every claim traceable to a reputable origin |
| `related[]` | Methods that pair with this one |

## Honesty notes

- Evidence labels are deliberate and not inflated. Statistics flagged "needs verification" in the
  source wiki (e.g. a "96% of caregivers use therapeutic fibbing" figure, a "40% agitation
  reduction" figure) were **intentionally excluded**.
- This is caregiving support, not medical advice. Medication changes, swallowing problems, sleep
  medication, and any sudden behavior/health change route the user to a clinician. Crisis lines are
  surfaced on the About page and in the caregiver-wellbeing method.
