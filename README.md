# ExpansionOS

ExpansionOS is a hackathon MVP that combines market data with multi-agent LLM reasoning to recommend the next adjacent B2B segment to expand into.

## What it does
- Collects product and ICP context from the founder.
- Uses a structured agent pipeline to generate:
  - Adjacent segment candidates
  - Buyer-role shifts
  - Pain and constraints inference
  - Minimum product wedge
  - Bull vs Bear strategic debate
  - YC-style reviewer pass
  - Final expansion memo

## Strategic architecture
- **CrustData**: market/company intelligence source
- **OpenAI**: reasoning and synthesis layer
- **Agent chain**:
  1. `market_scout`
  2. `buyer_agent`
  3. `pain_agent`
  4. `wedge_agent`
  5. `skeptic_agent`
  6. `yc_review_agent`
  7. `memo_agent`

All agent outputs are JSON-structured for deterministic dashboard rendering.

## Repo status
- This repo now includes:
  - Next.js app scaffold
  - PRD: `PRD.md`
  - Visual direction docs: `DESIGN.md`, `uiux.md`, `CHARACTER_DESIGN_RULES.md`
  - Local product strategy + interface docs aligned for demo use

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to run the app.

## Core endpoint

- `POST /analyze`
  - Input: product description + current ICP (+ optional competitors/constraints)
  - Output: ranked adjacent segments, buyer shifts, pain map, wedge, debate, YC review, memo

## Contribution notes
- Keep agent outputs schema-driven.
- Preserve the evidence layer (direct vs inference vs speculation).
- Keep the demo narrative tight: strategy decision, risk framing, and immediate next action.

## License
MIT (adjust as needed for your hackathon submission).