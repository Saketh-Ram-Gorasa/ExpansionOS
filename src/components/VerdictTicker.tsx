import type { VerdictItem } from "@/lib/expansionData";

type VerdictTickerProps = {
  items: VerdictItem[];
  title: string;
};

const toneClass: Record<VerdictItem["state"], string> = {
  good: "verdict-good",
  warn: "verdict-warn",
  danger: "verdict-danger",
};

export function VerdictTicker({ items, title }: VerdictTickerProps) {
  return (
    <div className="verdict-ticker">
      <header>
        <p className="eyebrow">Judge Verdict Feed</p>
        <h2>{title}</h2>
      </header>

      <div className="verdict-grid">
        {items.map((item, index) => (
          <article key={item.label} className={`verdict-card ${toneClass[item.state]}`} style={{ animationDelay: `${index * 0.08}s` }}>
            <p className="verdict-index">{String(index + 1).padStart(2, "0")}</p>
            <h3>{item.label}</h3>
            <p>{item.value}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
