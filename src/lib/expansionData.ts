export const PRD_CONTRACT_VERSION = "2026-04-dashboard-v1";

export const AGENT_STYLES = ["pixel", "lego", "vector"] as const;
export type AgentStyle = (typeof AGENT_STYLES)[number];

export const AGENT_RUNTIME_STATES = ["idle", "thinking", "calling", "done"] as const;
export type AgentRuntimeState = (typeof AGENT_RUNTIME_STATES)[number];

export const RISK_LEVELS = ["Low", "Medium", "High"] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

export const CALL_PACKET_STATUSES = ["queued", "fetching", "success", "error"] as const;
export type CallPacketStatus = (typeof CALL_PACKET_STATUSES)[number];

export const VERDICT_STATES = ["good", "warn", "danger"] as const;
export type VerdictState = (typeof VERDICT_STATES)[number];

export const THEME_MODES = ["core", "mission-control", "retro-ops", "detective-board", "boardroom", "ai-os"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

export const DASHBOARD_PANEL_IDS = [
  "mission-dossier",
  "call-bus",
  "agent-rack",
  "expansion-ranking",
  "yc-chamber",
  "verdict-ticker",
  "demo-checklist",
] as const;
export type DashboardPanelId = (typeof DASHBOARD_PANEL_IDS)[number];

export type DashboardPanelTone = "core" | "muted" | "accent";

export type DashboardPanelContract = {
  id: DashboardPanelId;
  title: string;
  badge?: string;
  description: string;
  tone: DashboardPanelTone;
  desktopSpan: 1 | 2 | 3;
  mobileOrder: number;
};

export type ExpansionAgent = {
  name: string;
  title: string;
  style: AgentStyle;
  accent: string;
  state: AgentRuntimeState;
  confidence: number;
  signal: string;
  source: string;
  intent: string;
  output: string;
  nextMove: string;
};

export type SegmentOption = {
  segment: string;
  overlap: string;
  risk: RiskLevel;
  wedge: string;
  signal: string;
};

export type ExpansionRankingCard = {
  id: string;
  segment: string;
  overlapPercent: number;
  risk: RiskLevel;
  wedge: string;
  signal: string;
  buyer: string;
};

export type LiveCallPacket = {
  id: string;
  timestamp: string;
  from: string;
  to: string;
  action: string;
  status: CallPacketStatus;
};

export type VerdictItem = {
  label: string;
  value: string;
  state: VerdictState;
};

export type ThemeModeConfig = {
  id: ThemeMode;
  label: string;
  badge: string;
  accent: string;
  secondary: string;
  background: string;
  glass: string;
  title: string;
};

const BASE_DEMO_CLOCK = {
  hour: 10,
  minute: 12,
  second: 2,
} as const;

const pad2 = (value: number) => String(value).padStart(2, "0");

export const formatDemoTimestamp = (offsetSeconds: number) => {
  const start = BASE_DEMO_CLOCK.hour * 3600 + BASE_DEMO_CLOCK.minute * 60 + BASE_DEMO_CLOCK.second;
  const daySeconds = 24 * 60 * 60;
  const total = ((start + offsetSeconds) % daySeconds + daySeconds) % daySeconds;
  const hour = Math.floor(total / 3600);
  const minute = Math.floor((total % 3600) / 60);
  const second = total % 60;

  return `${pad2(hour)}:${pad2(minute)}:${pad2(second)}`;
};

export function createPlaceholderAgents(): ExpansionAgent[] {
  return [
    {
      name: "Mina Park",
      title: "Adjacent Market Scout",
      style: "vector",
      accent: "#6effe4",
      state: "calling",
      confidence: 88,
      signal: "Detected 14 adjacent clusters in 7 minutes",
      source: "Crustdata company intelligence endpoint",
      intent: "Find clusters with low-risk adjacent buyers.",
      output: "InsurTech and payroll ops show the strongest role overlap for adjacent expansion in 30 days.",
      nextMove: "Spin up two buyer personas in the same data graph and attach evidence trails.",
    },
    {
      name: "Ravi Sen",
      title: "Buyer Signals Cartographer",
      style: "pixel",
      accent: "#ffd16a",
      state: "thinking",
      confidence: 84,
      signal: "Primary buyer role shift: VP Operations up 38%",
      source: "Crustdata talent and hiring lane",
      intent: "Spot role changes that usually signal expansion timing.",
      output: "Decision makers now include risk operations leads and compliance managers on the same buying committee.",
      nextMove: "Validate role transitions by function stack so every wedge has clear owner mapping.",
    },
    {
      name: "Leah Tran",
      title: "Workflow Friction Analyst",
      style: "vector",
      accent: "#ff7390",
      state: "done",
      confidence: 81,
      signal: "Manual evidence assembly found in 2,300 records",
      source: "Crustdata enrichment + evidence snapshots",
      intent: "Detect operational friction that buying teams will pay to remove.",
      output: "Teams lose approvals because evidence is fragmented across tools and manual handoffs.",
      nextMove: "Build a proof-export pack with timestamps, owner role, and decision rationale.",
    },
    {
      name: "Noah Iyer",
      title: "Wedge Strategy Analyst",
      style: "lego",
      accent: "#8eea6f",
      state: "done",
      confidence: 90,
      signal: "Wedge cost profile: low for first release",
      source: "Crustdata sales intelligence + benchmark slice",
      intent: "Choose first wedge with fastest proof loop.",
      output: "Priority wedge: approval routing plus evidence export baseline for first 3 pilot accounts.",
      nextMove: "Draft MVP acceptance criteria and a 2-week launch sequence.",
    },
    {
      name: "Anika Rao",
      title: "Investment Lens",
      style: "lego",
      accent: "#9a8fff",
      state: "thinking",
      confidence: 86,
      signal: "Narrative score: 84 / 100",
      source: "YC-style wedge rubric",
      intent: "Stress test whether this is a startup wedge, not a feature layer.",
      output: "Reframed as regulated workflow infrastructure that ships recurring revenue fast.",
      nextMove: "Score pain depth, wedge clarity, and execution confidence in one decision board.",
    },
  ];
}

export function createPlaceholderRankingCards(): ExpansionRankingCard[] {
  return [
    {
      id: "insurtech-ops",
      segment: "InsurTech Operations",
      overlapPercent: 82,
      risk: "Medium",
      wedge: "Approval routing + evidence export",
      signal: "Fastest path to paying pilots",
      buyer: "Head of Risk Operations",
    },
    {
      id: "payroll-intelligence",
      segment: "Payroll Intelligence",
      overlapPercent: 63,
      risk: "High",
      wedge: "Webhook audit snapshots + role permissions",
      signal: "Large teams need tighter compliance guardrails",
      buyer: "VP Operations",
    },
    {
      id: "b2b-lending-ops",
      segment: "B2B Lending Ops",
      overlapPercent: 57,
      risk: "High",
      wedge: "Case history + exception playbooks",
      signal: "High ACV possible, slower legal clearance",
      buyer: "Lending Ops Director",
    },
  ];
}

export const toSegmentOption = (card: ExpansionRankingCard): SegmentOption => ({
  segment: card.segment,
  overlap: `${card.overlapPercent}%`,
  risk: card.risk,
  wedge: card.wedge,
  signal: card.signal,
});

export const createSegmentOptions = (cards: ExpansionRankingCard[]): SegmentOption[] => cards.map(toSegmentOption);

export function createYcQuestionSet(): string[] {
  return [
    "What adjacent segment becomes a repeatable GTM wedge in 90 days?",
    "Why is this a startup wedge, not a cosmetic feature set?",
    "Which buyer role changes first when we shift segments?",
    "Which metric proves the team can ship before hype peaks?",
  ];
}

type LiveCallSeed = Omit<LiveCallPacket, "timestamp"> & {
  offsetSeconds: number;
};

const placeholderCallSeed: LiveCallSeed[] = [
  {
    id: "call-1",
    offsetSeconds: 0,
    from: "Core Console",
    to: "Cluster Sweep",
    action: "Scanning adjacent verticals",
    status: "success",
  },
  {
    id: "call-2",
    offsetSeconds: 7,
    from: "Core Console",
    to: "Buyer Layer",
    action: "Detecting strongest overlap density",
    status: "success",
  },
  {
    id: "call-3",
    offsetSeconds: 15,
    from: "Core Console",
    to: "Friction Engine",
    action: "Detecting role shifts and workload bottlenecks",
    status: "fetching",
  },
  {
    id: "call-4",
    offsetSeconds: 27,
    from: "Core Console",
    to: "Evidence Store",
    action: "Composing proof packet lineage",
    status: "queued",
  },
  {
    id: "call-5",
    offsetSeconds: 42,
    from: "Core Console",
    to: "Decision Core",
    action: "Refining final wedge confidence",
    status: "success",
  },
];

export const createPlaceholderCallPackets = (): LiveCallPacket[] =>
  placeholderCallSeed.map(({ offsetSeconds, ...packet }) => ({
    ...packet,
    timestamp: formatDemoTimestamp(offsetSeconds),
  }));

export function createPlaceholderVerdicts(): VerdictItem[] {
  return [
    { label: "AI actions", value: "4 calls, 1 API chain, 100% traceable", state: "good" },
    { label: "Data touched", value: "Company graph, hiring, competitor, and evidence lanes", state: "good" },
    { label: "Signal quality", value: "High confidence on InsurTech Ops wedge", state: "good" },
    { label: "Risks", value: "Need one 30-day pilot before full automation rollout", state: "warn" },
  ];
}

export const dashboardPanelContracts: DashboardPanelContract[] = [
  {
    id: "mission-dossier",
    title: "MISSION DOSSIER",
    badge: "Context + mission framing",
    description: "Defines ICP, target, win signal, and timebox for the run.",
    tone: "core",
    desktopSpan: 1,
    mobileOrder: 1,
  },
  {
    id: "call-bus",
    title: "CRUSTDATA CALL BUS",
    badge: "Live route feed",
    description: "Shows lane-by-lane request status and packet progression.",
    tone: "muted",
    desktopSpan: 1,
    mobileOrder: 2,
  },
  {
    id: "agent-rack",
    title: "AGENT RACK",
    badge: "Parallel reasoning",
    description: "Tracks each agent's intent, source, output, and next move.",
    tone: "core",
    desktopSpan: 1,
    mobileOrder: 3,
  },
  {
    id: "expansion-ranking",
    title: "EXPANSION RANKING",
    badge: "Top options",
    description: "Ranks adjacent segments by overlap, risk, and wedge quality.",
    tone: "core",
    desktopSpan: 2,
    mobileOrder: 4,
  },
  {
    id: "yc-chamber",
    title: "YC CHAMBER",
    badge: "Venture lens",
    description: "Applies hard startup questions before choosing a wedge.",
    tone: "muted",
    desktopSpan: 1,
    mobileOrder: 5,
  },
  {
    id: "verdict-ticker",
    title: "DEMONSTRABLE STORY",
    badge: "Judge feed",
    description: "Summarizes what was proven during the run.",
    tone: "accent",
    desktopSpan: 3,
    mobileOrder: 6,
  },
  {
    id: "demo-checklist",
    title: "DEMO CHECKLIST",
    description: "Tracks readiness signals for investor and founder walkthroughs.",
    tone: "core",
    desktopSpan: 3,
    mobileOrder: 7,
  },
];

export const agents: ExpansionAgent[] = createPlaceholderAgents();
export const expansionRankingCards: ExpansionRankingCard[] = createPlaceholderRankingCards();
export const segmentOptions: SegmentOption[] = createSegmentOptions(expansionRankingCards);
export const ycQuestionSet = createYcQuestionSet();
export const crustDataCalls: LiveCallPacket[] = createPlaceholderCallPackets();
export const verdicts: VerdictItem[] = createPlaceholderVerdicts();

export const modeConfig: Record<ThemeMode, ThemeModeConfig> = {
  core: {
    id: "core",
    label: "CORE",
    badge: "MAIN MODE",
    accent: "#6c8dff",
    secondary: "#56f7ff",
    background: "linear-gradient(145deg, rgba(244, 248, 255, 0.9) 0%, rgba(231, 239, 255, 0.9) 45%, rgba(246, 249, 255, 0.95) 100%)",
    glass: "rgba(233, 239, 255, 0.6)",
    title: "Mission-first expansion cockpit",
  },
  "mission-control": {
    id: "mission-control",
    label: "MISSION",
    badge: "COMMAND",
    accent: "#2fb6c5",
    secondary: "#a7e8ff",
    background: "linear-gradient(145deg, rgba(236, 250, 255, 0.9) 0%, rgba(220, 248, 255, 0.9) 45%, rgba(236, 246, 255, 0.95) 100%)",
    glass: "rgba(214, 242, 248, 0.62)",
    title: "High-intensity dispatch room",
  },
  "retro-ops": {
    id: "retro-ops",
    label: "RETRO",
    badge: "ARCADE",
    accent: "#ff9f2f",
    secondary: "#ffd39e",
    background: "linear-gradient(145deg, rgba(255, 248, 236, 0.95) 0%, rgba(255, 238, 218, 0.9) 45%, rgba(252, 247, 236, 0.96) 100%)",
    glass: "rgba(255, 223, 182, 0.55)",
    title: "Arcade ops with scoring momentum",
  },
  "detective-board": {
    id: "detective-board",
    label: "DETECTIVE",
    badge: "EVIDENCE",
    accent: "#bf7f3f",
    secondary: "#ffd28c",
    background: "linear-gradient(145deg, rgba(254, 250, 238, 0.95) 0%, rgba(255, 245, 220, 0.9) 45%, rgba(252, 246, 234, 0.96) 100%)",
    glass: "rgba(255, 229, 180, 0.58)",
    title: "Evidence board with chain-of-custody",
  },
  boardroom: {
    id: "boardroom",
    label: "BOARDROOM",
    badge: "PARTNER",
    accent: "#ff6f88",
    secondary: "#ffc2d2",
    background: "linear-gradient(145deg, rgba(255, 245, 247, 0.96) 0%, rgba(255, 233, 238, 0.92) 50%, rgba(255, 244, 247, 0.96) 100%)",
    glass: "rgba(255, 222, 229, 0.55)",
    title: "Venture committee simulation",
  },
  "ai-os": {
    id: "ai-os",
    label: "AI OS",
    badge: "MULTI-AGENT",
    accent: "#44d7a7",
    secondary: "#8efecf",
    background: "linear-gradient(145deg, rgba(240, 253, 247, 0.95) 0%, rgba(228, 250, 238, 0.9) 50%, rgba(240, 252, 246, 0.95) 100%)",
    glass: "rgba(207, 245, 228, 0.62)",
    title: "Multi-agent operating system",
  },
};
