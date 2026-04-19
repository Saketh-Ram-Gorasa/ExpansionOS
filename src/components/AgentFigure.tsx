import type { AgentStyle } from "@/lib/concepts";

type AgentFigureProps = {
  styleType: AgentStyle;
  accent: "amber" | "green" | "cyan" | "red";
  label: string;
  compact?: boolean;
};

const colorMap = {
  amber: "#ffb347",
  green: "#61f2a3",
  cyan: "#57d6ff",
  red: "#ff6a88",
} as const;

export function AgentFigure({ styleType, accent, label, compact = false }: AgentFigureProps) {
  const primary = colorMap[accent];
  const secondary = `${primary}55`;

  return (
    <div className={`agent-figure${compact ? " compact" : ""}`}>
      <svg viewBox="0 0 88 116" className="agent-svg" role="img" aria-label={label}>
        {styleType === "sleek" ? (
          <>
            <circle cx="44" cy="22" r="13" fill={primary} opacity="0.95" />
            <rect x="28" y="38" width="32" height="36" rx="14" fill={primary} opacity="0.78" />
            <rect x="21" y="46" width="12" height="34" rx="6" fill={secondary} />
            <rect x="55" y="46" width="12" height="34" rx="6" fill={secondary} />
            <rect x="32" y="74" width="10" height="31" rx="5" fill={secondary} />
            <rect x="46" y="74" width="10" height="31" rx="5" fill={secondary} />
            <circle cx="44" cy="21" r="22" fill={primary} opacity="0.09" />
          </>
        ) : null}

        {styleType === "pixel" ? (
          <>
            <rect x="34" y="8" width="6" height="6" fill={primary} />
            <rect x="40" y="8" width="6" height="6" fill={primary} />
            <rect x="46" y="8" width="6" height="6" fill={primary} />
            <rect x="28" y="14" width="6" height="6" fill={primary} />
            <rect x="34" y="14" width="6" height="6" fill={primary} />
            <rect x="40" y="14" width="6" height="6" fill={primary} />
            <rect x="46" y="14" width="6" height="6" fill={primary} />
            <rect x="52" y="14" width="6" height="6" fill={primary} />
            <rect x="28" y="20" width="6" height="6" fill={primary} />
            <rect x="34" y="20" width="6" height="6" fill="#10253b" />
            <rect x="40" y="20" width="6" height="6" fill={primary} />
            <rect x="46" y="20" width="6" height="6" fill="#10253b" />
            <rect x="52" y="20" width="6" height="6" fill={primary} />
            <rect x="34" y="26" width="6" height="6" fill={primary} />
            <rect x="40" y="26" width="6" height="6" fill={primary} />
            <rect x="46" y="26" width="6" height="6" fill={primary} />
            <rect x="28" y="38" width="30" height="24" fill={primary} opacity="0.84" />
            <rect x="16" y="44" width="12" height="12" fill={secondary} />
            <rect x="58" y="44" width="12" height="12" fill={secondary} />
            <rect x="30" y="62" width="12" height="26" fill={secondary} />
            <rect x="44" y="62" width="12" height="26" fill={secondary} />
            <rect x="24" y="38" width="40" height="52" fill={primary} opacity="0.12" />
          </>
        ) : null}

        {styleType === "lego" ? (
          <>
            <rect x="30" y="10" width="28" height="24" rx="8" fill={primary} />
            <circle cx="37" cy="11" r="4" fill={primary} />
            <circle cx="51" cy="11" r="4" fill={primary} />
            <rect x="25" y="37" width="38" height="34" rx="10" fill={primary} opacity="0.82" />
            <rect x="14" y="40" width="10" height="30" rx="5" fill={secondary} />
            <rect x="64" y="40" width="10" height="30" rx="5" fill={secondary} />
            <rect x="30" y="72" width="10" height="30" rx="5" fill={secondary} />
            <rect x="48" y="72" width="10" height="30" rx="5" fill={secondary} />
            <rect x="22" y="33" width="44" height="72" rx="18" fill={primary} opacity="0.08" />
          </>
        ) : null}
      </svg>
      <span className="agent-label">{label}</span>
    </div>
  );
}

