export type AgentStyle = "pixel" | "lego" | "vector";

export type AgentRuntimeState = "idle" | "thinking" | "calling" | "done";

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
  risk: string;
  wedge: string;
  signal: string;
};

export type CallPacketStatus = "queued" | "fetching" | "success" | "error";

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
  state: "good" | "warn" | "danger";
};

export type ThemeMode =
  | "mission-control"
  | "retro-ops"
  | "detective-board"
  | "boardroom"
  | "ai-os"
  | "core";

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

export const agents: ExpansionAgent[] = [
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

export const segmentOptions: SegmentOption[] = [
  {
    segment: "InsurTech Operations",
    overlap: "82%",
    risk: "Medium",
    wedge: "Approval routing + evidence export",
    signal: "Fastest path to paying pilots",
  },
  {
    segment: "Payroll Intelligence",
    overlap: "63%",
    risk: "High",
    wedge: "Webhook audit snapshots + role permissions",
    signal: "Large teams need tighter compliance guardrails",
  },
  {
    segment: "B2B Lending Ops",
    overlap: "57%",
    risk: "High",
    wedge: "Case history + exception playbooks",
    signal: "High ACV possible, slower legal clearance",
  },
];

export const ycQuestionSet = [
  "What adjacent segment becomes a repeatable GTM wedge in 90 days?",
  "Why is this a startup wedge, not a cosmetic feature set?",
  "Which buyer role changes first when we shift segments?",
  "Which metric proves the team can ship before hype peaks?",
];

export const crustDataCalls: LiveCallPacket[] = [
  {
    id: "call-1",
    timestamp: "10:12:02",
    from: "Core Console",
    to: "Cluster Sweep",
    action: "Scanning adjacent verticals",
    status: "success",
  },
  {
    id: "call-2",
    timestamp: "10:12:09",
    from: "Core Console",
    to: "Buyer Layer",
    action: "Detecting strongest overlap density",
    status: "success",
  },
  {
    id: "call-3",
    from: "Core Console",
    to: "Friction Engine",
    action: "Detecting role shifts and workload bottlenecks",
    status: "fetching",
    timestamp: "10:12:17",
  },
  {
    id: "call-4",
    from: "Core Console",
    to: "Evidence Store",
    action: "Composing proof packet lineage",
    status: "queued",
    timestamp: "10:12:29",
  },
  {
    id: "call-5",
    from: "Core Console",
    to: "Decision Core",
    action: "Refining final wedge confidence",
    status: "success",
    timestamp: "10:12:44",
  },
];

export const verdicts: VerdictItem[] = [
  { label: "AI actions", value: "4 calls, 1 API chain, 100% traceable", state: "good" },
  { label: "Data touched", value: "Company graph, hiring, competitor, and evidence lanes", state: "good" },
  { label: "Signal quality", value: "High confidence on InsurTech Ops wedge", state: "good" },
  { label: "Risks", value: "Need one 30-day pilot before full automation rollout", state: "warn" },
];

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
