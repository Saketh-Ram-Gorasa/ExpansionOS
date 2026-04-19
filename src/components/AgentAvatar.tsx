type AgentStyle = "pixel" | "lego" | "vector";
type AgentState = "idle" | "thinking" | "calling" | "done";

type AgentAvatarProps = {
  style: AgentStyle;
  accent: string;
  state: AgentState;
};

function stateClass(state: AgentState) {
  if (state === "calling") {
    return "agent-avatar-calling";
  }

  if (state === "thinking") {
    return "agent-avatar-thinking";
  }

  if (state === "done") {
    return "agent-avatar-done";
  }

  return "agent-avatar-idle";
}

function eye({ x, y, fill = "#111827" }: { x: number; y: number; fill?: string }) {
  return (
    <>
      <rect x={x} y={y} width="4" height="4" fill={fill} />
      <rect x={x + 4} y={y} width="1" height="4" fill="#ffffff" />
    </>
  );
}

export function AgentAvatar({ style, accent, state }: AgentAvatarProps) {
  const pulseClass = stateClass(state);
  const isThinking = state === "thinking";
  const isCalling = state === "calling";

  if (style === "pixel") {
    return (
      <svg viewBox="0 0 64 80" className={`agent-avatar-svg ${pulseClass}`} aria-hidden="true">
        <rect x="20" y="14" width="24" height="9" fill={accent} opacity="0.95" />
        <rect x="19" y="23" width="26" height="30" fill="#fef3dc" />
        <rect x="12" y="21" width="40" height="8" fill="#d6e2f2" />
        <rect x="14" y="46" width="36" height="26" fill={accent} opacity="0.95" />
        <rect x="18" y="52" width="10" height="8" fill="#ffb37e" opacity="0.9" />
        <rect x="36" y="52" width="10" height="8" fill="#ffb37e" opacity="0.9" />
        {eye({ x: 26, y: 17 })}
        {eye({ x: 34, y: 17 })}
        <rect x="29" y="23" width="6" height="2" fill={isThinking ? "#4c566a" : "#718096"} />
        <rect x="30" y="26" width="4" height="1" fill={isCalling ? "#0f172a" : "#9ca3af"} />
        <rect x="22" y="30" width="2" height="5" fill="#2f3646" />
        <rect x="40" y="30" width="2" height="5" fill="#2f3646" />
        <rect x="28" y="34" width="8" height="3" fill={isThinking ? "#374151" : "#64748b"} />
        <rect x="22" y="40" width="2" height="6" fill={accent} opacity="0.95" />
        <rect x="40" y="40" width="2" height="6" fill={accent} opacity="0.95" />
        <rect x="24" y="58" width="16" height="2" fill="#0b1022" />
      </svg>
    );
  }

  if (style === "lego") {
    return (
      <svg viewBox="0 0 64 80" className={`agent-avatar-svg ${pulseClass}`} aria-hidden="true">
        <rect x="14" y="10" width="36" height="12" rx="2" fill={accent} />
        <rect x="16" y="11" width="4" height="4" fill="#f8fafc" opacity="0.5" />
        <rect x="44" y="11" width="4" height="4" fill="#f8fafc" opacity="0.5" />
        <rect x="16" y="22" width="32" height="22" fill="#fdf2e8" />
        <rect x="16" y="17" width="32" height="7" fill={accent} opacity="0.95" />
        <rect x="16" y="26" width="32" height="12" fill={accent} opacity="0.85" />
        <rect x="9" y="27" width="6" height="24" rx="2" fill={accent} opacity="0.6" />
        <rect x="49" y="27" width="6" height="24" rx="2" fill={accent} opacity="0.6" />
        <rect x="19" y="50" width="8" height="7" fill="#fef3dc" />
        <rect x="37" y="50" width="8" height="7" fill="#fef3dc" />
        <rect x="18" y="43" width="12" height="6" fill="#1f2937" />
        <rect x="34" y="43" width="12" height="6" fill="#1f2937" />
        {eye({ x: 25, y: 15 })}
        {eye({ x: 35, y: 15 })}
        <rect x="29" y="21" width="6" height="2" fill={isThinking ? "#1f2937" : "#64748b"} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 80" className={`agent-avatar-svg ${pulseClass}`} aria-hidden="true">
      <rect x="20" y="12" width="24" height="18" rx="8" fill={accent} opacity="0.95" />
      <ellipse cx="32" cy="16" rx="11" ry="9" fill={accent} opacity="0.9" />
      {eye({ x: 26, y: 14, fill: "#1f2937" })}
      {eye({ x: 34, y: 14, fill: "#1f2937" })}
      <rect x="28" y="22" width="8" height="3" fill={isThinking ? "#1f2937" : "#475569"} />
      <rect x="24" y="28" width="16" height="2" fill={isCalling ? "#0f172a" : "#94a3b8"} />
      <rect x="15" y="27" width="34" height="28" rx="10" fill="#f8fafc" />
      <rect x="18" y="32" width="8" height="14" fill={accent} opacity="0.9" />
      <rect x="38" y="32" width="8" height="14" fill={accent} opacity="0.9" />
      <rect x="30" y="40" width="4" height="2" fill="#0b1022" />
      <rect x="24" y="51" width="16" height="3" fill={accent} opacity="0.9" />
      <rect x="25" y="56" width="4" height="4" fill="#ffceb1" />
      <rect x="35" y="56" width="4" height="4" fill="#ffceb1" />
      <rect x="29" y="64" width="6" height="2" fill={state === "idle" ? "#1f2937" : "#1e293b"} />
    </svg>
  );
}
