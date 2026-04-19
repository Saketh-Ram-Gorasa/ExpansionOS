import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 120;

type CandidateSegment = {
  name: string;
  adjacency_reason: string;
  estimated_size_signal: string;
  fit_score_1_to_10: number;
  evidence: string[];
  assumptions: string[];
  confidence: number;
};

type MarketScoutOutput = {
  candidate_segments: CandidateSegment[];
  method_summary: string;
};

type BuyerSegment = {
  segment_name: string;
  buyer_roles: {
    primary_buyer: string;
    champion: string;
    end_user: string;
  };
  delta_from_current_icp: {
    who_changes: string[];
    why_changes: string[];
    governance_or_procurement_shift: string;
  };
  constraints: string[];
  confidence: number;
};

type BuyerAgentOutput = {
  segments: BuyerSegment[];
};

type PainPoint = {
  pain: string;
  evidence_type: "direct" | "inference" | "speculation";
  urgency: "low" | "medium" | "high";
  operational_constraint: string;
};

type SegmentPain = {
  segment_name: string;
  jobs_to_be_done: string[];
  pain_points: PainPoint[];
  top_urgency_triggers: string[];
  confidence: number;
};

type PainAgentOutput = {
  segment_pains: SegmentPain[];
};

type WedgeOutput = {
  recommended_wedge: {
    target_segment: string;
    wedge_feature: string;
    why_this_unblocks_entry: string;
    implementation_complexity: "low" | "medium" | "high";
    estimated_timeline_weeks: number;
    feature_dependencies: string[];
    assumptions: string[];
    confidence: number;
  };
  alternative_wedges: string[];
};

type SkepticOutput = {
  top_risks: string[];
  hidden_assumptions: string[];
  confidence_penalty: number;
  recommended_hard_questions: string[];
  potential_failure_modes: string[];
};

type YcReviewOutput = {
  verdict: "strong" | "maybe" | "weak";
  verdict_confidence: number;
  startup_vs_feature_check: string;
  top_objections: string[];
  partner_questions: string[];
  proof_tests_30_days: string[];
  rewritten_pitch: {
    one_liner: string;
    founder_facing_frame: string;
  };
};

type MemoOutput = {
  summary: string;
  recommended_segment: string;
  why_now: string;
  minimum_wedge: string;
  risks: string[];
  sample_accounts: string[];
  execution_plan_90_days: string[];
  confidence: number;
};

type AnalysisRequest = {
  productDescription: string;
  currentIcp: {
    industry: string[];
    companySize?: string;
    buyerRoles?: string[];
    notes?: string;
  };
  optionalCompetitors?: string[];
  constraints?: {
    region?: string;
    budget?: string;
    timeline_weeks?: number;
    excluded_features?: string[];
  };
  what_if?: Record<string, string | string[] | boolean | number>;
};

type AnalyzeResponse = {
  request: AnalysisRequest;
  market_scout: MarketScoutOutput;
  buyer_agent: BuyerAgentOutput;
  pain_agent: PainAgentOutput;
  wedge_agent: WedgeOutput;
  skeptic_agent: SkepticOutput;
  yc_review_agent: YcReviewOutput;
  memo_agent: MemoOutput;
  metadata: {
    generatedAt: string;
    modelUsed: string;
    sources: {
      crustDataUsed: boolean;
      openAiUsed: boolean;
    };
    executionMs: number;
  };
};

const DEFAULT_OPENAI_MODEL = "gpt-4.1-mini";
const DEFAULT_SUMMARIZER_MODEL = "gpt-4.1";

const DEFAULT_MARKET_CONTEXT = [
  "Adjacent compliance and regulated workflows share buyer overlap patterns.",
  "Role concentration is often highest in operations and RevOps leaders.",
];

const DEFAULT_COMPETITORS = ["Not provided"];
type CrustDataSignal = { label: string; value: string };

const FALLBACK_SEGMENTS: CandidateSegment[] = [
  {
    name: "InsurTech Operations",
    adjacency_reason:
      "Strong procedural overlap with compliance workflows, manual evidence handling, and review queues.",
    estimated_size_signal: "Mid-market demand for workflow control and auditability remains under served.",
    fit_score_1_to_10: 9,
    evidence: ["industry adjacency signals", "governance overlap", "role continuity"],
    assumptions: [
      "Current product has configurable routing hooks.",
      "Small onboarding footprint can serve regulated controls.",
    ],
    confidence: 84,
  },
  {
    name: "Payroll Intelligence",
    adjacency_reason:
      "HR and finance process orchestration shares similar approval and exception workflows.",
    estimated_size_signal:
      "Potential volume expansion through ops-heavy teams with recurring compliance checkpoints.",
    fit_score_1_to_10: 7,
    evidence: ["workflow graph signals", "cross-team adoption pattern"],
    assumptions: ["requires payroll domain connectors", "data residency expectations are stricter"],
    confidence: 71,
  },
  {
    name: "B2B Lending Ops",
    adjacency_reason:
      "Loan processing introduces stronger validation and exception escalation complexity.",
    estimated_size_signal:
      "Higher ACV potential with lower conversion speed and heavier policy controls.",
    fit_score_1_to_10: 6,
    evidence: ["evidence review chain", "procurement friction pattern"],
    assumptions: ["requires stronger enterprise controls", "longer pilot commitments"],
    confidence: 62,
  },
];

const FALLBACK_BUYER: BuyerSegment[] = [
  {
    segment_name: "InsurTech Operations",
    buyer_roles: {
      primary_buyer: "Head of Compliance",
      champion: "Risk Operations Lead",
      end_user: "Claims & policy operations teams",
    },
    delta_from_current_icp: {
      who_changes: ["Compliance leads gain more authority than sales-only buyers"],
      why_changes: ["Regulated proof-of-work is mandatory for expansion"],
      governance_or_procurement_shift: "Procurement now requires legal + security review in parallel.",
    },
    constraints: [
      "Longer security review windows",
      "Higher documentation burden before pilot approvals",
    ],
    confidence: 81,
  },
  {
    segment_name: "Payroll Intelligence",
    buyer_roles: {
      primary_buyer: "Director of People Ops",
      champion: "Finance Operations Manager",
      end_user: "Payroll and reconciliation team",
    },
    delta_from_current_icp: {
      who_changes: ["Ops and finance functions co-own tool selection"],
      why_changes: ["Decision shifts from single revenue owner to operational committee"],
      governance_or_procurement_shift: "Stronger data retention and access governance requirements.",
    },
    constraints: ["PII handling expectations", "Payroll windows define deployment timing"],
    confidence: 72,
  },
  {
    segment_name: "B2B Lending Ops",
    buyer_roles: {
      primary_buyer: "Head of Operations",
      champion: "Credit Risk Lead",
      end_user: "Underwriting and exceptions team",
    },
    delta_from_current_icp: {
      who_changes: ["Credit and risk teams become mandatory reviewers"],
      why_changes: ["Failure modes are financially sensitive, increasing required controls"],
      governance_or_procurement_shift: "Vendor legal addendum and audit controls are mandatory before purchase.",
    },
    constraints: ["Longer procurement cycle", "Manual integration dependencies"],
    confidence: 68,
  },
];

const FALLBACK_PAIN: PainAgentOutput = {
  segment_pains: [
    {
      segment_name: "InsurTech Operations",
      jobs_to_be_done: [
        "Prove compliance decisions with auditable outputs",
        "Coordinate reviews across multiple owners quickly",
      ],
      pain_points: [
        {
          pain: "Evidence is split across tickets, email, and spreadsheets.",
          evidence_type: "direct",
          urgency: "high",
          operational_constraint: "Delay in approvals due to missing audit trail.",
        },
        {
          pain: "Teams repeat re-keying work between tools.",
          evidence_type: "inference",
          urgency: "medium",
          operational_constraint: "Inconsistent workflows raise cycle times and errors.",
        },
      ],
      top_urgency_triggers: [
        "New regulation cycle",
        "Quarterly audit deadline",
        "Increase in exception volume",
      ],
      confidence: 79,
    },
    {
      segment_name: "Payroll Intelligence",
      jobs_to_be_done: [
        "Close payroll anomalies with low operational risk",
        "Standardize exception approvals by policy",
      ],
      pain_points: [
        {
          pain: "Manual exception handoff creates payroll misses.",
          evidence_type: "inference",
          urgency: "medium",
          operational_constraint: "Payroll windows punish slow fixes.",
        },
      ],
      top_urgency_triggers: ["Payroll freeze periods", "Holiday staffing spikes"],
      confidence: 68,
    },
    {
      segment_name: "B2B Lending Ops",
      jobs_to_be_done: [
        "Track approval rationale for each exception",
        "Reduce operational risk from undocumented actions",
      ],
      pain_points: [
        {
          pain: "Case history context is fragmented during escalations.",
          evidence_type: "inference",
          urgency: "high",
          operational_constraint: "Legal exposure grows when context is missing.",
        },
      ],
      top_urgency_triggers: ["Policy amendments", "Loss-rate review cycles"],
      confidence: 67,
    },
  ],
};

function nowIso() {
  return new Date().toISOString();
}

function stableStringifyError(err: unknown) {
  if (err instanceof Error) {
    return err.message;
  }
  return String(err);
}

function pickModel() {
  return process.env.OPENAI_CHAT_MODEL || DEFAULT_OPENAI_MODEL;
}

function pickSummaryModel() {
  return process.env.OPENAI_SUMMARY_MODEL || DEFAULT_SUMMARIZER_MODEL;
}

function sanitizeJson(payload: string) {
  const fenced = payload.match(/```json([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : payload;
  return candidate.trim();
}

function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

async function collectCrustSignals(
  request: AnalysisRequest
): Promise<{ signals: CrustDataSignal[]; used: boolean }> {
  const endpoint = process.env.CRUSTDATA_MARKET_ENDPOINT;
  const apiKey = process.env.CRUSTDATA_API_KEY;

  if (!endpoint || !apiKey) {
    return {
      signals: DEFAULT_MARKET_CONTEXT.map((label) => ({ label, value: "heuristic fallback" })),
      used: false,
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productDescription: request.productDescription,
        currentIcp: request.currentIcp,
        optionalCompetitors: request.optionalCompetitors,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        signals: DEFAULT_MARKET_CONTEXT.map((label) => ({ label, value: "fallback after crust error" })),
        used: false,
      };
    }

    const raw = (await response.json()) as {
      signals?: unknown;
    };
    const candidate = Array.isArray(raw.signals)
      ? raw.signals
          .map((signal) =>
            typeof signal === "string"
              ? { label: signal, value: "crust signal" }
              : signal && typeof signal === "object"
              ? {
                  label: String((signal as Record<string, unknown>).label || "crust signal"),
                  value: String((signal as Record<string, unknown>).value || "raw"),
                }
              : null
          )
          .filter(Boolean) as CrustDataSignal[]
      : [];

    return {
      signals:
        candidate.length > 0
          ? candidate
          : DEFAULT_MARKET_CONTEXT.map((label) => ({ label, value: "fallback when empty" })),
      used: true,
    };
  } catch {
    return {
      signals: DEFAULT_MARKET_CONTEXT.map((label) => ({ label, value: "fallback after fetch exception" })),
      used: false,
    };
  }
}

function normalizeIndustry(input?: string[]) {
  return (input || []).map((entry) => entry.trim()).filter(Boolean);
}

function inferSeedSegmentHints(productDescription: string) {
  const lower = productDescription.toLowerCase();
  if (lower.includes("sales")) {
    return ["SDR enablement", "recruiting ops", "RevOps and pipeline control"];
  }
  if (lower.includes("compliance") || lower.includes("risk")) {
    return ["InsurTech Operations", "B2B Lending Ops", "B2B RegTech"];
  }
  return ["Adjacent SaaS operations", "Ops-heavy mid-market", "Workflow-heavy regulated functions"];
}

async function callStructuredModel<T>(
  systemPrompt: string,
  userPrompt: string,
  fallback: T,
  model: string
): Promise<T> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return fallback;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return fallback;
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) return fallback;

    try {
      const parsed = JSON.parse(sanitizeJson(raw)) as T;
      return parsed;
    } catch {
      return fallback;
    }
  } catch {
    return fallback;
  }
}

async function runMarketScout(input: AnalysisRequest, crustSignals: CrustDataSignal[]): Promise<MarketScoutOutput> {
  const seeds = inferSeedSegmentHints(input.productDescription).join(", ");
  const fallback: MarketScoutOutput = {
    candidate_segments: FALLBACK_SEGMENTS,
    method_summary: `Fallback heuristic from product + seed themes: ${seeds}`,
  };

  return callStructuredModel<MarketScoutOutput>(
    "You are Market Scout Agent in ExpansionOS. Output strict JSON only.",
    `Input:
{
"productDescription": ${JSON.stringify(input.productDescription)},
"industry": ${JSON.stringify(normalizeIndustry(input.currentIcp?.industry))},
"buyerRoles": ${JSON.stringify(input.currentIcp?.buyerRoles || [])},
"competitors": ${JSON.stringify(input.optionalCompetitors || DEFAULT_COMPETITORS)},
      "marketContext": ${JSON.stringify(crustSignals.map((signal) => `${signal.label}: ${signal.value}`))},
"seedThemes": ${JSON.stringify(inferSeedSegmentHints(input.productDescription))}
}

Return JSON schema:
{
  "candidate_segments":[{"name":"","adjacency_reason":"","estimated_size_signal":"","fit_score_1_to_10":0,"evidence":[],"assumptions":[],"confidence":0}],
  "method_summary":""
}`,
    fallback,
    pickModel()
  );
}

async function runBuyerAgent(input: AnalysisRequest, market: MarketScoutOutput): Promise<BuyerAgentOutput> {
  const fallback = { segments: FALLBACK_BUYER };

  return callStructuredModel<BuyerAgentOutput>(
    "You are Buyer Agent in ExpansionOS. Output strict JSON only.",
    `Input:
productDescription=${JSON.stringify(input.productDescription)}
currentIcp=${JSON.stringify(input.currentIcp)}
candidateSegments=${JSON.stringify(market.candidate_segments.map((segment) => segment.name))}

Output strict schema:
{
  "segments":[
    {"segment_name":"","buyer_roles":{"primary_buyer":"","champion":"","end_user":""},"delta_from_current_icp":{"who_changes":[],"why_changes":[],"governance_or_procurement_shift":""},"constraints":[],"confidence":0}
  ]
}`,
    fallback,
    pickModel()
  );
}

async function runPainAgent(
  input: AnalysisRequest,
  market: MarketScoutOutput,
  buyers: BuyerAgentOutput
): Promise<PainAgentOutput> {
  const fallback = FALLBACK_PAIN;

  return callStructuredModel<PainAgentOutput>(
    "You are Pain Agent in ExpansionOS. Output strict JSON only.",
    `Input:
productDescription=${JSON.stringify(input.productDescription)}
currentIcp=${JSON.stringify(input.currentIcp)}
candidateSegments=${JSON.stringify(market.candidate_segments.map((segment) => segment.name))}
buyerSignals=${JSON.stringify(buyers.segments)}

Output strict schema:
{
  "segment_pains":[
    {"segment_name":"","jobs_to_be_done":[],"pain_points":[{"pain":"","evidence_type":"direct|inference|speculation","urgency":"low|medium|high","operational_constraint":""}],"top_urgency_triggers":[],"confidence":0}
  ]
}`,
    fallback,
    pickModel()
  );
}

async function runWedgeAgent(
  input: AnalysisRequest,
  market: MarketScoutOutput,
  buyers: BuyerAgentOutput,
  pains: PainAgentOutput
): Promise<WedgeOutput> {
  const topCandidate = market.candidate_segments[0]?.name || "InsurTech Operations";
  const fallback: WedgeOutput = {
    recommended_wedge: {
      target_segment: topCandidate,
      wedge_feature: "approval routing + evidence export pack",
      why_this_unblocks_entry:
        "It directly solves the highest-confidence manual bottleneck and is the lowest effort signal product change.",
      implementation_complexity: "low",
      estimated_timeline_weeks: 4,
      feature_dependencies: [
        "Audit trail schema",
        "Role-aware routing rules",
        "Export controls with traceability fields",
      ],
      assumptions: [
        "Pilot customers use repeatable review workflows",
        "Core platform exposes event-level decision data",
      ],
      confidence: 82,
    },
    alternative_wedges: [
      "team collaboration snippets + status checkpoints",
      "exception exception playbooks + SLA notifications",
    ],
  };

  return callStructuredModel<WedgeOutput>(
    "You are Wedge Agent in ExpansionOS. Output strict JSON only.",
    `Input:
productDescription=${JSON.stringify(input.productDescription)}
market=${JSON.stringify(market.candidate_segments)}
buyers=${JSON.stringify(buyers.segments)}
pains=${JSON.stringify(pains.segment_pains)}
constraints=${JSON.stringify(input.constraints || {})}

Output strict schema:
{
  "recommended_wedge":{
    "target_segment":"",
    "wedge_feature":"",
    "why_this_unblocks_entry":"",
    "implementation_complexity":"low|medium|high",
    "estimated_timeline_weeks":0,
    "feature_dependencies":[],
    "assumptions":[],
    "confidence":0
  },
  "alternative_wedges":[]
}`,
    fallback,
    pickSummaryModel()
  );
}

async function runSkepticAgent(
  input: AnalysisRequest,
  market: MarketScoutOutput,
  buyers: BuyerAgentOutput,
  pains: PainAgentOutput,
  wedge: WedgeOutput
): Promise<SkepticOutput> {
  const fallback: SkepticOutput = {
    top_risks: [
      "Overestimation of buyer readiness based on indirect signals",
      "Procurement cycles may be slower than timeline estimates",
    ],
    hidden_assumptions: [
      "Evidence workflow is standardized enough for a wedge launch",
      "Pilot accounts accept staged rollout controls",
    ],
    confidence_penalty: 12,
    recommended_hard_questions: [
      "What proof would disprove this segment in 14 days?",
      "Which role can block rollout if not in design reviews?",
    ],
    potential_failure_modes: [
      "Wedge is adopted as internal utility without external GTM pull",
      "Compliance language mismatch between regions stalls pilots",
    ],
  };

  return callStructuredModel<SkepticOutput>(
    "You are Skeptic Agent in ExpansionOS. Output strict JSON only.",
    `Input:
request=${JSON.stringify(input.productDescription)}
marketScout=${JSON.stringify(market.candidate_segments)}
buyerSignals=${JSON.stringify(buyers.segments)}
painMap=${JSON.stringify(pains.segment_pains)}
wedge=${JSON.stringify(wedge.recommended_wedge)}

Output strict schema:
{
  "top_risks":[],
  "hidden_assumptions":[],
  "confidence_penalty":0,
  "recommended_hard_questions":[],
  "potential_failure_modes":[]
}`,
    fallback,
    pickModel()
  );
}

async function runYcReviewAgent(
  input: AnalysisRequest,
  wedge: WedgeOutput,
  pains: PainAgentOutput,
  skeptic: SkepticOutput
): Promise<YcReviewOutput> {
  const fallback: YcReviewOutput = {
    verdict: "maybe",
    verdict_confidence: 75,
    startup_vs_feature_check: "Candidate wedge is narrow, measurable, and could be a standalone wedge if tracked with pilot KPIs.",
    top_objections: skeptic.top_risks,
    partner_questions: [
      "Can the team show one clear metric within 30 days?",
      "What is the distribution of segment economics vs. feature support cost?",
    ],
    proof_tests_30_days: [
      "Run one pilot with two segments and measure approval cycle reduction.",
      "Capture willingness-to-pay signal from two buyer roles.",
    ],
    rewritten_pitch: {
      one_liner: "Build evidence-first workflow controls so adjacent teams can approve with confidence.",
      founder_facing_frame: "A one-quarter wedge that turns regulatory friction into a repeatable product advantage.",
    },
  };

  return callStructuredModel<YcReviewOutput>(
    "You are YC Review Agent in ExpansionOS. Output strict JSON only.",
    `Input:
product=${JSON.stringify(input.productDescription)}
targetSegment=${JSON.stringify(wedge.recommended_wedge.target_segment)}
wedge=${JSON.stringify(wedge.recommended_wedge)}
pains=${JSON.stringify(pains.segment_pains)}
risks=${JSON.stringify(skeptic.top_risks)}

Output strict schema:
{
  "verdict":"strong|maybe|weak",
  "verdict_confidence":0,
  "startup_vs_feature_check":"",
  "top_objections":[],
  "partner_questions":[],
  "proof_tests_30_days":[],
  "rewritten_pitch":{"one_liner":"","founder_facing_frame":""}
}`,
    fallback,
    pickSummaryModel()
  );
}

async function runMemoAgent(
  input: AnalysisRequest,
  segment: MarketScoutOutput,
  buyers: BuyerAgentOutput,
  wedge: WedgeOutput,
  skeptic: SkepticOutput,
  yc: YcReviewOutput
): Promise<MemoOutput> {
  const topSegment = segment.candidate_segments[0]?.name || "InsurTech Operations";
  const fallback: MemoOutput = {
    summary:
      `${topSegment} is the highest-confidence adjacent move with a constrained wedge in approvals and evidence workflows.`,
    recommended_segment: topSegment,
    why_now:
      "Adjacent buyers show measurable process bottlenecks and regulatory pressure this quarter.",
    minimum_wedge: wedge.recommended_wedge.wedge_feature,
    risks: [...skeptic.top_risks, ...yc.top_objections],
    sample_accounts: [
      `${topSegment.split(" ")[0]}Flow`, 
      `${topSegment.includes("Ops") ? "Northstar Ops" : "RisingScale"}`,
      "PilotFirst Compliance",
    ],
    execution_plan_90_days: [
      "Week 1-2: define wedge acceptance criteria and ship proof events",
      "Week 3-6: launch pilot to 2 accounts with feedback loop",
      "Week 7-10: add governance controls and export completeness score",
    ],
    confidence: clampNumber(
      Math.round(segment.candidate_segments[0]?.confidence || 78),
      0,
      100
    ),
  };

  return callStructuredModel<MemoOutput>(
    "You are Memo Agent in ExpansionOS. Output strict JSON only.",
    `Input:
request=${JSON.stringify(input.productDescription)}
segments=${JSON.stringify(segment.candidate_segments)}
buyers=${JSON.stringify(buyers.segments)}
wedge=${JSON.stringify(wedge.recommended_wedge)}
ycVerdict=${JSON.stringify(yc)}

Output strict schema:
{
  "summary":"",
  "recommended_segment":"",
  "why_now":"",
  "minimum_wedge":"",
  "risks":[],
  "sample_accounts":[],
  "execution_plan_90_days":[],
  "confidence":0
}`,
    fallback,
    pickSummaryModel()
  );
}

function toResponseModel(
  request: AnalysisRequest,
  market_scout: MarketScoutOutput,
  buyer_agent: BuyerAgentOutput,
  pain_agent: PainAgentOutput,
  wedge_agent: WedgeOutput,
  skeptic_agent: SkepticOutput,
  yc_review_agent: YcReviewOutput,
  memo_agent: MemoOutput,
  metadata: AnalyzeResponse["metadata"]
): AnalyzeResponse {
  return {
    request,
    market_scout,
    buyer_agent,
    pain_agent,
    wedge_agent,
    skeptic_agent,
    yc_review_agent,
    memo_agent,
    metadata,
  };
}

function parseAnalyzeRequest(payload: unknown): AnalysisRequest {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid request body.");
  }

  const root = payload as Record<string, unknown>;
  const productDescription =
    typeof root.productDescription === "string" ? root.productDescription.trim() : "";
  if (!productDescription) {
    throw new Error("Missing required field: productDescription");
  }

  const currentIcpObj = (root.currentIcp as Record<string, unknown>) || {};
  const industryRaw = Array.isArray(currentIcpObj.industry) ? currentIcpObj.industry : [];
  const currentIcp = {
    industry: industryRaw
      .map((item) => (typeof item === "string" ? item : String(item)))
      .filter(Boolean),
    companySize: typeof currentIcpObj.companySize === "string" ? currentIcpObj.companySize : undefined,
    buyerRoles: Array.isArray(currentIcpObj.buyerRoles)
      ? currentIcpObj.buyerRoles
          .map((item) => (typeof item === "string" ? item : String(item)))
          .filter(Boolean)
      : [],
    notes: typeof currentIcpObj.notes === "string" ? currentIcpObj.notes : undefined,
  };

  const optionalCompetitors = Array.isArray(root.optionalCompetitors)
    ? root.optionalCompetitors
        .map((item) => (typeof item === "string" ? item : String(item)))
        .filter(Boolean)
    : [];

  const constraintsObj = (root.constraints as Record<string, unknown>) || {};
  const constraints = {
    region: typeof constraintsObj.region === "string" ? constraintsObj.region : undefined,
    budget: typeof constraintsObj.budget === "string" ? constraintsObj.budget : undefined,
    timeline_weeks:
      typeof constraintsObj.timeline_weeks === "number" ? constraintsObj.timeline_weeks : undefined,
    excluded_features: Array.isArray(constraintsObj.excluded_features)
      ? constraintsObj.excluded_features
          .map((item) => (typeof item === "string" ? item : String(item)))
          .filter(Boolean)
      : [],
  };

  return {
    productDescription,
    currentIcp,
    optionalCompetitors,
    constraints,
    what_if: root.what_if && typeof root.what_if === "object" ? (root.what_if as Record<string, string | string[] | boolean | number>) : undefined,
  };
}

export async function POST(request: Request) {
  const start = Date.now();
  try {
    const payload = await request.json();
    const requestBody = parseAnalyzeRequest(payload);
    const crustSignals = await collectCrustSignals(requestBody);

    const marketScout = await runMarketScout(requestBody, crustSignals.signals);
    const buyerAgent = await runBuyerAgent(requestBody, marketScout);
    const painAgent = await runPainAgent(requestBody, marketScout, buyerAgent);
    const wedgeAgent = await runWedgeAgent(requestBody, marketScout, buyerAgent, painAgent);
    const skepticAgent = await runSkepticAgent(requestBody, marketScout, buyerAgent, painAgent, wedgeAgent);
    const ycReviewAgent = await runYcReviewAgent(
      requestBody,
      wedgeAgent,
      painAgent,
      skepticAgent
    );
    const memoAgent = await runMemoAgent(requestBody, marketScout, buyerAgent, wedgeAgent, skepticAgent, ycReviewAgent);

    const hasOpenAi = Boolean(process.env.OPENAI_API_KEY);
    const payload = toResponseModel(
      requestBody,
      marketScout,
      buyerAgent,
      painAgent,
      wedgeAgent,
      skepticAgent,
      ycReviewAgent,
      memoAgent,
      {
        generatedAt: nowIso(),
        modelUsed: hasOpenAi ? `${pickModel()} + ${pickSummaryModel()}` : "fallback-sim",
        sources: {
          crustDataUsed: crustSignals.used,
          openAiUsed: hasOpenAi,
        },
        executionMs: Date.now() - start,
      }
    );

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message: stableStringifyError(error),
        },
        requestId: `err-${Date.now()}`,
        timestamp: nowIso(),
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      name: "ExpansionOS Analyze API",
      method: "POST",
      route: "/api/analyze",
      acceptedInput: [
        "productDescription (string)",
        "currentIcp: { industry: string[], companySize?: string, buyerRoles?: string[] }",
        "optionalCompetitors?: string[]",
        "constraints?: { region?: string, budget?: string, timeline_weeks?: number, excluded_features?: string[] }",
      ],
      output: {
        market_scout: "adjacent segment shortlist",
        buyer_agent: "buyer role deltas per segment",
        pain_agent: "pain map and triggers",
        wedge_agent: "minimum feature wedge",
        skeptic_agent: "counterarguments and risk guardrails",
        yc_review_agent: "fundability and startup-vs-feature filter",
        memo_agent: "final strategy memo",
      },
    },
    { status: 200 }
  );
}
