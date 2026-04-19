# ExpansionOS PRD (v1.1)

## 1) Summary

- **Product**: ExpansionOS
- **Date**: 2026-04-19
- **Owner**: Founder/Team (hackathon implementation)
- **Status**: Ready for implementation
- **Goal**: Build a decision-support web product that recommends the **next adjacent B2B segment** to expand into and the **minimum wedge** needed to enter it, using a small team of LLM agents over market data.
- **Core thesis**:
  - **CrustData = market truth**
  - **OpenAI = strategic reasoning layer**
  - The meaningful value is not “chat with data” but **multi-agent strategic recommendation** and **reconciled output**.

---

## 2) Problem

Startups often know what they currently sell, but have no reliable way to decide:

1. Which adjacent segment is real and investable.
2. Who the real buyers are there.
3. What specific minimal product change unlocks expansion.
4. Whether the wedge is likely a startup-level company opportunity or just another feature.

Current tools offer search and static reports, not a coordinated strategic reasoning workflow with evidence tracking.  
ExpansionOS addresses this with a structured agent chain and structured artifacts for each stage.

---

## 3) Product Value Proposition

- **Users**: founders, operators, GTM leads, strategy-minded PMs.
- **Job-to-be-done**: choose next expansion move in less than 5 minutes with clear rationale and actions.
- **Primary benefit**: converts market data into a **defensible, testable strategy memo** instead of vague “insights”.

---

## 4) User Stories

### Must-have (MVP)
- As a founder, I can enter my current product description and ICP so the system proposes adjacent segments.
- As a founder, I can see who the likely buyer/champion/end-user is in each segment and how they differ from current ICP.
- As a founder, I can review top inferred pains and constraints by segment.
- As a founder, I can see the minimum feature wedge required for the top segment.
- As a founder, I can see a Bull vs Bear argument and confidence score before acting.
- As a founder, I can export a concise expansion memo for demo and internal alignment.

### Should-have (v1.1)
- As a founder, I can run what-if scenarios (target segment style, buyer role, or feature exclusions) and rerun recommendations.
- As a founder, I can view an explicit **evidence layer** separating direct signal, inference, and speculation.
- As a founder, I can get a **YC Review** scoring pass to pressure-test fundability and startup-ness.

### Could-have
- As a founder, I can inspect per-agent prompts and output confidence so I can tune trust.
- As a founder, I can save and revisit prior analyses.

### Won’t-have (v1.0)
- No autonomous outbound lead generation pipeline.
- No long-form PRD generator from scratch.
- No built-in CRM/sales platform.

---

## 5) Scope and Boundaries

### In scope
- Single-page app + `/analyze` backend orchestration route.
- CrustData API ingestion + normalization.
- 6-step sequential structured agent calls (JSON in, JSON out).
- Dashboard showing:
  - Segment leaderboard
  - Buyer delta cards
  - Pain map
  - Minimum wedge
  - Bull vs Bear debate
  - YC Review panel
  - Final expansion memo

### Out of scope
- Full external web crawlers for non-CrustData sourcing.
- CRM integrations.
- Fine-grained analytics/BI exports.

---

## 6) Experience Design (High-level)

- **Input**: one form with:
  - Product description
  - Current ICP (buyer, company profile, segment)
  - Optional competitors
  - Optional constraints (budget/timeline/region)
- **Output dashboard**:
  - Ranked candidate segments with rationale and confidence.
  - Buyer shift and role changes per segment.
  - Pain points, urgency triggers, constraints.
  - Wedge recommendation and effort estimate.
  - Debate panel (Bull, Bear, final verdict).
  - YC Review panel (fundability-style risk/clarity test).
  - Export summary memo.

---

## 7) Agent Architecture (Agentic Workflow)

### Sequence (sequential to keep auditability clear)
1. `market_scout`
2. `buyer_agent`
3. `pain_agent`
4. `wedge_agent`
5. `skeptic_agent`
6. `yc_review_agent` (new)
7. `memo_agent`

Each step receives the prior agent outputs and returns **strict JSON**.

### 7.1 Market Scout Agent
- Inputs: product description, ICP, competitors (optional), raw CrustData search results.
- Outputs:
  - `candidate_segments` (3–5)
  - adjacency rationale
  - segment confidence
  - evidence snippets

### 7.2 Buyer Agent
- Inputs: current ICP + candidate segments.
- Outputs:
  - per-segment buyer map (primary buyer, champion, end user)
  - changed org-level roles
  - overlap and delta from current ICP
  - role-level risks

### 7.3 Pain Agent
- Inputs: segment/company/context metadata.
- Outputs:
  - inferred pains per role
  - operational constraints
  - urgency triggers
  - confidence tier (high/medium/low)

### 7.4 Wedge Agent
- Inputs: product capability summary + segment pains + buyer shifts.
- Outputs:
  - recommended minimal wedge
  - why the wedge unlocks entry
  - implementation complexity and timeline guess

### 7.5 Skeptic Agent
- Inputs: all upstream outputs.
- Outputs:
  - top risks
  - hidden assumptions
  - confidence dampening factors
  - failure scenarios

### 7.6 YC Review Agent (required)
- Purpose: pressure-test startup quality and interview-readiness.
- Inputs:
  - startup idea
  - selected segment/wedge
  - buyer and pain outputs
  - direct evidence and assumptions
- Outputs:
  - verdict (`Strong`, `Maybe`, `Weak`) + confidence
  - startup-vs-feature check
  - top objections + partner-style questions
  - 30-day proof tests
  - pitch rewrite (1-liner + founder-facing framing)

### 7.7 Memo Agent (final synthesizer)
- Inputs: all prior artifacts + YC review.
- Outputs:
  - final memo: recommendation, why now, wedge, risks, proof tests, sample accounts

---

## 8) JSON Contracts

> All prompts require strict JSON output. No free-form unless validated post-structured parse.

### 8.1 `market_scout`
```json
{
  "candidate_segments": [
    {
      "name": "",
      "adjacency_reason": "",
      "estimated_size_signal": "",
      "fit_score_1_to_10": 0,
      "evidence": [],
      "assumptions": [],
      "confidence": 0
    }
  ],
  "method_summary": ""
}
```

### 8.2 `buyer_agent`
```json
{
  "segments": [
    {
      "segment_name": "",
      "buyer_roles": {
        "primary_buyer": "",
        "champion": "",
        "end_user": ""
      },
      "delta_from_current_icp": {
        "who_changes": [],
        "why_changes": [],
        "governance_or_procurement_shift": ""
      },
      "constraints": [],
      "confidence": 0
    }
  ]
}
```

### 8.3 `pain_agent`
```json
{
  "segment_pains": [
    {
      "segment_name": "",
      "jobs_to_be_done": [],
      "pain_points": [
        {
          "pain": "",
          "evidence_type": "direct|inference|speculation",
          "urgency": "low|medium|high",
          "operational_constraint": ""
        }
      ],
      "top_urgency_triggers": [],
      "confidence": 0
    }
  ]
}
```

### 8.4 `wedge_agent`
```json
{
  "recommended_wedge": {
    "target_segment": "",
    "wedge_feature": "",
    "why_this_unblocks_entry": "",
    "implementation_complexity": "low|medium|high",
    "estimated_timeline_weeks": 0,
    "feature_dependencies": [],
    "assumptions": [],
    "confidence": 0
  },
  "alternative_wedges": []
}
```

### 8.5 `skeptic_agent`
```json
{
  "top_risks": [],
  "hidden_assumptions": [],
  "why_this_could_fail": [],
  "confidence_level": "",
  "required_checks": []
}
```

### 8.6 `yc_review_agent`
```json
{
  "verdict": "Strong|Maybe|Weak",
  "confidence": 0.0,
  "fundability_review": {
    "founder_test": {"score_1_to_10": 0, "notes": []},
    "market_size": {"score_1_to_10": 0, "notes": []},
    "buyer_sharpness": {"score_1_to_10": 0, "notes": []},
    "wedge_clarity": {"score_1_to_10": 0, "notes": []},
    "execution_urgency": {"score_1_to_10": 0, "notes": []}
  },
  "why_yc_might_care": [],
  "why_yc_might_pass": [],
  "top_objections": [],
  "is_startup_vs_feature": {
    "verdict": "startup|feature",
    "reason": ""
  },
  "required_30_day_tests": [],
  "partner_questions": [],
  "pitch_rewrite": {
    "one_sentence_pitch": "",
    "investor_style_pitch": ""
  },
  "evidence_layer": {
    "direct_evidence": [],
    "inference": [],
    "speculation": []
  }
}
```

### 8.7 `memo_agent`
```json
{
  "recommended_segment": "",
  "memo": {
    "why_now": "",
    "buyer_delta": "",
    "minimum_wedge": "",
    "risks": [],
    "expansion_score_1_to_10": 0,
    "example_accounts": [],
    "next_30_day_plan": []
  },
  "final_verdict": {
    "go_no_go": "expand|hold|research_more",
    "confidence": 0,
    "conditions": []
  }
}
```

---

## 9) Technical Architecture

### Frontend
- Next.js app.
- Single input form + one dashboard route/page.
- State flow:
  - User submits analysis input → receives analysis ID + structured JSON.
  - Progressive rendering of result cards as each agent completes (if streaming is enabled).
- Required UI modules:
  - `SegmentLeaderboard`
  - `BuyerDeltaPanel`
  - `PainMapPanel`
  - `WedgeCard`
  - `DebatePanel`
  - `YCReviewPanel`
  - `ExpansionMemoPanel`

### Backend
- API route: `POST /analyze`.
- Steps:
  1. Normalize user input.
  2. Fetch market/company data from CrustData.
  3. Run orchestrated agent calls.
  4. Validate JSON schemas.
  5. Return normalized dashboard payload.
- Optional persistence:
  - Save final output to local cache / DB if required in v1.1.

### Model usage strategy
- Use a **cheaper model for extraction/classification** in early agents.
- Use a **stronger reasoning model** for Wedge synthesis + Debate + Memo + YC Agent.
- Keep a strict token budget guard at route level.

---

## 10) API and Data Contracts

### Internal `/analyze` request
```json
{
  "product_description": "",
  "current_icp": {
    "buyer_role": "",
    "industry": "",
    "company_size": "",
    "geography": "",
    "problem_focus": ""
  },
  "competitors": [],
  "constraints": {
    "max_timeline_weeks": 0,
    "budget_usd": 0,
    "region": "",
    "risk_tolerance": "low|medium|high"
  }
}
```

### Internal response summary
```json
{
  "analysis_id": "",
  "status": "completed|partial|failed",
  "timestamp": "",
  "results": {
    "segments": [],
    "buyer_map": {},
    "pains": {},
    "wedge": {},
    "debate": {},
    "yc_review": {},
    "memo": {}
  },
  "meta": {
    "evidence_count": 0,
    "inference_count": 0,
    "model_versions": []
  }
}
```

---

## 11) Non-Functional Requirements

- **Latency target**: first partial response within 8s (with streaming), final within 45s for typical input.
- **Reliability**: graceful fallback to “best-effort” mode if one agent fails.
- **Clarity**: every recommendation includes confidence + evidence tier.
- **Security**: API keys only server-side; no secrets in client.
- **Observability**: structured logs per agent, token usage, duration, confidence, fallback reason.
- **Accessibility**: readable contrast on light/dark variant, keyboard support for panel navigation.
- **Data ethics**: clear “evidence/inference/speculation” layer.

---

## 12) Acceptance Criteria (MVP)

1. User can submit ICP + product and receive 3–5 ranked adjacent segments.
2. For each segment, buyer role shifts are explicit and visible.
3. Each segment has at least 3 pain inferences with urgency and confidence tags.
4. Top segment displays a minimum wedge with complexity/time guess.
5. Debate panel includes bull and bear arguments plus final verdict.
6. YC Review panel provides score, objections, and partner-style questions.
7. Final memo exports one concise recommendation with confidence and next-step test plan.
8. All outputs are strictly JSON-backed and render deterministically.

---

## 13) Success Metrics

- **User outcome**
  - 75% of judges/testers can restate “what to build next” in 10 seconds from memo.
  - 70% report the output is “actionable immediately.”
- **Product quality**
  - At least 80% of critical fields populated for each segment.
  - Debate and YC sections completed for >95% of analyses.
- **Technical**
- 90% of `/analyze` calls under 45s.
  - ≤5% schema validation failures.
  - Fallback used <10% in normal traffic.

---

## 14) Risks and mitigations

- **Hallucinated pain claims**
  - Mitigation: strict evidence tagging and confidence bands.
- **LLM drift / inconsistent JSON**
  - Mitigation: schema validators, retry with lower temperature and re-prompt.
- **OpenAI cost creep**
  - Mitigation: model routing + cached prompts + truncation limits.
- **CrustData freshness mismatch**
  - Mitigation: include data timestamp and confidence decay.
- **Overfitted YC persona**
  - Mitigation: explicit disclosure: “YC-style heuristic review, not official signal.”

---

## 15) Milestones (Hackathon timeline)

### Day 1: Core pipeline
- Set up `/analyze` route and data normalization.
- Implement first 4 agents (Scout/Buyer/Pain/Wedge).
- Build base JSON parser/validators.

### Day 2: Strategy depth
- Add Skeptic + Memo + YC agent.
- Build ranked output dashboard and evidence layer chips.
- Add hard fallback for failed agent responses.

### Day 3: UX + demo polish
- Add Debate panel and YC Lens card.
- Add memo export format.
- Run focused UX pass against design direction and demo flow.

---

## 16) Open questions

- Which CrustData endpoint gives the best adjacent segment signal quality for the first hackathon version?
- Do we restrict YC lens to top-1 segment or all segments?
- Should `/analyze` support history persistence or remain stateless in v1?
- Do we show per-agent token usage inline or in dev-only mode only?

---

## 17) Rollout notes

- This PRD is intentionally opinionated for hackathon speed.
- Keep UI and backend tightly coupled around these JSON artifacts so the “AI is truly working” story is visible and defendable.
