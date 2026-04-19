import type { MemoModel } from "@/components/expansion/types";

type ExpansionMemoPanelProps = {
  memo?: MemoModel;
  loading: boolean;
  onExport: () => void;
  canExport: boolean;
};

export function ExpansionMemoPanel({
  memo,
  loading,
  onExport,
  canExport,
}: ExpansionMemoPanelProps) {
  return (
    <section className="exp-panel exp-span-12">
      <header className="exp-panel-head">
        <div>
          <h3>ExpansionMemoPanel</h3>
          <p className="exp-subtle">Final recommendation and export action</p>
        </div>
        <button className="exp-button" onClick={onExport} type="button" disabled={!canExport || loading}>
          Export summary memo
        </button>
      </header>

      {!memo ? (
        <p className="exp-empty">
          {loading ? "Waiting for memo synthesis..." : "No memo output yet."}
        </p>
      ) : (
        <div className="exp-list">
          <article className="exp-item">
            <div className="exp-chip-row">
              {memo.recommendedSegment ? (
                <span className="exp-chip">Recommended segment: {memo.recommendedSegment}</span>
              ) : null}
              {memo.goNoGo ? <span className="exp-chip">Decision: {memo.goNoGo}</span> : null}
              {typeof memo.confidence === "number" ? (
                <span className="exp-chip">Confidence: {memo.confidence}</span>
              ) : null}
              {typeof memo.expansionScore === "number" ? (
                <span className="exp-chip">Expansion score: {memo.expansionScore}/10</span>
              ) : null}
            </div>

            {memo.whyNow ? (
              <>
                <h4>Why now</h4>
                <p className="exp-subtle">{memo.whyNow}</p>
              </>
            ) : null}

            {memo.minimumWedge ? (
              <>
                <h4>Minimum wedge</h4>
                <p className="exp-subtle">{memo.minimumWedge}</p>
              </>
            ) : null}

            <div className="exp-two-col">
              <div>
                <h4>Risks</h4>
                {memo.risks.length > 0 ? (
                  <ul className="exp-tight-list">
                    {memo.risks.map((risk) => (
                      <li key={risk}>{risk}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="exp-empty">No risks listed yet.</p>
                )}
              </div>
              <div>
                <h4>Next 30-day plan</h4>
                {memo.next30DayPlan.length > 0 ? (
                  <ul className="exp-tight-list">
                    {memo.next30DayPlan.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="exp-empty">No proof plan listed yet.</p>
                )}
              </div>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
