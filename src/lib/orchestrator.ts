import {
  type AnalyzeMeta,
  type AnalyzeRequest,
  type AnalyzeResponse,
  type AnalyzeResults,
  type BuyerAgentOutput,
  type MarketScoutOutput,
  type MemoAgentOutput,
  type PainAgentOutput,
  type SkepticAgentOutput,
  type ValidationResult,
  type WedgeAgentOutput,
  type YCReviewOutput,
  validateAnalyzeResponse,
  validateBuyerAgentOutput,
  validateMarketScoutOutput,
  validateMemoAgentOutput,
  validatePainAgentOutput,
  validateSkepticAgentOutput,
  validateWedgeAgentOutput,
  validateYCReviewOutput,
} from "@/lib/contracts";

const OPENAI_MODEL = process.env.OPENAI_MODEL?.trim() || "gpt-5.4-mini";
const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const CRUST_COMPANY_ENRICH_URL = "https://api.crustdata.com/screener/company";
const MODEL_VERSION = `openai:${OPENAI_MODEL}`;
const CRUST_VERSION = "crustdata:company-enrichment";

type StepName = "crustdata_context" | "openai_results" | "response_validation";
type StepFailure = { step: StepName; error: string };

type CrustCompanySummary = {
  requested_as: string;
  company_name: string;
  company_website_domain: string;
  industries: string[];
  categories: string[];
  hq_country: string;
  last_funding_round_type: string;
  total_investment_usd: number | null;
  employee_count: number | null;
  linkedin_followers: number | null;
  short_description: string;
  source: "crustdata";
};

const OPENAI_RESULTS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["segments", "buyer_map", "pains", "wedge", "debate", "yc_review", "memo"],
  properties: {
    segments: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "adjacency_reason", "estimated_size_signal", "fit_score_1_to_10", "evidence", "assumptions", "confidence"],
        properties: {
          name: { type: "string" },
          adjacency_reason: { type: "string" },
          estimated_size_signal: { type: "string" },
          fit_score_1_to_10: { type: "number" },
          evidence: { type: "array", items: { type: "string" } },
          assumptions: { type: "array", items: { type: "string" } },
          confidence: { type: "number" }
        }
      }
    },
    buyer_map: {
      type: "object",
      additionalProperties: false,
      required: ["segments"],
      properties: {
        segments: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["segment_name", "buyer_roles", "delta_from_current_icp", "constraints", "confidence"],
            properties: {
              segment_name: { type: "string" },
              buyer_roles: {
                type: "object",
                additionalProperties: false,
                required: ["primary_buyer", "champion", "end_user"],
                properties: {
                  primary_buyer: { type: "string" },
                  champion: { type: "string" },
                  end_user: { type: "string" }
                }
              },
              delta_from_current_icp: {
                type: "object",
                additionalProperties: false,
                required: ["who_changes", "why_changes", "governance_or_procurement_shift"],
                properties: {
                  who_changes: { type: "array", items: { type: "string" } },
                  why_changes: { type: "array", items: { type: "string" } },
                  governance_or_procurement_shift: { type: "string" }
                }
              },
              constraints: { type: "array", items: { type: "string" } },
              confidence: { type: "number" }
            }
          }
        }
      }
    },
    pains: {
      type: "object",
      additionalProperties: false,
      required: ["segment_pains"],
      properties: {
        segment_pains: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["segment_name", "jobs_to_be_done", "pain_points", "top_urgency_triggers", "confidence"],
            properties: {
              segment_name: { type: "string" },
              jobs_to_be_done: { type: "array", items: { type: "string" } },
              pain_points: {
                type: "array",
                minItems: 1,
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: ["pain", "evidence_type", "urgency", "operational_constraint"],
                  properties: {
                    pain: { type: "string" },
                    evidence_type: { type: "string", enum: ["direct", "inference", "speculation"] },
                    urgency: { type: "string", enum: ["low", "medium", "high"] },
                    operational_constraint: { type: "string" }
                  }
                }
              },
              top_urgency_triggers: { type: "array", items: { type: "string" } },
              confidence: { type: "number" }
            }
          }
        }
      }
    },
    wedge: {
      type: "object",
      additionalProperties: false,
      required: ["recommended_wedge", "alternative_wedges"],
      properties: {
        recommended_wedge: {
          type: "object",
          additionalProperties: false,
          required: ["target_segment", "wedge_feature", "why_this_unblocks_entry", "implementation_complexity", "estimated_timeline_weeks", "feature_dependencies", "assumptions", "confidence"],
          properties: {
            target_segment: { type: "string" },
            wedge_feature: { type: "string" },
            why_this_unblocks_entry: { type: "string" },
            implementation_complexity: { type: "string", enum: ["low", "medium", "high"] },
            estimated_timeline_weeks: { type: "integer" },
            feature_dependencies: { type: "array", items: { type: "string" } },
            assumptions: { type: "array", items: { type: "string" } },
            confidence: { type: "number" }
          }
        },
        alternative_wedges: { type: "array", items: { type: "string" } }
      }
    },
    debate: {
      type: "object",
      additionalProperties: false,
      required: ["top_risks", "hidden_assumptions", "why_this_could_fail", "confidence_level", "required_checks"],
      properties: {
        top_risks: { type: "array", items: { type: "string" } },
        hidden_assumptions: { type: "array", items: { type: "string" } },
        why_this_could_fail: { type: "array", items: { type: "string" } },
        confidence_level: { type: "string" },
        required_checks: { type: "array", items: { type: "string" } }
      }
    },
    yc_review: {
      type: "object",
      additionalProperties: false,
      required: ["verdict", "confidence", "fundability_review", "why_yc_might_care", "why_yc_might_pass", "top_objections", "is_startup_vs_feature", "required_30_day_tests", "partner_questions", "pitch_rewrite", "evidence_layer"],
      properties: {
        verdict: { type: "string", enum: ["Strong", "Maybe", "Weak"] },
        confidence: { type: "number" },
        fundability_review: {
          type: "object",
          additionalProperties: false,
          required: ["founder_test", "market_size", "buyer_sharpness", "wedge_clarity", "execution_urgency"],
          properties: {
            founder_test: { $ref: "#/$defs/scoreCategory" },
            market_size: { $ref: "#/$defs/scoreCategory" },
            buyer_sharpness: { $ref: "#/$defs/scoreCategory" },
            wedge_clarity: { $ref: "#/$defs/scoreCategory" },
            execution_urgency: { $ref: "#/$defs/scoreCategory" }
          }
        },
        why_yc_might_care: { type: "array", items: { type: "string" } },
        why_yc_might_pass: { type: "array", items: { type: "string" } },
        top_objections: { type: "array", items: { type: "string" } },
        is_startup_vs_feature: {
          type: "object",
          additionalProperties: false,
          required: ["verdict", "reason"],
          properties: {
            verdict: { type: "string", enum: ["startup", "feature"] },
            reason: { type: "string" }
          }
        },
        required_30_day_tests: { type: "array", items: { type: "string" } },
        partner_questions: { type: "array", items: { type: "string" } },
        pitch_rewrite: {
          type: "object",
          additionalProperties: false,
          required: ["one_sentence_pitch", "investor_style_pitch"],
          properties: {
            one_sentence_pitch: { type: "string" },
            investor_style_pitch: { type: "string" }
          }
        },
        evidence_layer: {
          type: "object",
          additionalProperties: false,
          required: ["direct_evidence", "inference", "speculation"],
          properties: {
            direct_evidence: { type: "array", items: { type: "string" } },
            inference: { type: "array", items: { type: "string" } },
            speculation: { type: "array", items: { type: "string" } }
          }
        }
      }
    },
    memo: {
      type: "object",
      additionalProperties: false,
      required: ["recommended_segment", "memo", "final_verdict"],
      properties: {
        recommended_segment: { type: "string" },
        memo: {
          type: "object",
          additionalProperties: false,
          required: ["why_now", "buyer_delta", "minimum_wedge", "risks", "expansion_score_1_to_10", "example_accounts", "next_30_day_plan"],
          properties: {
            why_now: { type: "string" },
            buyer_delta: { type: "string" },
            minimum_wedge: { type: "string" },
            risks: { type: "array", items: { type: "string" } },
            expansion_score_1_to_10: { type: "number" },
            example_accounts: { type: "array", items: { type: "string" } },
            next_30_day_plan: { type: "array", items: { type: "string" } }
          }
        },
        final_verdict: {
          type: "object",
          additionalProperties: false,
          required: ["go_no_go", "confidence", "conditions"],
          properties: {
            go_no_go: { type: "string", enum: ["expand", "hold", "research_more"] },
            confidence: { type: "number" },
            conditions: { type: "array", items: { type: "string" } }
          }
        }
      }
    }
  },
  $defs: {
    scoreCategory: {
      type: "object",
      additionalProperties: false,
      required: ["score_1_to_10", "notes"],
      properties: {
        score_1_to_10: { type: "number" },
        notes: { type: "array", items: { type: "string" } }
      }
    }
  }
} as const;

const FALLBACK_INPUT: AnalyzeRequest = {
  product_description: "fallback",
  current_icp: {
    buyer_role: "Operator",
    industry: "B2B",
    company_size: "unknown",
    geography: "global",
    problem_focus: "workflow execution",
  },
  competitors: [],
  constraints: { max_timeline_weeks: 0, budget_usd: 0, region: "", risk_tolerance: "medium" },
};

const uniq = (items: string[]) => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

function hash(seed: string): string {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return Math.abs(h >>> 0).toString(36);
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    const text = asString(value);
    return text ? [text] : [];
  }
  return value.map((item) => asString(item)).filter(Boolean);
}

function isDomain(value: string): boolean {
  return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(value.trim());
}

export function createAnalysisId(input: AnalyzeRequest): string {
  const seed = `${input.product_description}|${input.current_icp.industry}|${input.current_icp.buyer_role}`;
  return `analysis_${Date.now().toString(36)}_${hash(seed).slice(0, 6)}`;
}

function roles(segment: string, buyer: string) {
  const s = segment.toLowerCase();
  if (s.includes("compliance")) {
    return { primary_buyer: "Head of Compliance", champion: "Risk Operations Manager", end_user: "Compliance Analyst" };
  }
  if (s.includes("revops") || s.includes("enablement")) {
    return { primary_buyer: "VP Revenue Operations", champion: "Enablement Lead", end_user: "Revenue Analyst" };
  }
  if (s.includes("operations")) {
    return { primary_buyer: "VP Operations", champion: "Program Manager", end_user: "Operations Specialist" };
  }
  return { primary_buyer: buyer, champion: "Operations Manager", end_user: "Analyst" };
}

function fallback_market_scout(input: AnalyzeRequest): MarketScoutOutput {
  return {
    candidate_segments: [
      {
        name: `${input.current_icp.industry} adjacent operators`,
        adjacency_reason: "Fallback segment from ICP overlap.",
        estimated_size_signal: "Unverified adjacent demand.",
        fit_score_1_to_10: 6,
        evidence: [`Current buyer role: ${input.current_icp.buyer_role}`],
        assumptions: ["Need direct interviews for validation."],
        confidence: 0.45,
      },
    ],
    method_summary: "Fallback mode",
  };
}

function fallback_buyer(input: AnalyzeRequest, segment: string): BuyerAgentOutput {
  return {
    segments: [
      {
        segment_name: segment,
        buyer_roles: roles(segment, input.current_icp.buyer_role),
        delta_from_current_icp: {
          who_changes: ["Buyer map assumed close to current ICP."],
          why_changes: ["Fallback keeps decision owners stable until discovery."],
          governance_or_procurement_shift: "Unknown; validate in interviews.",
        },
        constraints: ["Fallback confidence"],
        confidence: 0.4,
      },
    ],
  };
}

function fallback_pains(segment: string): PainAgentOutput {
  return {
    segment_pains: [
      {
        segment_name: segment,
        jobs_to_be_done: ["Route approvals with clear ownership."],
        pain_points: [
          {
            pain: "Manual handoffs delay decisions.",
            evidence_type: "inference",
            urgency: "medium",
            operational_constraint: "No unified evidence trail.",
          },
        ],
        top_urgency_triggers: ["Pilot timing pressure"],
        confidence: 0.4,
      },
    ],
  };
}

function fallback_wedge(segment: string): WedgeAgentOutput {
  return {
    recommended_wedge: {
      target_segment: segment,
      wedge_feature: "Approval workflow starter with evidence export",
      why_this_unblocks_entry: "Delivers a narrow, testable first win.",
      implementation_complexity: "medium",
      estimated_timeline_weeks: 8,
      feature_dependencies: ["Role-based approvals", "Exportable evidence snapshots"],
      assumptions: ["Must validate willingness-to-pay."],
      confidence: 0.42,
    },
    alternative_wedges: [],
  };
}

function fallback_skeptic() {
  return {
    top_risks: ["Fallback mode lowered confidence."],
    hidden_assumptions: ["Buyer pull is not validated yet."],
    why_this_could_fail: ["Wedge may miss highest-priority pain."],
    confidence_level: "low",
    required_checks: ["Run 3 buyer interviews before build expansion."],
  };
}

function fallback_yc(segment: string): YCReviewOutput {
  return {
    verdict: "Maybe",
    confidence: 0.4,
    fundability_review: {
      founder_test: { score_1_to_10: 6, notes: ["Needs more proof loops."] },
      market_size: { score_1_to_10: 6, notes: ["Directional only in fallback mode."] },
      buyer_sharpness: { score_1_to_10: 6, notes: ["Buyer map is provisional."] },
      wedge_clarity: { score_1_to_10: 6, notes: ["Specific but unproven wedge."] },
      execution_urgency: { score_1_to_10: 5, notes: ["Urgency mostly inferred."] },
    },
    why_yc_might_care: ["Clear adjacent wedge and measurable pilot framing."],
    why_yc_might_pass: ["Evidence quality is currently weak."],
    top_objections: ["Need live customer proof."],
    is_startup_vs_feature: { verdict: "feature", reason: "Insufficient direct evidence right now." },
    required_30_day_tests: ["Run one design-partner pilot with baseline metrics."],
    partner_questions: ["Which metric proves repeatability in 30 days?"],
    pitch_rewrite: {
      one_sentence_pitch: `Testing a wedge for ${segment} to cut decision latency.`,
      investor_style_pitch: "Recommendation is directional and needs proof before scale.",
    },
    evidence_layer: {
      direct_evidence: ["Current ICP context"],
      inference: ["Segment adjacency from overlap"],
      speculation: ["Market pull and urgency are not fully validated"],
    },
  };
}

function fallback_memo(segment: string): MemoAgentOutput {
  return {
    recommended_segment: segment,
    memo: {
      why_now: "Keeps momentum with a narrow, low-regret recommendation.",
      buyer_delta: "Buyer map kept close to current ICP until validation.",
      minimum_wedge: "Approval workflow starter with evidence export",
      risks: ["Low confidence due to fallback mode."],
      expansion_score_1_to_10: 5,
      example_accounts: [`${segment} design partners`],
      next_30_day_plan: ["Run discovery and one measurable pilot."],
    },
    final_verdict: {
      go_no_go: "research_more",
      confidence: 0.4,
      conditions: ["Validate pain and willingness-to-pay with live buyers."],
    },
  };
}

function fallbackResults(input: AnalyzeRequest): AnalyzeResults {
  const market = fallback_market_scout(input);
  const segment = market.candidate_segments[0]?.name ?? "B2B adjacent operators";
  return {
    segments: market.candidate_segments,
    buyer_map: fallback_buyer(input, segment),
    pains: fallback_pains(segment),
    wedge: fallback_wedge(segment),
    debate: fallback_skeptic(),
    yc_review: fallback_yc(segment),
    memo: fallback_memo(segment),
  };
}

async function fetchJson(url: string, init: RequestInit): Promise<unknown> {
  const response = await fetch(url, init);
  const text = await response.text();
  let payload: unknown = {};
  try {
    payload = text ? (JSON.parse(text) as unknown) : {};
  } catch {
    payload = { raw: text };
  }
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${text.slice(0, 400)}`);
  }
  return payload;
}

function normalizeCrustRecords(payload: unknown): Array<Record<string, unknown>> {
  if (Array.isArray(payload)) {
    return payload.map((entry) => asRecord(entry)).filter((entry): entry is Record<string, unknown> => Boolean(entry));
  }
  const root = asRecord(payload);
  if (!root) return [];
  const candidates = [root.data, root.results, root.companies, root.items];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.map((entry) => asRecord(entry)).filter((entry): entry is Record<string, unknown> => Boolean(entry));
    }
  }
  return [root];
}

async function fetchCrustEnrichment(identifierKey: "company_domain" | "company_name", values: string[]): Promise<CrustCompanySummary[]> {
  const crustKey = process.env.CRUSTDATA_API_KEY?.trim() || process.env.CRUST_API_KEY?.trim() || process.env.CRUSTDATA_KEY?.trim();
  if (!crustKey) {
    throw new Error("Missing CrustData API key.");
  }

  const url = new URL(CRUST_COMPANY_ENRICH_URL);
  url.searchParams.set(identifierKey, values.join(","));

  const payload = await fetchJson(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Token ${crustKey}`,
    },
    cache: "no-store",
  });

  const records = normalizeCrustRecords(payload);
  return records.map((record, index) => ({
    requested_as: values[index] ?? asString(record.company_name) ?? asString(record.company_website_domain),
    company_name: asString(record.company_name) || values[index] || "Unknown company",
    company_website_domain: asString(record.company_website_domain) || asString(record.company_domain),
    industries: stringList(record.industries),
    categories: stringList(record.categories),
    hq_country: asString(record.hq_country) || asString(record.largest_headcount_country),
    last_funding_round_type: asString(record.last_funding_round_type),
    total_investment_usd: asNumber(record.total_investment_usd),
    employee_count: asNumber(record.employee_count) ?? asNumber(asRecord(record.headcount)?.headcount),
    linkedin_followers: asNumber(record.linkedin_followers),
    short_description: asString(record.short_description) || asString(record.description) || asString(record.company_description),
    source: "crustdata",
  }));
}

async function getCrustContext(input: AnalyzeRequest): Promise<CrustCompanySummary[]> {
  const competitors = uniq(input.competitors).slice(0, 6);
  if (competitors.length === 0) return [];

  const domains = competitors.filter(isDomain);
  const names = competitors.filter((item) => !isDomain(item));
  const results: CrustCompanySummary[] = [];

  if (domains.length > 0) {
    results.push(...(await fetchCrustEnrichment("company_domain", domains)));
  }
  if (names.length > 0) {
    results.push(...(await fetchCrustEnrichment("company_name", names)));
  }

  return results;
}

function extractOutputText(payload: unknown): string {
  const root = asRecord(payload) ?? {};
  if (typeof root.output_text === "string" && root.output_text.trim()) {
    return root.output_text;
  }
  const output = asArray(root.output);
  for (const item of output) {
    const record = asRecord(item);
    const contents = asArray(record?.content);
    for (const content of contents) {
      const piece = asRecord(content);
      if (piece?.type === "output_text" && typeof piece.text === "string" && piece.text.trim()) {
        return piece.text;
      }
    }
  }
  throw new Error("OpenAI response did not contain output_text.");
}

async function generateResultsWithOpenAI(input: AnalyzeRequest, crustContext: CrustCompanySummary[], analysisId: string): Promise<AnalyzeResults> {
  const openAiKey = process.env.OPENAI_API_KEY?.trim();
  if (!openAiKey) {
    throw new Error("Missing OpenAI API key.");
  }

  const prompt = [
    "Return a single JSON object that matches the schema exactly.",
    "You are generating an adjacency expansion analysis.",
    "Prefer concise, decision-useful strings.",
    "Ground direct evidence in user input or CrustData context only.",
    "If a claim is inferred, place it in inference/speculation fields and reduce confidence.",
    "Use confidence values between 0 and 1.",
    "Use scores between 1 and 10.",
    "Use 1-3 items for most arrays unless more are clearly justified.",
    "",
    `analysis_id: ${analysisId}`,
    `input: ${JSON.stringify(input)}`,
    `crustdata_context: ${JSON.stringify(crustContext)}`,
  ].join("\n");

  const payload = await fetchJson(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAiKey}`,
    },
    cache: "no-store",
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: "You are a startup expansion analyst. Output only valid JSON that matches the provided schema exactly.",
            },
          ],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: prompt }],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "analyze_results",
          strict: true,
          schema: OPENAI_RESULTS_SCHEMA,
        },
      },
    }),
  });

  return JSON.parse(extractOutputText(payload)) as AnalyzeResults;
}

function validateResults(results: AnalyzeResults): ValidationResult<AnalyzeResults> {
  const errors: string[] = [];
  const marketCheck = validateMarketScoutOutput({ candidate_segments: results.segments, method_summary: "live-openai-results" });
  if (!marketCheck.ok) errors.push(...marketCheck.errors.map((error) => `segments: ${error}`));
  const buyerCheck = validateBuyerAgentOutput(results.buyer_map);
  if (!buyerCheck.ok) errors.push(...buyerCheck.errors.map((error) => `buyer_map: ${error}`));
  const painsCheck = validatePainAgentOutput(results.pains);
  if (!painsCheck.ok) errors.push(...painsCheck.errors.map((error) => `pains: ${error}`));
  const wedgeCheck = validateWedgeAgentOutput(results.wedge);
  if (!wedgeCheck.ok) errors.push(...wedgeCheck.errors.map((error) => `wedge: ${error}`));
  const skepticCheck = validateSkepticAgentOutput(results.debate);
  if (!skepticCheck.ok) errors.push(...skepticCheck.errors.map((error) => `debate: ${error}`));
  const ycCheck = validateYCReviewOutput(results.yc_review);
  if (!ycCheck.ok) errors.push(...ycCheck.errors.map((error) => `yc_review: ${error}`));
  const memoCheck = validateMemoAgentOutput(results.memo);
  if (!memoCheck.ok) errors.push(...memoCheck.errors.map((error) => `memo: ${error}`));
  return errors.length > 0 ? { ok: false, errors } : { ok: true, data: results };
}

function statusFromFailures(failures: StepFailure[]): "completed" | "partial" | "failed" {
  if (failures.length === 0) return "completed";
  const steps = uniq(failures.map((failure) => failure.step));
  return steps.includes("openai_results") ? "failed" : "partial";
}

function meta(results: AnalyzeResults, crustUsed: boolean, failures: StepFailure[]): AnalyzeMeta {
  const evidenceCount =
    results.segments.reduce((total, segment) => total + segment.evidence.length, 0) +
    results.yc_review.evidence_layer.direct_evidence.length;
  const inferenceCount =
    results.yc_review.evidence_layer.inference.length +
    results.pains.segment_pains.reduce(
      (total, segment) => total + segment.pain_points.filter((point) => point.evidence_type === "inference").length,
      0,
    );
  return {
    evidence_count: evidenceCount,
    inference_count: inferenceCount,
    model_versions: crustUsed ? [MODEL_VERSION, CRUST_VERSION] : [MODEL_VERSION],
    fallback_steps: failures.length > 0 ? uniq(failures.map((failure) => failure.step)) : [],
    errors: failures.length > 0 ? failures.map((failure) => `${failure.step}: ${failure.error}`) : [],
  };
}

export function buildFailedAnalyzeResponse(params?: { analysisId?: string; errors?: string[]; fallbackSteps?: string[] }): AnalyzeResponse {
  const analysisId = params?.analysisId ?? `analysis_failed_${Date.now().toString(36)}`;
  return {
    analysis_id: analysisId,
    status: "failed",
    timestamp: new Date().toISOString(),
    results: fallbackResults(FALLBACK_INPUT),
    meta: {
      evidence_count: 1,
      inference_count: 1,
      model_versions: [MODEL_VERSION],
      fallback_steps: params?.fallbackSteps ?? ["openai_results"],
      errors: params?.errors ?? ["Unhandled orchestration failure."],
    },
  };
}

export async function runAnalyzeOrchestration(input: AnalyzeRequest): Promise<AnalyzeResponse> {
  const failures: StepFailure[] = [];
  const analysisId = createAnalysisId(input);
  let crustContext: CrustCompanySummary[] = [];

  try {
    crustContext = await getCrustContext(input);
  } catch (error) {
    failures.push({
      step: "crustdata_context",
      error: error instanceof Error ? error.message : "Unknown CrustData failure",
    });
  }

  let results: AnalyzeResults;
  try {
    results = await generateResultsWithOpenAI(input, crustContext, analysisId);
  } catch (error) {
    failures.push({
      step: "openai_results",
      error: error instanceof Error ? error.message : "Unknown OpenAI failure",
    });
    return buildFailedAnalyzeResponse({
      analysisId,
      errors: failures.map((failure) => `${failure.step}: ${failure.error}`),
      fallbackSteps: uniq(failures.map((failure) => failure.step)),
    });
  }

  const checkedResults = validateResults(results);
  if (!checkedResults.ok) {
    failures.push({ step: "response_validation", error: checkedResults.errors.join(" | ") });
    return {
      analysis_id: analysisId,
      status: "partial",
      timestamp: new Date().toISOString(),
      results: fallbackResults(input),
      meta: {
        evidence_count: 1,
        inference_count: 1,
        model_versions: crustContext.length > 0 ? [MODEL_VERSION, CRUST_VERSION] : [MODEL_VERSION],
        fallback_steps: uniq(failures.map((failure) => failure.step)),
        errors: failures.map((failure) => `${failure.step}: ${failure.error}`),
      },
    };
  }

  const response: AnalyzeResponse = {
    analysis_id: analysisId,
    status: statusFromFailures(failures),
    timestamp: new Date().toISOString(),
    results: checkedResults.data,
    meta: meta(checkedResults.data, crustContext.length > 0, failures),
  };

  const checkedResponse = validateAnalyzeResponse(response);
  if (checkedResponse.ok) {
    return checkedResponse.data;
  }

  return buildFailedAnalyzeResponse({
    analysisId,
    errors: ["Final response validation failed.", ...checkedResponse.errors],
    fallbackSteps: ["response_validation", ...uniq(failures.map((failure) => failure.step))],
  });
}
