import type { DebateModel } from "@/components/expansion/types";

type DebatePanelProps = {
  debate?: DebateModel;
  loading: boolean;
};

export function DebatePanel({ debate, loading }: DebatePanelProps) {
  return (
    <section className="exp-panel exp-span-6">
      <header className="exp-panel-head">
        <h3>DebatePanel</h3>
        <p className="exp-subtle">Bull vs Bear with skeptic framing</p>
      </header>

      {!debate ? (
        <p className="exp-empty">
          {loading ? "Waiting for debate synthesis..." : "No debate output yet."}
        </p>
      ) : (
        <div className="exp-list">
          <article className="exp-item">
            <div className="exp-chip-row">
              {debate.verdict ? <span className="exp-chip">Verdict: {debate.verdict}</span> : null}
              {typeof debate.confidence === "number" ? (
                <span className="exp-chip">Confidence: {debate.confidence}</span>
              ) : null}
            </div>

            <div className="exp-two-col">
              <div>
                <h4>Bull case</h4>
                {debate.bull.length > 0 ? (
                  <ul className="exp-tight-list">
                    {debate.bull.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="exp-empty">No bull-case points yet.</p>
                )}
              </div>

              <div>
                <h4>Bear case</h4>
                {debate.bear.length > 0 ? (
                  <ul className="exp-tight-list">
                    {debate.bear.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="exp-empty">No bear-case points yet.</p>
                )}
              </div>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
