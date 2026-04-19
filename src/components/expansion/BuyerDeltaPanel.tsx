import type { BuyerDelta } from "@/components/expansion/types";

type BuyerDeltaPanelProps = {
  entries: BuyerDelta[];
  loading: boolean;
};

export function BuyerDeltaPanel({ entries, loading }: BuyerDeltaPanelProps) {
  return (
    <section className="exp-panel exp-span-5">
      <header className="exp-panel-head">
        <h3>BuyerDeltaPanel</h3>
        <p className="exp-subtle">Role and procurement shifts per segment</p>
      </header>

      {entries.length === 0 ? (
        <p className="exp-empty">
          {loading ? "Waiting for buyer role deltas..." : "No buyer deltas yet."}
        </p>
      ) : (
        <div className="exp-list">
          {entries.map((entry, index) => (
            <article className="exp-item" key={`${entry.segmentName}-${index}`}>
              <div className="exp-item-top">
                <h4>{entry.segmentName}</h4>
                {typeof entry.confidence === "number" ? (
                  <span className="exp-chip">Confidence: {entry.confidence}</span>
                ) : null}
              </div>

              <div className="exp-chip-row">
                {entry.primaryBuyer ? <span className="exp-chip">Buyer: {entry.primaryBuyer}</span> : null}
                {entry.champion ? <span className="exp-chip">Champion: {entry.champion}</span> : null}
                {entry.endUser ? <span className="exp-chip">End user: {entry.endUser}</span> : null}
              </div>

              {entry.governanceShift ? <p className="exp-subtle">{entry.governanceShift}</p> : null}

              {entry.whoChanges.length > 0 ? (
                <ul className="exp-tight-list">
                  {entry.whoChanges.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
