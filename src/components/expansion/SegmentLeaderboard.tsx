import type { SegmentCandidate } from "@/components/expansion/types";

type SegmentLeaderboardProps = {
  segments: SegmentCandidate[];
  loading: boolean;
};

export function SegmentLeaderboard({ segments, loading }: SegmentLeaderboardProps) {
  return (
    <section className="exp-panel exp-span-7">
      <header className="exp-panel-head">
        <h3>SegmentLeaderboard</h3>
        <p className="exp-subtle">Ranked adjacent segments</p>
      </header>

      {segments.length === 0 ? (
        <p className="exp-empty">
          {loading ? "Waiting for market scout output..." : "No segment results yet."}
        </p>
      ) : (
        <div className="exp-list">
          {segments.map((segment, index) => (
            <article className="exp-item" key={`${segment.name}-${index}`}>
              <div className="exp-item-top">
                <h4>
                  #{index + 1} {segment.name}
                </h4>
                <span className="exp-chip">
                  Fit {typeof segment.fitScore === "number" ? `${segment.fitScore}/10` : "n/a"}
                </span>
              </div>

              <p className="exp-subtle">{segment.adjacencyReason ?? "Adjacency rationale pending."}</p>

              <div className="exp-chip-row">
                {segment.estimatedSizeSignal ? (
                  <span className="exp-chip">Size signal: {segment.estimatedSizeSignal}</span>
                ) : null}
                {typeof segment.confidence === "number" ? (
                  <span className="exp-chip">Confidence: {segment.confidence}</span>
                ) : null}
                {segment.risk ? <span className="exp-chip">Risk: {segment.risk}</span> : null}
                {segment.wedgeHint ? <span className="exp-chip">Wedge: {segment.wedgeHint}</span> : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
