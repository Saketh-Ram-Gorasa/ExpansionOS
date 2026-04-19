export type RiskTolerance = "low" | "medium" | "high";
export type ImplementationComplexity = "low" | "medium" | "high";
export type UrgencyLevel = "low" | "medium" | "high";
export type EvidenceType = "direct" | "inference" | "speculation";
export type AnalyzeStatus = "completed" | "partial" | "failed";
export type YCVerdict = "Strong" | "Maybe" | "Weak";
export type StartupVsFeatureVerdict = "startup" | "feature";
export type GoNoGoVerdict = "expand" | "hold" | "research_more";

export type ValidationResult<T> = { ok: true; data: T } | { ok: false; errors: string[] };

export type AnalyzeRequest = {
  product_description: string;
  current_icp: {
    buyer_role: string;
    industry: string;
    company_size: string;
    geography: string;
    problem_focus: string;
  };
  competitors: string[];
  constraints: {
    max_timeline_weeks: number;
    budget_usd: number;
    region: string;
    risk_tolerance: RiskTolerance;
  };
};

export type CandidateSegment = {
  name: string;
  adjacency_reason: string;
  estimated_size_signal: string;
  fit_score_1_to_10: number;
  evidence: string[];
  assumptions: string[];
  confidence: number;
};

export type MarketScoutOutput = {
  candidate_segments: CandidateSegment[];
  method_summary: string;
};

export type BuyerAgentOutput = {
  segments: Array<{
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
  }>;
};

export type PainAgentOutput = {
  segment_pains: Array<{
    segment_name: string;
    jobs_to_be_done: string[];
    pain_points: Array<{
      pain: string;
      evidence_type: EvidenceType;
      urgency: UrgencyLevel;
      operational_constraint: string;
    }>;
    top_urgency_triggers: string[];
    confidence: number;
  }>;
};

export type WedgeAgentOutput = {
  recommended_wedge: {
    target_segment: string;
    wedge_feature: string;
    why_this_unblocks_entry: string;
    implementation_complexity: ImplementationComplexity;
    estimated_timeline_weeks: number;
    feature_dependencies: string[];
    assumptions: string[];
    confidence: number;
  };
  alternative_wedges: string[];
};

export type SkepticAgentOutput = {
  top_risks: string[];
  hidden_assumptions: string[];
  why_this_could_fail: string[];
  confidence_level: string;
  required_checks: string[];
};

type ScoreCategory = {
  score_1_to_10: number;
  notes: string[];
};

export type YCReviewOutput = {
  verdict: YCVerdict;
  confidence: number;
  fundability_review: {
    founder_test: ScoreCategory;
    market_size: ScoreCategory;
    buyer_sharpness: ScoreCategory;
    wedge_clarity: ScoreCategory;
    execution_urgency: ScoreCategory;
  };
  why_yc_might_care: string[];
  why_yc_might_pass: string[];
  top_objections: string[];
  is_startup_vs_feature: {
    verdict: StartupVsFeatureVerdict;
    reason: string;
  };
  required_30_day_tests: string[];
  partner_questions: string[];
  pitch_rewrite: {
    one_sentence_pitch: string;
    investor_style_pitch: string;
  };
  evidence_layer: {
    direct_evidence: string[];
    inference: string[];
    speculation: string[];
  };
};

export type MemoAgentOutput = {
  recommended_segment: string;
  memo: {
    why_now: string;
    buyer_delta: string;
    minimum_wedge: string;
    risks: string[];
    expansion_score_1_to_10: number;
    example_accounts: string[];
    next_30_day_plan: string[];
  };
  final_verdict: {
    go_no_go: GoNoGoVerdict;
    confidence: number;
    conditions: string[];
  };
};

export type AnalyzeResults = {
  segments: CandidateSegment[];
  buyer_map: BuyerAgentOutput;
  pains: PainAgentOutput;
  wedge: WedgeAgentOutput;
  debate: SkepticAgentOutput;
  yc_review: YCReviewOutput;
  memo: MemoAgentOutput;
};

export type AnalyzeMeta = {
  evidence_count: number;
  inference_count: number;
  model_versions: string[];
  fallback_steps?: string[];
  errors?: string[];
};

export type AnalyzeResponse = {
  analysis_id: string;
  status: AnalyzeStatus;
  timestamp: string;
  results: AnalyzeResults;
  meta: AnalyzeMeta;
};

const RISK_TOLERANCE: RiskTolerance[] = ["low", "medium", "high"];
const EVIDENCE_TYPES: EvidenceType[] = ["direct", "inference", "speculation"];
const URGENCY_LEVELS: UrgencyLevel[] = ["low", "medium", "high"];
const COMPLEXITY_LEVELS: ImplementationComplexity[] = ["low", "medium", "high"];
const ANALYZE_STATUS: AnalyzeStatus[] = ["completed", "partial", "failed"];
const YC_VERDICTS: YCVerdict[] = ["Strong", "Maybe", "Weak"];
const STARTUP_FEATURE_VERDICTS: StartupVsFeatureVerdict[] = ["startup", "feature"];
const GO_NO_GO: GoNoGoVerdict[] = ["expand", "hold", "research_more"];

function fail<T>(errors: string[]): ValidationResult<T> {
  return { ok: false, errors };
}

function ok<T>(data: T): ValidationResult<T> {
  return { ok: true, data };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isOneOf<T extends string>(value: unknown, allowed: readonly T[]): value is T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value);
}

function readRequiredString(obj: Record<string, unknown>, key: string, errors: string[], path = key): string {
  const value = obj[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push(`${path} must be a non-empty string.`);
    return "";
  }
  return value.trim();
}

function readOptionalString(obj: Record<string, unknown>, key: string, defaultValue = ""): string {
  const value = obj[key];
  if (typeof value !== "string") {
    return defaultValue;
  }
  return value.trim();
}

function readStringArray(
  obj: Record<string, unknown>,
  key: string,
  errors: string[],
  path = key,
  required = false,
): string[] {
  const value = obj[key];
  if (value === undefined && !required) {
    return [];
  }
  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array of strings.`);
    return [];
  }
  const result: string[] = [];
  value.forEach((entry, index) => {
    if (typeof entry !== "string") {
      errors.push(`${path}[${index}] must be a string.`);
      return;
    }
    const trimmed = entry.trim();
    if (trimmed.length > 0) {
      result.push(trimmed);
    }
  });
  return result;
}

function readNonNegativeNumber(
  obj: Record<string, unknown>,
  key: string,
  errors: string[],
  path = key,
  defaultValue = 0,
): number {
  const value = obj[key];
  if (value === undefined) {
    return defaultValue;
  }
  if (!isFiniteNumber(value) || value < 0) {
    errors.push(`${path} must be a non-negative number.`);
    return defaultValue;
  }
  return value;
}

function withPrefix(prefix: string, errors: string[]): string[] {
  return errors.map((err) => `${prefix}: ${err}`);
}

function validateCandidateSegment(value: unknown, path: string): string[] {
  if (!isRecord(value)) {
    return [`${path} must be an object.`];
  }

  const errors: string[] = [];
  const name = readRequiredString(value, "name", errors, `${path}.name`);
  const adjacencyReason = readRequiredString(value, "adjacency_reason", errors, `${path}.adjacency_reason`);
  const estimatedSizeSignal = readRequiredString(value, "estimated_size_signal", errors, `${path}.estimated_size_signal`);
  const fitScore = value.fit_score_1_to_10;
  const confidence = value.confidence;

  if (!isFiniteNumber(fitScore) || fitScore < 1 || fitScore > 10) {
    errors.push(`${path}.fit_score_1_to_10 must be a number between 1 and 10.`);
  }
  if (!isFiniteNumber(confidence) || confidence < 0 || confidence > 1) {
    errors.push(`${path}.confidence must be a number between 0 and 1.`);
  }

  if (!Array.isArray(value.evidence) || value.evidence.some((item) => typeof item !== "string")) {
    errors.push(`${path}.evidence must be an array of strings.`);
  }
  if (!Array.isArray(value.assumptions) || value.assumptions.some((item) => typeof item !== "string")) {
    errors.push(`${path}.assumptions must be an array of strings.`);
  }

  if (name.length === 0 || adjacencyReason.length === 0 || estimatedSizeSignal.length === 0) {
    return errors;
  }
  return errors;
}

function validateScoreCategory(value: unknown, path: string): string[] {
  if (!isRecord(value)) {
    return [`${path} must be an object.`];
  }
  const errors: string[] = [];
  const score = value.score_1_to_10;
  if (!isFiniteNumber(score) || score < 1 || score > 10) {
    errors.push(`${path}.score_1_to_10 must be a number between 1 and 10.`);
  }
  if (!Array.isArray(value.notes) || value.notes.some((item) => typeof item !== "string")) {
    errors.push(`${path}.notes must be an array of strings.`);
  }
  return errors;
}

export function validateAnalyzeRequest(input: unknown): ValidationResult<AnalyzeRequest> {
  if (!isRecord(input)) {
    return fail(["Request body must be a JSON object."]);
  }

  const errors: string[] = [];
  const productDescription = readRequiredString(input, "product_description", errors);

  const icp = input.current_icp;
  if (!isRecord(icp)) {
    errors.push("current_icp must be an object.");
  }

  const currentIcpRecord = isRecord(icp) ? icp : {};
  const currentIcp = {
    buyer_role: readRequiredString(currentIcpRecord, "buyer_role", errors, "current_icp.buyer_role"),
    industry: readRequiredString(currentIcpRecord, "industry", errors, "current_icp.industry"),
    company_size: readRequiredString(currentIcpRecord, "company_size", errors, "current_icp.company_size"),
    geography: readRequiredString(currentIcpRecord, "geography", errors, "current_icp.geography"),
    problem_focus: readRequiredString(currentIcpRecord, "problem_focus", errors, "current_icp.problem_focus"),
  };

  const competitors = readStringArray(input, "competitors", errors, "competitors", false);

  const constraintsRaw = input.constraints;
  if (constraintsRaw !== undefined && !isRecord(constraintsRaw)) {
    errors.push("constraints must be an object.");
  }
  const constraintsRecord = isRecord(constraintsRaw) ? constraintsRaw : {};
  const riskToleranceRaw = constraintsRecord.risk_tolerance;
  const riskTolerance: RiskTolerance = isOneOf(riskToleranceRaw, RISK_TOLERANCE) ? riskToleranceRaw : "medium";
  if (riskToleranceRaw !== undefined && !isOneOf(riskToleranceRaw, RISK_TOLERANCE)) {
    errors.push("constraints.risk_tolerance must be one of low|medium|high.");
  }

  const constraints = {
    max_timeline_weeks: readNonNegativeNumber(
      constraintsRecord,
      "max_timeline_weeks",
      errors,
      "constraints.max_timeline_weeks",
      0,
    ),
    budget_usd: readNonNegativeNumber(constraintsRecord, "budget_usd", errors, "constraints.budget_usd", 0),
    region: readOptionalString(constraintsRecord, "region", ""),
    risk_tolerance: riskTolerance,
  };

  if (errors.length > 0) {
    return fail(errors);
  }

  return ok({
    product_description: productDescription,
    current_icp: currentIcp,
    competitors,
    constraints,
  });
}

export function validateMarketScoutOutput(input: unknown): ValidationResult<MarketScoutOutput> {
  if (!isRecord(input)) {
    return fail(["market_scout output must be an object."]);
  }

  const errors: string[] = [];
  if (!Array.isArray(input.candidate_segments)) {
    errors.push("candidate_segments must be an array.");
  } else {
    if (input.candidate_segments.length === 0) {
      errors.push("candidate_segments must have at least one segment.");
    }
    input.candidate_segments.forEach((segment, index) => {
      errors.push(...validateCandidateSegment(segment, `candidate_segments[${index}]`));
    });
  }

  if (typeof input.method_summary !== "string" || input.method_summary.trim().length === 0) {
    errors.push("method_summary must be a non-empty string.");
  }

  return errors.length ? fail(errors) : ok(input as MarketScoutOutput);
}

export function validateBuyerAgentOutput(input: unknown): ValidationResult<BuyerAgentOutput> {
  if (!isRecord(input)) {
    return fail(["buyer_agent output must be an object."]);
  }
  const errors: string[] = [];

  if (!Array.isArray(input.segments)) {
    errors.push("segments must be an array.");
    return fail(errors);
  }

  input.segments.forEach((segment, index) => {
    const path = `segments[${index}]`;
    if (!isRecord(segment)) {
      errors.push(`${path} must be an object.`);
      return;
    }

    readRequiredString(segment, "segment_name", errors, `${path}.segment_name`);

    const buyerRoles = segment.buyer_roles;
    if (!isRecord(buyerRoles)) {
      errors.push(`${path}.buyer_roles must be an object.`);
    } else {
      readRequiredString(buyerRoles, "primary_buyer", errors, `${path}.buyer_roles.primary_buyer`);
      readRequiredString(buyerRoles, "champion", errors, `${path}.buyer_roles.champion`);
      readRequiredString(buyerRoles, "end_user", errors, `${path}.buyer_roles.end_user`);
    }

    const delta = segment.delta_from_current_icp;
    if (!isRecord(delta)) {
      errors.push(`${path}.delta_from_current_icp must be an object.`);
    } else {
      readStringArray(delta, "who_changes", errors, `${path}.delta_from_current_icp.who_changes`, true);
      readStringArray(delta, "why_changes", errors, `${path}.delta_from_current_icp.why_changes`, true);
      readRequiredString(
        delta,
        "governance_or_procurement_shift",
        errors,
        `${path}.delta_from_current_icp.governance_or_procurement_shift`,
      );
    }

    if (!Array.isArray(segment.constraints) || segment.constraints.some((item) => typeof item !== "string")) {
      errors.push(`${path}.constraints must be an array of strings.`);
    }

    if (!isFiniteNumber(segment.confidence) || segment.confidence < 0 || segment.confidence > 1) {
      errors.push(`${path}.confidence must be a number between 0 and 1.`);
    }
  });

  return errors.length ? fail(errors) : ok(input as BuyerAgentOutput);
}

export function validatePainAgentOutput(input: unknown): ValidationResult<PainAgentOutput> {
  if (!isRecord(input)) {
    return fail(["pain_agent output must be an object."]);
  }

  const errors: string[] = [];
  if (!Array.isArray(input.segment_pains)) {
    errors.push("segment_pains must be an array.");
    return fail(errors);
  }

  input.segment_pains.forEach((segmentPain, index) => {
    const path = `segment_pains[${index}]`;
    if (!isRecord(segmentPain)) {
      errors.push(`${path} must be an object.`);
      return;
    }

    readRequiredString(segmentPain, "segment_name", errors, `${path}.segment_name`);
    readStringArray(segmentPain, "jobs_to_be_done", errors, `${path}.jobs_to_be_done`, true);
    readStringArray(segmentPain, "top_urgency_triggers", errors, `${path}.top_urgency_triggers`, true);

    if (!isFiniteNumber(segmentPain.confidence) || segmentPain.confidence < 0 || segmentPain.confidence > 1) {
      errors.push(`${path}.confidence must be a number between 0 and 1.`);
    }

    if (!Array.isArray(segmentPain.pain_points)) {
      errors.push(`${path}.pain_points must be an array.`);
      return;
    }

    segmentPain.pain_points.forEach((painPoint, painIndex) => {
      const painPath = `${path}.pain_points[${painIndex}]`;
      if (!isRecord(painPoint)) {
        errors.push(`${painPath} must be an object.`);
        return;
      }
      readRequiredString(painPoint, "pain", errors, `${painPath}.pain`);
      if (!isOneOf(painPoint.evidence_type, EVIDENCE_TYPES)) {
        errors.push(`${painPath}.evidence_type must be direct|inference|speculation.`);
      }
      if (!isOneOf(painPoint.urgency, URGENCY_LEVELS)) {
        errors.push(`${painPath}.urgency must be low|medium|high.`);
      }
      readRequiredString(painPoint, "operational_constraint", errors, `${painPath}.operational_constraint`);
    });
  });

  return errors.length ? fail(errors) : ok(input as PainAgentOutput);
}

export function validateWedgeAgentOutput(input: unknown): ValidationResult<WedgeAgentOutput> {
  if (!isRecord(input)) {
    return fail(["wedge_agent output must be an object."]);
  }
  const errors: string[] = [];
  const wedge = input.recommended_wedge;
  if (!isRecord(wedge)) {
    errors.push("recommended_wedge must be an object.");
  } else {
    readRequiredString(wedge, "target_segment", errors, "recommended_wedge.target_segment");
    readRequiredString(wedge, "wedge_feature", errors, "recommended_wedge.wedge_feature");
    readRequiredString(wedge, "why_this_unblocks_entry", errors, "recommended_wedge.why_this_unblocks_entry");
    if (!isOneOf(wedge.implementation_complexity, COMPLEXITY_LEVELS)) {
      errors.push("recommended_wedge.implementation_complexity must be low|medium|high.");
    }
    if (
      !isFiniteNumber(wedge.estimated_timeline_weeks) ||
      wedge.estimated_timeline_weeks < 0 ||
      !Number.isInteger(wedge.estimated_timeline_weeks)
    ) {
      errors.push("recommended_wedge.estimated_timeline_weeks must be a non-negative integer.");
    }
    if (!Array.isArray(wedge.feature_dependencies) || wedge.feature_dependencies.some((item) => typeof item !== "string")) {
      errors.push("recommended_wedge.feature_dependencies must be an array of strings.");
    }
    if (!Array.isArray(wedge.assumptions) || wedge.assumptions.some((item) => typeof item !== "string")) {
      errors.push("recommended_wedge.assumptions must be an array of strings.");
    }
    if (!isFiniteNumber(wedge.confidence) || wedge.confidence < 0 || wedge.confidence > 1) {
      errors.push("recommended_wedge.confidence must be a number between 0 and 1.");
    }
  }

  if (!Array.isArray(input.alternative_wedges) || input.alternative_wedges.some((item) => typeof item !== "string")) {
    errors.push("alternative_wedges must be an array of strings.");
  }

  return errors.length ? fail(errors) : ok(input as WedgeAgentOutput);
}

export function validateSkepticAgentOutput(input: unknown): ValidationResult<SkepticAgentOutput> {
  if (!isRecord(input)) {
    return fail(["skeptic_agent output must be an object."]);
  }
  const errors: string[] = [];
  if (!Array.isArray(input.top_risks) || input.top_risks.some((item) => typeof item !== "string")) {
    errors.push("top_risks must be an array of strings.");
  }
  if (!Array.isArray(input.hidden_assumptions) || input.hidden_assumptions.some((item) => typeof item !== "string")) {
    errors.push("hidden_assumptions must be an array of strings.");
  }
  if (!Array.isArray(input.why_this_could_fail) || input.why_this_could_fail.some((item) => typeof item !== "string")) {
    errors.push("why_this_could_fail must be an array of strings.");
  }
  if (typeof input.confidence_level !== "string" || input.confidence_level.trim().length === 0) {
    errors.push("confidence_level must be a non-empty string.");
  }
  if (!Array.isArray(input.required_checks) || input.required_checks.some((item) => typeof item !== "string")) {
    errors.push("required_checks must be an array of strings.");
  }
  return errors.length ? fail(errors) : ok(input as SkepticAgentOutput);
}

export function validateYCReviewOutput(input: unknown): ValidationResult<YCReviewOutput> {
  if (!isRecord(input)) {
    return fail(["yc_review_agent output must be an object."]);
  }
  const errors: string[] = [];

  if (!isOneOf(input.verdict, YC_VERDICTS)) {
    errors.push("verdict must be Strong|Maybe|Weak.");
  }
  if (!isFiniteNumber(input.confidence) || input.confidence < 0 || input.confidence > 1) {
    errors.push("confidence must be a number between 0 and 1.");
  }

  const fundability = input.fundability_review;
  if (!isRecord(fundability)) {
    errors.push("fundability_review must be an object.");
  } else {
    errors.push(...validateScoreCategory(fundability.founder_test, "fundability_review.founder_test"));
    errors.push(...validateScoreCategory(fundability.market_size, "fundability_review.market_size"));
    errors.push(...validateScoreCategory(fundability.buyer_sharpness, "fundability_review.buyer_sharpness"));
    errors.push(...validateScoreCategory(fundability.wedge_clarity, "fundability_review.wedge_clarity"));
    errors.push(...validateScoreCategory(fundability.execution_urgency, "fundability_review.execution_urgency"));
  }

  if (!Array.isArray(input.why_yc_might_care) || input.why_yc_might_care.some((item) => typeof item !== "string")) {
    errors.push("why_yc_might_care must be an array of strings.");
  }
  if (!Array.isArray(input.why_yc_might_pass) || input.why_yc_might_pass.some((item) => typeof item !== "string")) {
    errors.push("why_yc_might_pass must be an array of strings.");
  }
  if (!Array.isArray(input.top_objections) || input.top_objections.some((item) => typeof item !== "string")) {
    errors.push("top_objections must be an array of strings.");
  }

  const startupFeature = input.is_startup_vs_feature;
  if (!isRecord(startupFeature)) {
    errors.push("is_startup_vs_feature must be an object.");
  } else {
    if (!isOneOf(startupFeature.verdict, STARTUP_FEATURE_VERDICTS)) {
      errors.push("is_startup_vs_feature.verdict must be startup|feature.");
    }
    readRequiredString(startupFeature, "reason", errors, "is_startup_vs_feature.reason");
  }

  if (!Array.isArray(input.required_30_day_tests) || input.required_30_day_tests.some((item) => typeof item !== "string")) {
    errors.push("required_30_day_tests must be an array of strings.");
  }
  if (!Array.isArray(input.partner_questions) || input.partner_questions.some((item) => typeof item !== "string")) {
    errors.push("partner_questions must be an array of strings.");
  }

  const pitchRewrite = input.pitch_rewrite;
  if (!isRecord(pitchRewrite)) {
    errors.push("pitch_rewrite must be an object.");
  } else {
    readRequiredString(pitchRewrite, "one_sentence_pitch", errors, "pitch_rewrite.one_sentence_pitch");
    readRequiredString(pitchRewrite, "investor_style_pitch", errors, "pitch_rewrite.investor_style_pitch");
  }

  const evidenceLayer = input.evidence_layer;
  if (!isRecord(evidenceLayer)) {
    errors.push("evidence_layer must be an object.");
  } else {
    if (
      !Array.isArray(evidenceLayer.direct_evidence) ||
      evidenceLayer.direct_evidence.some((item) => typeof item !== "string")
    ) {
      errors.push("evidence_layer.direct_evidence must be an array of strings.");
    }
    if (!Array.isArray(evidenceLayer.inference) || evidenceLayer.inference.some((item) => typeof item !== "string")) {
      errors.push("evidence_layer.inference must be an array of strings.");
    }
    if (!Array.isArray(evidenceLayer.speculation) || evidenceLayer.speculation.some((item) => typeof item !== "string")) {
      errors.push("evidence_layer.speculation must be an array of strings.");
    }
  }

  return errors.length ? fail(errors) : ok(input as YCReviewOutput);
}

export function validateMemoAgentOutput(input: unknown): ValidationResult<MemoAgentOutput> {
  if (!isRecord(input)) {
    return fail(["memo_agent output must be an object."]);
  }
  const errors: string[] = [];

  readRequiredString(input, "recommended_segment", errors, "recommended_segment");

  const memo = input.memo;
  if (!isRecord(memo)) {
    errors.push("memo must be an object.");
  } else {
    readRequiredString(memo, "why_now", errors, "memo.why_now");
    readRequiredString(memo, "buyer_delta", errors, "memo.buyer_delta");
    readRequiredString(memo, "minimum_wedge", errors, "memo.minimum_wedge");
    if (!Array.isArray(memo.risks) || memo.risks.some((item) => typeof item !== "string")) {
      errors.push("memo.risks must be an array of strings.");
    }
    if (!isFiniteNumber(memo.expansion_score_1_to_10) || memo.expansion_score_1_to_10 < 1 || memo.expansion_score_1_to_10 > 10) {
      errors.push("memo.expansion_score_1_to_10 must be a number between 1 and 10.");
    }
    if (!Array.isArray(memo.example_accounts) || memo.example_accounts.some((item) => typeof item !== "string")) {
      errors.push("memo.example_accounts must be an array of strings.");
    }
    if (!Array.isArray(memo.next_30_day_plan) || memo.next_30_day_plan.some((item) => typeof item !== "string")) {
      errors.push("memo.next_30_day_plan must be an array of strings.");
    }
  }

  const finalVerdict = input.final_verdict;
  if (!isRecord(finalVerdict)) {
    errors.push("final_verdict must be an object.");
  } else {
    if (!isOneOf(finalVerdict.go_no_go, GO_NO_GO)) {
      errors.push("final_verdict.go_no_go must be expand|hold|research_more.");
    }
    if (!isFiniteNumber(finalVerdict.confidence) || finalVerdict.confidence < 0 || finalVerdict.confidence > 1) {
      errors.push("final_verdict.confidence must be a number between 0 and 1.");
    }
    if (!Array.isArray(finalVerdict.conditions) || finalVerdict.conditions.some((item) => typeof item !== "string")) {
      errors.push("final_verdict.conditions must be an array of strings.");
    }
  }

  return errors.length ? fail(errors) : ok(input as MemoAgentOutput);
}

export function validateAnalyzeResponse(input: unknown): ValidationResult<AnalyzeResponse> {
  if (!isRecord(input)) {
    return fail(["Analyze response must be an object."]);
  }

  const errors: string[] = [];
  readRequiredString(input, "analysis_id", errors, "analysis_id");
  if (!isOneOf(input.status, ANALYZE_STATUS)) {
    errors.push("status must be completed|partial|failed.");
  }
  readRequiredString(input, "timestamp", errors, "timestamp");

  const results = input.results;
  if (!isRecord(results)) {
    errors.push("results must be an object.");
  } else {
    const segmentsCheck = validateMarketScoutOutput({
      candidate_segments: results.segments,
      method_summary: "response-shape-validation",
    });
    if (!segmentsCheck.ok) {
      errors.push(...withPrefix("results.segments", segmentsCheck.errors));
    }

    const buyerCheck = validateBuyerAgentOutput(results.buyer_map);
    if (!buyerCheck.ok) {
      errors.push(...withPrefix("results.buyer_map", buyerCheck.errors));
    }

    const painCheck = validatePainAgentOutput(results.pains);
    if (!painCheck.ok) {
      errors.push(...withPrefix("results.pains", painCheck.errors));
    }

    const wedgeCheck = validateWedgeAgentOutput(results.wedge);
    if (!wedgeCheck.ok) {
      errors.push(...withPrefix("results.wedge", wedgeCheck.errors));
    }

    const skepticCheck = validateSkepticAgentOutput(results.debate);
    if (!skepticCheck.ok) {
      errors.push(...withPrefix("results.debate", skepticCheck.errors));
    }

    const ycCheck = validateYCReviewOutput(results.yc_review);
    if (!ycCheck.ok) {
      errors.push(...withPrefix("results.yc_review", ycCheck.errors));
    }

    const memoCheck = validateMemoAgentOutput(results.memo);
    if (!memoCheck.ok) {
      errors.push(...withPrefix("results.memo", memoCheck.errors));
    }
  }

  const meta = input.meta;
  if (!isRecord(meta)) {
    errors.push("meta must be an object.");
  } else {
    if (!isFiniteNumber(meta.evidence_count) || meta.evidence_count < 0) {
      errors.push("meta.evidence_count must be a non-negative number.");
    }
    if (!isFiniteNumber(meta.inference_count) || meta.inference_count < 0) {
      errors.push("meta.inference_count must be a non-negative number.");
    }
    if (!Array.isArray(meta.model_versions) || meta.model_versions.some((entry) => typeof entry !== "string")) {
      errors.push("meta.model_versions must be an array of strings.");
    }
    if (meta.fallback_steps !== undefined) {
      if (!Array.isArray(meta.fallback_steps) || meta.fallback_steps.some((entry) => typeof entry !== "string")) {
        errors.push("meta.fallback_steps must be an array of strings when provided.");
      }
    }
    if (meta.errors !== undefined) {
      if (!Array.isArray(meta.errors) || meta.errors.some((entry) => typeof entry !== "string")) {
        errors.push("meta.errors must be an array of strings when provided.");
      }
    }
  }

  return errors.length ? fail(errors) : ok(input as AnalyzeResponse);
}
