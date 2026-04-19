"use client";

import Link from "next/link";
import { type FormEvent, useMemo, useState } from "react";
import { BuyerDeltaPanel } from "@/components/expansion/BuyerDeltaPanel";
import { DebatePanel } from "@/components/expansion/DebatePanel";
import { ExpansionMemoPanel } from "@/components/expansion/ExpansionMemoPanel";
import { PainMapPanel } from "@/components/expansion/PainMapPanel";
import { SegmentLeaderboard } from "@/components/expansion/SegmentLeaderboard";
import { StageProgressCards } from "@/components/expansion/StageProgressCards";
import { WedgeCard } from "@/components/expansion/WedgeCard";
import { YCReviewPanel } from "@/components/expansion/YCReviewPanel";
import {
  buildSummaryMemoExport,
  EMPTY_ANALYSIS,
  hasAnyUsableOutput,
  LOADING_STAGES,
  normalizeAnalyzeResponse,
  readErrorMessage,
} from "@/components/expansion/analysisUtils";
import type {
  AnalysisViewModel,
  AnalyzeRequestPayload,
  AnalyzeStage,
} from "@/components/expansion/types";

type RiskTolerance = "low" | "medium" | "high";

type FormState = {
  productDescription: string;
  currentIcp: {
    buyerRole: string;
    industry: string;
    companySize: string;
    geography: string;
    problemFocus: string;
  };
  competitorsText: string;
  constraints: {
    maxTimelineWeeks: number;
    budgetUsd: number;
    region: string;
    riskTolerance: RiskTolerance;
  };
};

const INITIAL_FORM: FormState = {
  productDescription: "",
  currentIcp: {
    buyerRole: "",
    industry: "",
    companySize: "",
    geography: "",
    problemFocus: "",
  },
  competitorsText: "",
  constraints: {
    maxTimelineWeeks: 12,
    budgetUsd: 50000,
    region: "",
    riskTolerance: "medium",
  },
};

const FLOW_STEPS = [
  {
    id: "product",
    title: "Product",
    description: "Describe what you sell and the wedge you already own.",
  },
  {
    id: "buyer",
    title: "Buyer",
    description: "Capture the current ICP before we suggest an adjacency.",
  },
  {
    id: "market",
    title: "Market",
    description: "Add competition and operating boundaries.",
  },
  {
    id: "review",
    title: "Review",
    description: "Confirm the brief and run the seven-agent chain.",
  },
] as const;

export function AnalyzeFlow() {
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM);
  const [analysis, setAnalysis] = useState<AnalysisViewModel>(EMPTY_ANALYSIS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  const stages = useMemo<AnalyzeStage[]>(
    () => (loading ? LOADING_STAGES : analysis.stages),
    [analysis.stages, loading],
  );
  const status = loading ? "loading" : analysis.status;
  const isLastStep = stepIndex === FLOW_STEPS.length - 1;
  const currentStep = FLOW_STEPS[stepIndex];

  const updateIcpField = (key: keyof FormState["currentIcp"], value: string) => {
    setFormState((prev) => ({ ...prev, currentIcp: { ...prev.currentIcp, [key]: value } }));
  };

  const updateConstraint = (
    key: keyof FormState["constraints"],
    value: FormState["constraints"][keyof FormState["constraints"]],
  ) => {
    setFormState((prev) => ({ ...prev, constraints: { ...prev.constraints, [key]: value } }));
  };

  const nextStep = () => {
    if (stepIndex < FLOW_STEPS.length - 1) {
      setStepIndex((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    setAnalysis({ ...EMPTY_ANALYSIS, status: "loading" });

    const payload: AnalyzeRequestPayload = {
      product_description: formState.productDescription.trim(),
      current_icp: {
        buyer_role: formState.currentIcp.buyerRole.trim(),
        industry: formState.currentIcp.industry.trim(),
        company_size: formState.currentIcp.companySize.trim(),
        geography: formState.currentIcp.geography.trim(),
        problem_focus: formState.currentIcp.problemFocus.trim(),
      },
      competitors: parseLines(formState.competitorsText),
      constraints: {
        max_timeline_weeks: formState.constraints.maxTimelineWeeks,
        budget_usd: formState.constraints.budgetUsd,
        region: formState.constraints.region.trim(),
        risk_tolerance: formState.constraints.riskTolerance,
      },
    };

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const text = await response.text();
      const parsed = safeJsonParse(text);
      const normalized = normalizeAnalyzeResponse(parsed);

      if (!response.ok) {
        setAnalysis(hasAnyUsableOutput(normalized) ? normalized : { ...EMPTY_ANALYSIS, status: "failed" });
        throw new Error(readErrorMessage(parsed) ?? `Analyze request failed (${response.status})`);
      }

      setAnalysis(normalized);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unexpected error while analyzing.",
      );
    } finally {
      setLoading(false);
    }
  };

  const exportMemo = () => {
    const text = buildSummaryMemoExport(
      {
        productDescription: formState.productDescription,
        currentIcp: formState.currentIcp,
      },
      analysis,
    );
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `expansion-memo-${analysis.analysisId ?? "draft"}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="product-shell">
      <section className="product-nav">
        <Link className="product-brand" href="/">
          ExpansionOS
        </Link>
        <nav className="product-nav-links">
          <Link href="/">Home</Link>
          <Link className="active" href="/flow">
            Guided Flow
          </Link>
        </nav>
      </section>

      <section className="product-hero product-hero-compact">
        <div>
          <p className="product-kicker">Adjacency expansion operating system</p>
          <h1>Turn raw product context into a concrete next market bet.</h1>
          <p className="product-copy">
            This flow breaks the brief into a few focused screens, then runs the
            same analysis stack behind the scenes and returns a ranked segment,
            buyer delta, pain map, wedge, debate, YC lens, and memo.
          </p>
        </div>
        <div className="hero-side">
          <div className="hero-side-stat">
            <span>Mode</span>
            <strong>Guided wizard</strong>
          </div>
          <div className="hero-side-stat">
            <span>Output</span>
            <strong>7-step memo</strong>
          </div>
        </div>
      </section>

      <section className="wizard-shell">
        <div className="wizard-header">
          <div>
            <p className="product-kicker">Step {stepIndex + 1} of {FLOW_STEPS.length}</p>
            <h2>{currentStep.title}</h2>
            <p className="product-copy">{currentStep.description}</p>
          </div>
          <div className="wizard-step-strip">
            {FLOW_STEPS.map((step, index) => (
              <div
                className={`wizard-step-chip ${index === stepIndex ? "current" : index < stepIndex ? "done" : ""}`}
                key={step.id}
              >
                {step.title}
              </div>
            ))}
          </div>
        </div>

        <form className="wizard-form" onSubmit={submit}>
          {stepIndex === 0 ? (
            <div className="wizard-grid">
              <label className="wizard-field wizard-span-8">
                Product description
                <textarea
                  required
                  rows={5}
                  value={formState.productDescription}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      productDescription: event.target.value,
                    }))
                  }
                  placeholder="B2B workflow software for finance approvals in enterprise SaaS"
                />
              </label>
              <label className="wizard-field wizard-span-4">
                Current buyer role
                <input
                  required
                  value={formState.currentIcp.buyerRole}
                  onChange={(event) => updateIcpField("buyerRole", event.target.value)}
                  placeholder="Finance operations lead"
                />
              </label>
              <label className="wizard-field wizard-span-4">
                Problem focus
                <input
                  required
                  value={formState.currentIcp.problemFocus}
                  onChange={(event) => updateIcpField("problemFocus", event.target.value)}
                  placeholder="Approval bottlenecks and audit visibility"
                />
              </label>
              <label className="wizard-field wizard-span-4">
                Geography
                <input
                  required
                  value={formState.currentIcp.geography}
                  onChange={(event) => updateIcpField("geography", event.target.value)}
                  placeholder="North America"
                />
              </label>
            </div>
          ) : null}

          {stepIndex === 1 ? (
            <div className="wizard-grid">
              <label className="wizard-field wizard-span-4">
                Industry
                <input
                  required
                  value={formState.currentIcp.industry}
                  onChange={(event) => updateIcpField("industry", event.target.value)}
                  placeholder="B2B SaaS"
                />
              </label>
              <label className="wizard-field wizard-span-4">
                Company size
                <input
                  required
                  value={formState.currentIcp.companySize}
                  onChange={(event) => updateIcpField("companySize", event.target.value)}
                  placeholder="250-1000 employees"
                />
              </label>
              <label className="wizard-field wizard-span-4">
                Region
                <input
                  value={formState.constraints.region}
                  onChange={(event) => updateConstraint("region", event.target.value)}
                  placeholder="US-first"
                />
              </label>
              <label className="wizard-field wizard-span-12">
                Competitors
                <textarea
                  rows={3}
                  value={formState.competitorsText}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      competitorsText: event.target.value,
                    }))
                  }
                  placeholder="Ramp, Brex, Airbase"
                />
              </label>
            </div>
          ) : null}

          {stepIndex === 2 ? (
            <div className="wizard-grid">
              <label className="wizard-field wizard-span-4">
                Max timeline weeks
                <input
                  type="number"
                  min={1}
                  max={104}
                  required
                  value={formState.constraints.maxTimelineWeeks}
                  onChange={(event) =>
                    updateConstraint("maxTimelineWeeks", parseInt(event.target.value, 10) || 0)
                  }
                />
              </label>
              <label className="wizard-field wizard-span-4">
                Budget USD
                <input
                  type="number"
                  min={0}
                  required
                  value={formState.constraints.budgetUsd}
                  onChange={(event) =>
                    updateConstraint("budgetUsd", parseInt(event.target.value, 10) || 0)
                  }
                />
              </label>
              <label className="wizard-field wizard-span-4">
                Risk tolerance
                <select
                  value={formState.constraints.riskTolerance}
                  onChange={(event) =>
                    updateConstraint("riskTolerance", event.target.value as RiskTolerance)
                  }
                >
                  <option value="low">low</option>
                  <option value="medium">medium</option>
                  <option value="high">high</option>
                </select>
              </label>
              <article className="wizard-note wizard-span-12">
                The flow is intentionally short: enough context to rank adjacent
                segments without making the user fill a giant wall of inputs.
              </article>
            </div>
          ) : null}

          {stepIndex === 3 ? (
            <div className="wizard-grid">
              <article className="summary-card wizard-span-6">
                <span>Product</span>
                <strong>{formState.productDescription || "Not provided yet"}</strong>
              </article>
              <article className="summary-card wizard-span-3">
                <span>Buyer</span>
                <strong>{formState.currentIcp.buyerRole || "Not provided yet"}</strong>
              </article>
              <article className="summary-card wizard-span-3">
                <span>Industry</span>
                <strong>{formState.currentIcp.industry || "Not provided yet"}</strong>
              </article>
              <article className="summary-card wizard-span-3">
                <span>Company size</span>
                <strong>{formState.currentIcp.companySize || "Not provided yet"}</strong>
              </article>
              <article className="summary-card wizard-span-3">
                <span>Geography</span>
                <strong>{formState.currentIcp.geography || "Not provided yet"}</strong>
              </article>
              <article className="summary-card wizard-span-3">
                <span>Risk</span>
                <strong>{formState.constraints.riskTolerance}</strong>
              </article>
              <article className="summary-card wizard-span-3">
                <span>Timeline / Budget</span>
                <strong>
                  {formState.constraints.maxTimelineWeeks} weeks / ${formState.constraints.budgetUsd}
                </strong>
              </article>
            </div>
          ) : null}

          <div className="wizard-actions">
            <button
              className="product-button product-button-ghost"
              onClick={prevStep}
              type="button"
              disabled={stepIndex === 0 || loading}
            >
              Back
            </button>
            {!isLastStep ? (
              <button className="product-button" onClick={nextStep} type="button">
                Next
              </button>
            ) : (
              <button className="product-button" disabled={loading} type="submit">
                {loading ? "Running..." : "Run analysis"}
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="exp-grid">
        <StageProgressCards
          analysisId={analysis.analysisId}
          loading={loading}
          stages={stages}
          status={status}
          timestamp={analysis.timestamp}
        />
        {error ? <p className="exp-error">{error}</p> : null}
        <SegmentLeaderboard loading={loading} segments={analysis.segments} />
        <BuyerDeltaPanel entries={analysis.buyerDeltas} loading={loading} />
        <PainMapPanel loading={loading} segments={analysis.painMap} />
        <WedgeCard loading={loading} wedge={analysis.wedge} />
        <DebatePanel debate={analysis.debate} loading={loading} />
        <YCReviewPanel loading={loading} review={analysis.ycReview} />
        <ExpansionMemoPanel
          canExport={hasAnyUsableOutput(analysis)}
          loading={loading}
          memo={analysis.memo}
          onExport={exportMemo}
        />
      </section>
    </main>
  );
}

function parseLines(text: string): string[] {
  return text
    .split(/\r?\n|,/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function safeJsonParse(text: string): unknown {
  if (!text.trim()) {
    return {};
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { message: text };
  }
}
