export type StageStatus = "pending" | "running" | "completed" | "failed";

export type AnalyzeStage = {
  id:
    | "market_scout"
    | "buyer_agent"
    | "pain_agent"
    | "wedge_agent"
    | "skeptic_agent"
    | "yc_review_agent"
    | "memo_agent";
  label: string;
  status: StageStatus;
};

export type SegmentCandidate = {
  name: string;
  adjacencyReason?: string;
  estimatedSizeSignal?: string;
  fitScore?: number;
  confidence?: number;
  overlap?: string;
  risk?: string;
  wedgeHint?: string;
  evidence: string[];
  assumptions: string[];
};

export type BuyerDelta = {
  segmentName: string;
  primaryBuyer?: string;
  champion?: string;
  endUser?: string;
  whoChanges: string[];
  whyChanges: string[];
  governanceShift?: string;
  constraints: string[];
  confidence?: number;
};

export type PainPoint = {
  pain: string;
  evidenceType?: string;
  urgency?: string;
  operationalConstraint?: string;
};

export type PainSegment = {
  segmentName: string;
  jobsToBeDone: string[];
  painPoints: PainPoint[];
  topUrgencyTriggers: string[];
  confidence?: number;
};

export type WedgeRecommendation = {
  targetSegment?: string;
  wedgeFeature?: string;
  whyUnblocksEntry?: string;
  complexity?: string;
  timelineWeeks?: number;
  featureDependencies: string[];
  assumptions: string[];
  confidence?: number;
  alternatives: string[];
};

export type DebateModel = {
  bull: string[];
  bear: string[];
  verdict?: string;
  confidence?: number;
  topRisks: string[];
  hiddenAssumptions: string[];
  requiredChecks: string[];
};

export type YCReviewScore = {
  key: string;
  label: string;
  score?: number;
  notes: string[];
};

export type YCReviewModel = {
  verdict?: string;
  confidence?: number;
  startupVsFeatureVerdict?: string;
  startupVsFeatureReason?: string;
  whyCare: string[];
  whyPass: string[];
  topObjections: string[];
  partnerQuestions: string[];
  requiredTests: string[];
  pitchOneLiner?: string;
  investorPitch?: string;
  scores: YCReviewScore[];
};

export type MemoModel = {
  recommendedSegment?: string;
  whyNow?: string;
  buyerDelta?: string;
  minimumWedge?: string;
  risks: string[];
  expansionScore?: number;
  exampleAccounts: string[];
  next30DayPlan: string[];
  goNoGo?: string;
  confidence?: number;
  conditions: string[];
};

export type AnalysisViewModel = {
  analysisId?: string;
  timestamp?: string;
  status: "idle" | "loading" | "partial" | "completed" | "failed";
  stages: AnalyzeStage[];
  segments: SegmentCandidate[];
  buyerDeltas: BuyerDelta[];
  painMap: PainSegment[];
  wedge?: WedgeRecommendation;
  debate?: DebateModel;
  ycReview?: YCReviewModel;
  memo?: MemoModel;
  rawResults: Record<string, unknown>;
};

export type AnalyzeRequestPayload = {
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
    risk_tolerance: "low" | "medium" | "high";
  };
};
