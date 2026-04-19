type LiveCallProps = {
  title: string;
  subtitle: string;
  badge: string;
  logs: string[];
};

export function LiveCall({ title, subtitle, badge, logs }: LiveCallProps) {
  return (
    <section className="call-panel">
      <div className="call-topline">
        <div>
          <p className="eyebrow">External intelligence</p>
          <h3>{title}</h3>
          <p className="muted small">{subtitle}</p>
        </div>
        <span className="call-badge">{badge}</span>
      </div>

      <div className="call-wave" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, index) => (
          <span key={index} style={{ animationDelay: `${index * 0.08}s` }} />
        ))}
      </div>

      <div className="call-log">
        {logs.map((log) => (
          <div key={log}>{log}</div>
        ))}
      </div>
    </section>
  );
}

