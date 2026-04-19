import type { PainSegment } from "@/components/expansion/types";

type PainMapPanelProps = {
  segments: PainSegment[];
  loading: boolean;
};

export function PainMapPanel({ segments, loading }: PainMapPanelProps) {
  return (
    <section className="exp-panel exp-span-7">
      <header className="exp-panel-head">
        <h3>PainMapPanel</h3>
        <p className="exp-subtle">Pains, urgency, and constraints</p>
      </header>

      {segments.length === 0 ? (
        <p className="exp-empty">
          {loading ? "Waiting for pain analysis..." : "No pain map results yet."}
        </p>
      ) : (
        <div className="exp-list">
          {segments.map((segment, index) => (
            <article className="exp-item" key={`${segment.segmentName}-${index}`}>
              <div className="exp-item-top">
                <h4>{segment.segmentName}</h4>
                {typeof segment.confidence === "number" ? (
                  <span className="exp-chip">Confidence: {segment.confidence}</span>
                ) : null}
              </div>

              {segment.jobsToBeDone.length > 0 ? (
                <p className="exp-subtle">JTBD: {segment.jobsToBeDone.join(" | ")}</p>
              ) : null}

              {segment.painPoints.length > 0 ? (
                <ul className="exp-tight-list">
                  {segment.painPoints.map((point, pointIndex) => (
                    <li key={`${point.pain}-${pointIndex}`}>
                      {point.pain}
                      {point.urgency ? ` (${point.urgency})` : ""}
                      {point.evidenceType ? ` [${point.evidenceType}]` : ""}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="exp-empty">No pain points in this partial output.</p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
