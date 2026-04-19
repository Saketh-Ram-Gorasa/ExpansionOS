export const AGENT_FIGURE_STYLES = ["sleek", "pixel", "lego"] as const;
export type AgentStyle = (typeof AGENT_FIGURE_STYLES)[number];

export const AGENT_FIGURE_ACCENTS = ["amber", "green", "cyan", "red"] as const;
export type AgentAccent = (typeof AGENT_FIGURE_ACCENTS)[number];

export const CONCEPT_SLUGS = ["mission-control", "retro-ops", "detective-board", "ai-os", "boardroom"] as const;
export type ConceptSlug = (typeof CONCEPT_SLUGS)[number];

export type ConceptHeroMetric = {
  label: string;
  value: string;
};

export type Concept = {
  slug: ConceptSlug;
  title: string;
  category: string;
  tagline: string;
  summary: string;
  accent: string;
  agentStyles: AgentStyle[];
  agentAccents: AgentAccent[];
  agentNames: string[];
  previewPoints: string[];
  heroMetrics: ConceptHeroMetric[];
};

export const concepts: Concept[] = [
  {
    slug: "mission-control",
    title: "Mission Control",
    category: "Cinematic",
    tagline: "A tactical intelligence console where agents scan, call, and lock onto the next expansion wedge.",
    summary:
      "High-drama command center with live agent dispatch, CrustData hotline visuals, and a battlefield-like verdict screen.",
    accent: "#57d6ff",
    agentStyles: ["sleek", "sleek", "lego"],
    agentAccents: ["cyan", "amber", "green"],
    agentNames: ["Scout", "Bull", "YC"],
    previewPoints: ["Live hotline animation", "Tactical dashboard panels", "High-contrast judge reveal"],
    heroMetrics: [
      { label: "Energy", value: "High drama" },
      { label: "Demo feel", value: "Command deck" },
      { label: "Best for", value: "Agent choreography" },
    ],
  },
  {
    slug: "retro-ops",
    title: "Retro Ops",
    category: "Arcade",
    tagline: "A premium CRT arcade console with pixel agents, scoreboards, and a hotline to intelligence.",
    summary:
      "Playful retro-futurist experience with pixel characters, neon gauges, and gamified strategy without losing seriousness.",
    accent: "#ffb347",
    agentStyles: ["pixel", "pixel", "lego"],
    agentAccents: ["amber", "green", "red"],
    agentNames: ["Scout", "Bear", "Wedge"],
    previewPoints: ["Pixel human agents", "Gamified signal meters", "Arcade-grade motion language"],
    heroMetrics: [
      { label: "Energy", value: "Memorable" },
      { label: "Demo feel", value: "Arcade cabinet" },
      { label: "Best for", value: "Standing out fast" },
    ],
  },
  {
    slug: "detective-board",
    title: "Detective Board",
    category: "Investigative",
    tagline: "A case-building interface that turns adjacent segments into evidence-backed expansion cases.",
    summary:
      "Stylized corkboard with pinned evidence, connecting strings, informant calls, and a final case recommendation.",
    accent: "#d9a35f",
    agentStyles: ["sleek", "lego", "sleek"],
    agentAccents: ["amber", "red", "cyan"],
    agentNames: ["Source", "YC", "Judge"],
    previewPoints: ["Evidence-first story", "Pinned cards and string map", "Perfect for Bull vs Bear"],
    heroMetrics: [
      { label: "Energy", value: "Investigative" },
      { label: "Demo feel", value: "Case room" },
      { label: "Best for", value: "Trust and evidence" },
    ],
  },
  {
    slug: "ai-os",
    title: "AI Operating System",
    category: "Productized",
    tagline: "A spatial operating system where each agent runs in its own live process window.",
    summary:
      "Closest to a real startup product, with floating windows, docked agents, and an elegant process-driven UI.",
    accent: "#61f2a3",
    agentStyles: ["lego", "sleek", "lego"],
    agentAccents: ["green", "cyan", "amber"],
    agentNames: ["Buyer", "Pain", "YC"],
    previewPoints: ["Windowed workflows", "Process dock", "Premium future-of-work aesthetic"],
    heroMetrics: [
      { label: "Energy", value: "Sophisticated" },
      { label: "Demo feel", value: "AI desktop" },
      { label: "Best for", value: "Real product vibe" },
    ],
  },
  {
    slug: "boardroom",
    title: "Boardroom",
    category: "Venture",
    tagline: "A polished investment committee where agents debate the market wedge and stamp a verdict.",
    summary:
      "Serious, founder-facing interface blending venture memo clarity with live deliberation and scorecards.",
    accent: "#ff6a88",
    agentStyles: ["sleek", "lego", "sleek"],
    agentAccents: ["red", "amber", "green"],
    agentNames: ["Bull", "Bear", "YC"],
    previewPoints: ["Pitch-deck quality visuals", "Partner-style challenge cards", "Board-level conviction"],
    heroMetrics: [
      { label: "Energy", value: "Credible" },
      { label: "Demo feel", value: "Investment committee" },
      { label: "Best for", value: "Founder persuasion" },
    ],
  },
];

export const getConcept = (slug: string) => concepts.find((concept) => concept.slug === slug);
