import type { WedgeRecommendation } from "@/components/expansion/types";

type WedgeCardProps = {
  wedge?: WedgeRecommendation;
  loading: boolean;
};

export function WedgeCard({ wedge, loading }: WedgeCardProps) {
  return (
    <section className="exp-panel exp-span-5">
      <header className="exp-panel-head">
        <h3>WedgeCard</h3>
        <p className="exp-subtle">Minimum expansion wedge recommendation</p>
      </header>

      {!wedge ? (
        <p className="exp-empty">
          {loading ? "Waiting for wedge synthesis..." : "No wedge recommendation yet."}
        </p>
      ) : (
        <div className="exp-list">
          <article className="exp-item">
            <div className="exp-chip-row">
              {wedge.targetSegment ? <span className="exp-chip">Target: {wedge.targetSegment}</span> : null}
              {wedge.complexity ? <span className="exp-chip">Complexity: {wedge.complexity}</span> : null}
              {typeof wedge.timelineWeeks === "number" ? (
                <span className="exp-chip">Timeline: {wedge.timelineWeeks} weeks</span>
              ) : null}
              {typeof wedge.confidence === "number" ? (
                <span className="exp-chip">Confidence: {wedge.confidence}</span>
              ) : null}
            </div>

            <h4>{wedge.wedgeFeature ?? "Minimum wedge not specified"}</h4>
            <p className="exp-subtle">{wedge.whyUnblocksEntry ?? "Rationale pending."}</p>

            {wedge.featureDependencies.length > 0 ? (
              <ul className="exp-tight-list">
                {wedge.featureDependencies.map((dependency) => (
                  <li key={dependency}>{dependency}</li>
                ))}
              </ul>
            ) : null}
          </article>
        </div>
      )}
    </section>
  );
}
