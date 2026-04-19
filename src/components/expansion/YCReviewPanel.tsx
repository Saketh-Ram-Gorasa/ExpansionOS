import type { YCReviewModel } from "@/components/expansion/types";

type YCReviewPanelProps = {
  review?: YCReviewModel;
  loading: boolean;
};

export function YCReviewPanel({ review, loading }: YCReviewPanelProps) {
  return (
    <section className="exp-panel exp-span-6">
      <header className="exp-panel-head">
        <h3>YCReviewPanel</h3>
        <p className="exp-subtle">YC-style startup-quality pressure test</p>
      </header>

      {!review ? (
        <p className="exp-empty">
          {loading ? "Waiting for YC review..." : "No YC review output yet."}
        </p>
      ) : (
        <div className="exp-list">
          <article className="exp-item">
            <div className="exp-chip-row">
              {review.verdict ? <span className="exp-chip">Verdict: {review.verdict}</span> : null}
              {typeof review.confidence === "number" ? (
                <span className="exp-chip">Confidence: {review.confidence}</span>
              ) : null}
              {review.startupVsFeatureVerdict ? (
                <span className="exp-chip">Startup check: {review.startupVsFeatureVerdict}</span>
              ) : null}
            </div>

            {review.scores.length > 0 ? (
              <div className="exp-list">
                {review.scores.map((score) => (
                  <div className="exp-item" key={score.key}>
                    <div className="exp-item-top">
                      <h4>{score.label}</h4>
                      <span className="exp-chip">
                        {typeof score.score === "number" ? `${score.score}/10` : "n/a"}
                      </span>
                    </div>
                    {score.notes.length > 0 ? (
                      <ul className="exp-tight-list">
                        {score.notes.map((note) => (
                          <li key={note}>{note}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="exp-empty">No notes in this partial result.</p>
                    )}
                  </div>
                ))}
              </div>
            ) : null}
          </article>
        </div>
      )}
    </section>
  );
}
