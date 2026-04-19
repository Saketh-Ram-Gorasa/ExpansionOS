import type { AnalyzeStage } from "@/components/expansion/types";

type StageProgressCardsProps = {
  stages: AnalyzeStage[];
  loading: boolean;
  status: string;
  analysisId?: string;
  timestamp?: string;
};

export function StageProgressCards({
  stages,
  loading,
  status,
  analysisId,
  timestamp,
}: StageProgressCardsProps) {
  return (
    <section className="exp-panel exp-span-12">
      <header className="exp-panel-head">
        <div>
          <h3>Pipeline progress</h3>
          <p className="exp-subtle">
            Seven deterministic steps from market scout to memo.
          </p>
        </div>
        <div className="exp-chip-row">
          <span className="exp-chip">Status: {status}</span>
          {analysisId ? <span className="exp-chip">ID: {analysisId}</span> : null}
          {timestamp ? <span className="exp-chip">Updated: {timestamp}</span> : null}
        </div>
      </header>

      <div className="exp-stage-grid">
        {stages.map((stage) => (
          <article
            className={`exp-stage exp-stage-${stage.status}`}
            key={stage.id}
          >
            <div className="exp-stage-status">
              <span className="exp-stage-dot" />
              <span>{stage.label}</span>
            </div>
            <strong>{stage.status}</strong>
            <p className="exp-meta">
              {loading && stage.status === "pending"
                ? "Queued"
                : stage.status === "running"
                  ? "In motion"
                  : stage.status === "completed"
                    ? "Resolved"
                    : stage.status === "failed"
                      ? "Needs review"
                      : "Waiting"}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
