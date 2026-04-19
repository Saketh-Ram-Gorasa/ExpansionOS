import type {
  AnalysisViewModel,
  AnalyzeStage,
  BuyerDelta,
  DebateModel,
  MemoModel,
  PainSegment,
  SegmentCandidate,
  StageStatus,
  WedgeRecommendation,
  YCReviewModel,
} from "@/components/expansion/types";

export type FormSnapshot = {
  productDescription: string;
  currentIcp: {
    buyerRole: string;
    industry: string;
    companySize: string;
    geography: string;
    problemFocus: string;
  };
};

const STAGES: Array<{ id: AnalyzeStage["id"]; label: string }> = [
  { id: "market_scout", label: "Market Scout" },
  { id: "buyer_agent", label: "Buyer Agent" },
  { id: "pain_agent", label: "Pain Agent" },
  { id: "wedge_agent", label: "Wedge Agent" },
  { id: "skeptic_agent", label: "Skeptic Agent" },
  { id: "yc_review_agent", label: "YC Review Agent" },
  { id: "memo_agent", label: "Memo Agent" },
];

export const EMPTY_ANALYSIS: AnalysisViewModel = {
  status: "idle",
  stages: STAGES.map((s) => ({ ...s, status: "pending" })),
  segments: [],
  buyerDeltas: [],
  painMap: [],
  rawResults: {},
};

export const LOADING_STAGES: AnalyzeStage[] = STAGES.map((s, index) => ({
  ...s,
  status: index === 0 ? "running" : "pending",
}));

export function normalizeAnalyzeResponse(payload: unknown): AnalysisViewModel {
  const root = asRecord(payload) ?? {};
  const results = asRecord(root.results) ?? root;

  const segments = parseSegments(results, root);
  const buyerDeltas = parseBuyerDeltas(results);
  const painMap = parsePainMap(results);
  const wedge = parseWedge(results);
  const debate = parseDebate(results);
  const ycReview = parseYC(results);
  const memo = parseMemo(results);

  const status = toStatus(str(root.status));
  const stages = deriveStages(root, status, {
    market_scout: segments.length > 0,
    buyer_agent: buyerDeltas.length > 0,
    pain_agent: painMap.length > 0,
    wedge_agent: Boolean(wedge),
    skeptic_agent: Boolean(debate),
    yc_review_agent: Boolean(ycReview),
    memo_agent: Boolean(memo),
  });

  return {
    analysisId: str(root.analysis_id) ?? str(root.analysisId),
    timestamp: str(root.timestamp),
    status,
    stages,
    segments,
    buyerDeltas,
    painMap,
    wedge,
    debate,
    ycReview,
    memo,
    rawResults: results,
  };
}

export function hasAnyUsableOutput(model: AnalysisViewModel): boolean {
  return (
    model.segments.length > 0 ||
    model.buyerDeltas.length > 0 ||
    model.painMap.length > 0 ||
    Boolean(model.wedge) ||
    Boolean(model.debate) ||
    Boolean(model.ycReview) ||
    Boolean(model.memo)
  );
}

export function buildSummaryMemoExport(form: FormSnapshot, analysis: AnalysisViewModel): string {
  const memo = analysis.memo;
  const wedge = analysis.wedge;
  const top = analysis.segments[0];

  const lines = [
    "ExpansionOS Summary Memo",
    `Generated: ${new Date().toISOString()}`,
    `Analysis ID: ${analysis.analysisId ?? "n/a"}`,
    "",
    "Input",
    `- Product: ${form.productDescription || "n/a"}`,
    `- ICP Buyer: ${form.currentIcp.buyerRole || "n/a"}`,
    `- ICP Industry: ${form.currentIcp.industry || "n/a"}`,
    `- ICP Company Size: ${form.currentIcp.companySize || "n/a"}`,
    "",
    "Recommendation",
    `- Segment: ${memo?.recommendedSegment ?? top?.name ?? "n/a"}`,
    `- Why now: ${memo?.whyNow ?? "n/a"}`,
    `- Minimum wedge: ${memo?.minimumWedge ?? wedge?.wedgeFeature ?? "n/a"}`,
    `- Go/No-go: ${memo?.goNoGo ?? "n/a"}`,
    "",
    "30-day proof plan",
    ...(memo?.next30DayPlan.length ? memo.next30DayPlan : ["n/a"]).map((item) => `- ${item}`),
  ];
  return lines.join("\n");
}

export function readErrorMessage(payload: unknown): string | undefined {
  const root = asRecord(payload);
  if (!root) {
    return undefined;
  }
  return str(root.error) ?? str(root.message) ?? str(root.detail);
}

function parseSegments(results: Record<string, unknown>, root: Record<string, unknown>): SegmentCandidate[] {
  const list = firstArray([
    arr(path(results, ["segments"])),
    arr(path(results, ["segments", "candidate_segments"])),
    arr(path(results, ["market_scout", "candidate_segments"])),
    arr(path(root, ["candidate_segments"])),
  ]);
  const parsed: SegmentCandidate[] = [];
  list.forEach((item, i) => {
    const r = asRecord(item);
    if (!r) return;
    parsed.push({
      name: str(r.name) ?? str(r.segment_name) ?? str(r.segment) ?? `Candidate ${i + 1}`,
      adjacencyReason: str(r.adjacency_reason) ?? str(r.signal),
      estimatedSizeSignal: str(r.estimated_size_signal),
      fitScore: num(r.fit_score_1_to_10),
      confidence: num(r.confidence),
      overlap: str(r.overlap),
      risk: str(r.risk),
      wedgeHint: str(r.wedge),
      evidence: strings(r.evidence),
      assumptions: strings(r.assumptions),
    });
  });
  return parsed;
}

function parseBuyerDeltas(results: Record<string, unknown>): BuyerDelta[] {
  const list = firstArray([
    arr(path(results, ["buyer_map", "segments"])),
    arr(path(results, ["buyer_agent", "segments"])),
    arr(path(results, ["buyer_map"])),
  ]);
  const parsed: BuyerDelta[] = [];
  list.forEach((item, i) => {
    const r = asRecord(item);
    if (!r) return;
    const roles = asRecord(r.buyer_roles) ?? {};
    const delta = asRecord(r.delta_from_current_icp) ?? {};
    parsed.push({
      segmentName: str(r.segment_name) ?? str(r.name) ?? `Segment ${i + 1}`,
      primaryBuyer: str(roles.primary_buyer),
      champion: str(roles.champion),
      endUser: str(roles.end_user),
      whoChanges: strings(delta.who_changes),
      whyChanges: strings(delta.why_changes),
      governanceShift: str(delta.governance_or_procurement_shift),
      constraints: strings(r.constraints),
      confidence: num(r.confidence),
    });
  });
  return parsed;
}

function parsePainMap(results: Record<string, unknown>): PainSegment[] {
  const list = firstArray([
    arr(path(results, ["pains", "segment_pains"])),
    arr(path(results, ["pain_agent", "segment_pains"])),
    arr(path(results, ["pains"])),
  ]);
  const parsed: PainSegment[] = [];
  list.forEach((item, i) => {
    const r = asRecord(item);
    if (!r) return;
    const painPoints: PainSegment["painPoints"] = [];
    arr(r.pain_points).forEach((p) => {
      const point = asRecord(p);
      if (!point) return;
      painPoints.push({
        pain: str(point.pain) ?? "Unlabeled pain",
        evidenceType: str(point.evidence_type),
        urgency: str(point.urgency),
        operationalConstraint: str(point.operational_constraint),
      });
    });
    parsed.push({
      segmentName: str(r.segment_name) ?? str(r.name) ?? `Segment ${i + 1}`,
      jobsToBeDone: strings(r.jobs_to_be_done),
      painPoints,
      topUrgencyTriggers: strings(r.top_urgency_triggers),
      confidence: num(r.confidence),
    });
  });
  return parsed;
}

function parseWedge(results: Record<string, unknown>): WedgeRecommendation | undefined {
  const r =
    asRecord(path(results, ["wedge", "recommended_wedge"])) ??
    asRecord(path(results, ["wedge_agent", "recommended_wedge"])) ??
    asRecord(path(results, ["wedge"]));
  if (!r) return undefined;
  return {
    targetSegment: str(r.target_segment),
    wedgeFeature: str(r.wedge_feature) ?? str(r.minimum_wedge),
    whyUnblocksEntry: str(r.why_this_unblocks_entry),
    complexity: str(r.implementation_complexity),
    timelineWeeks: num(r.estimated_timeline_weeks),
    featureDependencies: strings(r.feature_dependencies),
    assumptions: strings(r.assumptions),
    confidence: num(r.confidence),
    alternatives: strings(path(r, ["alternative_wedges"])),
  };
}

function parseDebate(results: Record<string, unknown>): DebateModel | undefined {
  const r =
    asRecord(path(results, ["debate"])) ??
    asRecord(path(results, ["skeptic_agent"])) ??
    asRecord(path(results, ["skeptic"]));
  if (!r) return undefined;
  return {
    bull: firstStrings([strings(r.bull_case), strings(r.bull), strings(r.bull_arguments)]),
    bear: firstStrings([
      strings(r.bear_case),
      strings(r.bear),
      strings(r.bear_arguments),
      strings(r.why_this_could_fail),
      strings(r.top_risks),
    ]),
    verdict: str(r.verdict) ?? str(r.go_no_go),
    confidence: num(r.confidence),
    topRisks: strings(r.top_risks),
    hiddenAssumptions: strings(r.hidden_assumptions),
    requiredChecks: strings(r.required_checks),
  };
}

function parseYC(results: Record<string, unknown>): YCReviewModel | undefined {
  const r = asRecord(path(results, ["yc_review"])) ?? asRecord(path(results, ["yc_review_agent"]));
  if (!r) return undefined;
  const review = asRecord(r.fundability_review) ?? {};
  const keys = ["founder_test", "market_size", "buyer_sharpness", "wedge_clarity", "execution_urgency"];
  const scores: YCReviewModel["scores"] = [];
  keys.forEach((key) => {
    const scoreBlock = asRecord(review[key]);
    if (!scoreBlock) return;
    scores.push({
      key,
      label: key.split("_").map((x) => x[0].toUpperCase() + x.slice(1)).join(" "),
      score: num(scoreBlock.score_1_to_10),
      notes: strings(scoreBlock.notes),
    });
  });
  return {
    verdict: str(r.verdict),
    confidence: num(r.confidence),
    startupVsFeatureVerdict: str(path(r, ["is_startup_vs_feature", "verdict"])),
    startupVsFeatureReason: str(path(r, ["is_startup_vs_feature", "reason"])),
    whyCare: strings(r.why_yc_might_care),
    whyPass: strings(r.why_yc_might_pass),
    topObjections: strings(r.top_objections),
    partnerQuestions: strings(r.partner_questions),
    requiredTests: strings(r.required_30_day_tests),
    pitchOneLiner: str(path(r, ["pitch_rewrite", "one_sentence_pitch"])),
    investorPitch: str(path(r, ["pitch_rewrite", "investor_style_pitch"])),
    scores,
  };
}

function parseMemo(results: Record<string, unknown>): MemoModel | undefined {
  const root = asRecord(path(results, ["memo"])) ?? asRecord(path(results, ["memo_agent"]));
  if (!root) return undefined;
  const memo = asRecord(root.memo) ?? root;
  const verdict = asRecord(root.final_verdict) ?? {};
  return {
    recommendedSegment: str(root.recommended_segment),
    whyNow: str(memo.why_now),
    buyerDelta: str(memo.buyer_delta),
    minimumWedge: str(memo.minimum_wedge),
    risks: strings(memo.risks),
    expansionScore: num(memo.expansion_score_1_to_10),
    exampleAccounts: strings(memo.example_accounts),
    next30DayPlan: strings(memo.next_30_day_plan),
    goNoGo: str(verdict.go_no_go),
    confidence: num(verdict.confidence),
    conditions: strings(verdict.conditions),
  };
}

function deriveStages(
  root: Record<string, unknown>,
  status: AnalysisViewModel["status"],
  hasData: Record<AnalyzeStage["id"], boolean>,
): AnalyzeStage[] {
  const explicit = asRecord(root.step_states) ?? {};
  const active = normalizeStageId(str(root.stage) ?? str(root.current_stage) ?? "");
  return STAGES.map((s) => {
    const explicitStatus = toStageStatus(str(explicit[s.id]));
    const statusFromData =
      status === "completed"
        ? "completed"
        : status === "failed"
          ? hasData[s.id]
            ? "completed"
            : "failed"
          : status === "partial" && active === s.id
            ? "running"
            : hasData[s.id]
              ? "completed"
              : "pending";
    return { ...s, status: explicitStatus ?? statusFromData };
  });
}

function toStatus(value?: string): AnalysisViewModel["status"] {
  const v = (value ?? "").toLowerCase();
  if (v.includes("fail") || v.includes("error")) return "failed";
  if (v.includes("partial") || v.includes("run") || v.includes("progress")) return "partial";
  if (v.includes("complete") || v.includes("done") || v.includes("success")) return "completed";
  return "completed";
}

function toStageStatus(value?: string): StageStatus | undefined {
  const v = (value ?? "").toLowerCase();
  if (!v) return undefined;
  if (v.includes("complete") || v.includes("done")) return "completed";
  if (v.includes("run") || v.includes("progress")) return "running";
  if (v.includes("fail") || v.includes("error")) return "failed";
  return "pending";
}

function normalizeStageId(value: string): AnalyzeStage["id"] {
  const v = value.toLowerCase();
  if (v.includes("buyer")) return "buyer_agent";
  if (v.includes("pain")) return "pain_agent";
  if (v.includes("wedge")) return "wedge_agent";
  if (v.includes("skeptic") || v.includes("debate") || v.includes("bear") || v.includes("bull"))
    return "skeptic_agent";
  if (v.includes("yc")) return "yc_review_agent";
  if (v.includes("memo")) return "memo_agent";
  return "market_scout";
}

function path(record: Record<string, unknown>, keys: string[]): unknown {
  let current: unknown = record;
  for (const key of keys) {
    const obj = asRecord(current);
    if (!obj) return undefined;
    current = obj[key];
  }
  return current;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function arr(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function str(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return undefined;
}

function num(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function strings(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((x) => str(x)).filter((x): x is string => Boolean(x));
  const text = str(value);
  if (!text) return [];
  return text.split(/\r?\n|,/).map((x) => x.trim()).filter(Boolean);
}

function firstArray(candidates: unknown[][]): unknown[] {
  for (const c of candidates) if (c.length) return c;
  return [];
}

function firstStrings(candidates: string[][]): string[] {
  for (const c of candidates) if (c.length) return c;
  return [];
}
