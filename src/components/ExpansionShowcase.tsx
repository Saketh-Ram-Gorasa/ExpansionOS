import type { CSSProperties } from "react";
import Link from "next/link";
import {
  modeConfig,
  type ThemeMode,
  agents,
  segmentOptions,
  ycQuestionSet,
  crustDataCalls,
  verdicts,
} from "@/lib/expansionData";
import { AgentSprite } from "@/components/AgentSprite";
import { PixelSurface } from "@/components/PixelSurface";
import { LiveCallBus } from "@/components/LiveCallBus";
import { VerdictTicker } from "@/components/VerdictTicker";

type ExpansionShowcaseProps = {
  title: string;
  subtitle: string;
  theme?: ThemeMode;
  introMetric?: string;
};

const modeLinks = [
  { href: "/", label: "core" },
  { href: "/mission-control", label: "mission-control" },
  { href: "/retro-ops", label: "retro-ops" },
  { href: "/detective-board", label: "detective-board" },
  { href: "/boardroom", label: "boardroom" },
  { href: "/ai-os", label: "ai-os" },
];

const modeCue = {
  core: ["Core Expansion", "live evidence", "single-thread execution"],
  "mission-control": ["Signal Dispatch", "priority routing", "triage-first"],
  "retro-ops": ["Arcade Run", "rapid scoring", "gamified progression"],
  "detective-board": ["Evidence First", "proof chaining", "forensic mode"],
  boardroom: ["Boardroom Review", "investment framing", "hard stop criteria"],
  "ai-os": ["Agent Dock", "parallel reasoning", "multi-loop execution"],
};

const modeNarrative: Record<
  ThemeMode,
  {
    dossier: [string, string][];
    clip: string;
    verdictSubtitle: string;
    checklist: string[];
  }
> = {
  core: {
    dossier: [
      ["ICP", "Fintech + compliance operations teams"],
      ["TARGET", "Adjacent expansion with immediate wedge"],
      ["WIN SIGNAL", "Buyer proof + shipping speed"],
      ["TIMEBOX", "90-day launch checkpoint"],
    ],
    clip: "This room converts CrustData signals into a single defendable recommendation with chain-of-custody proof.",
    verdictSubtitle: "What the crew did in one live loop.",
    checklist: [
      "Every agent exposes source, intent, output, and confidence.",
      "Call bus displays packet status by API lane and timestamp.",
      "Ranking updates based on buyer overlap and risk profile.",
      "Judges get a single story from start to recommendation.",
    ],
  },
  "mission-control": {
    dossier: [
      ["ICP", "Growth-stage operations stacks"],
      ["TARGET", "Fast wedge that reduces manual routing costs"],
      ["WIN SIGNAL", "Clear owner + clear timing"],
      ["TIMEBOX", "72-hour command cycle"],
    ],
    clip: "High-intensity mode for execution: one mission, one ranking, one next action.",
    verdictSubtitle: "Real-time control room summary in one glance.",
    checklist: [
      "Priority calls are called out by status chip.",
      "Think and call states stay visible for audit trails.",
      "No silent transitions, every decision has provenance.",
      "Next move is pinned so judges can follow execution.",
    ],
  },
  "retro-ops": {
    dossier: [
      ["ICP", "SaaS operations + enablement teams"],
      ["TARGET", "Best scoring wedge under 6 hours"],
      ["WIN SIGNAL", "Reduced manual onboarding friction"],
      ["TIMEBOX", "One sprint to prove launch"],
    ],
    clip: "Arcade rhythm, same rigor. Signals score, risk flags, and decisions resolve in sequence.",
    verdictSubtitle: "Arcade board metrics, but still startup-grade evidence.",
    checklist: [
      "Retro palette puts scoring and sequencing in focus.",
      "Agents work visibly through state chips and motion.",
      "Top options remain ranked with risk and wedge tags.",
      "Demo story remains compact for fast judges.",
    ],
  },
  "detective-board": {
    dossier: [
      ["ICP", "Evidence-driven accounts teams"],
      ["TARGET", "Build a defensible chain of proof"],
      ["WIN SIGNAL", "Cross-role consistency and ownership"],
      ["TIMEBOX", "Case-ready packet within 60 minutes"],
    ],
    clip: "Evidence-first layout keeps proof packets traceable, then ranks each option with reasoning.",
    verdictSubtitle: "Chain of custody is explicit and replayable.",
    checklist: [
      "Every packet maps to a source lane.",
      "Intent-to-output transitions stay visible per agent.",
      "Proof statements are ranked by confidence and risk.",
      "Judges can verify claims without external context.",
    ],
  },
  boardroom: {
    dossier: [
      ["ICP", "Founder + operations teams"],
      ["TARGET", "A startup wedge that can scale"],
      ["WIN SIGNAL", "Clear 30/60/90 execution line"],
      ["TIMEBOX", "2-week investor-quality demo cycle"],
    ],
    clip: "VC-style narrative framing: what to build, why now, and what proof confirms upside.",
    verdictSubtitle: "Boardroom readiness score for each recommendation.",
    checklist: [
      "Option scores call out risk and upside together.",
      "YC lens questions are embedded in the scene, not hidden.",
      "Confidence and output are tied to each role signal.",
      "Every recommendation ends with an investable next action.",
    ],
  },
  "ai-os": {
    dossier: [
      ["ICP", "Product and technical founders"],
      ["TARGET", "Parallel agent workflows"],
      ["WIN SIGNAL", "Proof exports + repeatable orchestration"],
      ["TIMEBOX", "Always-on expansion engine"],
    ],
    clip: "Multi-agent dock with parallel loops, designed for fast iteration and visible handoffs.",
    verdictSubtitle: "The operating system for expansion intelligence.",
    checklist: [
      "Agent lane order reflects handoff sequence.",
      "Confidence and source trail are visible per action.",
      "CrustData call bus stays the same data backbone.",
      "Verdict cards convert analysis into a pitch-ready motion.",
    ],
  },
};

export function ExpansionShowcase({ title, subtitle, theme = "core", introMetric = "LIVE" }: ExpansionShowcaseProps) {
  const activeConfig = modeConfig[theme] ?? modeConfig.core;
  const cues = modeCue[theme] ?? modeCue.core;
  const narrative = modeNarrative[theme] ?? modeNarrative.core;

  return (
    <main
      data-mode={theme}
      className={`os-shell os-shell-${theme}`}
      style={
        {
          "--theme-accent": activeConfig.accent,
          "--theme-secondary": activeConfig.secondary,
          "--theme-bg": activeConfig.background,
          "--theme-glass": activeConfig.glass,
        } as CSSProperties
      }
    >
      <div className="scene-overlay" />

      <header className="control-rail">
        <div className="mode-links">
          {modeLinks.map((mode) => (
            <Link
              key={mode.href}
              href={mode.href}
              className={`mode-chip ${mode.href === `/${theme === "core" ? "" : theme}` ? "active" : ""}`}
            >
              {mode.label}
            </Link>
          ))}
        </div>

        <div className="hero-panel">
          <div>
            <p className="eyebrow">ExpansionOS // {activeConfig.label}</p>
            <h1>{title}</h1>
            <p className="lead">{subtitle}</p>
          </div>

          <div className="status-line">
            <span className="status-pill">{activeConfig.badge}</span>
            <span className="status-pill">{introMetric}</span>
            <span className="status-indicator status-ok" />
            <span className="status-indicator status-busy" />
            <span className="status-indicator status-wait" />
          </div>
        </div>

        <div className="mode-cues">
          {cues.map((cue) => (
            <span key={cue}>{cue}</span>
          ))}
        </div>
      </header>

      <section className="scene-grid">
        <PixelSurface title="MISSION DOSSIER" badge={activeConfig.title} tone="core">
          <div className="dossier-metrics">
            {narrative.dossier.map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>

          <p className="panel-divider" />
          <div className="dossier-clip">
            <p>
              {narrative.clip}
            </p>
          </div>
        </PixelSurface>

        <PixelSurface title="CRUSTDATA CALL BUS" tone="muted">
          <LiveCallBus packets={crustDataCalls} />
        </PixelSurface>

        <PixelSurface title="AGENT RACK" tone="core">
          <div className="agent-rack">
            {agents.map((agent, index) => (
              <AgentSprite key={agent.name} agent={agent} order={index + 1} />
            ))}
          </div>
        </PixelSurface>
      </section>

      <section className="scene-grid scene-grid-bottom">
        <PixelSurface title="EXPANSION RANKING" badge="TOP OPTIONS" tone="core">
          <div className="rank-list">
            {segmentOptions.map((segment) => (
              <article className="rank-card" key={segment.segment}>
                <header>
                  <h3>{segment.segment}</h3>
                  <span>{segment.overlap}</span>
                </header>
                <p>{segment.signal}</p>
                <div className="chips">
                  <span>RISK {segment.risk}</span>
                  <span>WEDGE {segment.wedge}</span>
                </div>
              </article>
            ))}
          </div>
        </PixelSurface>

        <PixelSurface title="YC CHAMBER" badge="VENTURER'S LENS" tone="muted">
          <ul className="question-list">
            {ycQuestionSet.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </PixelSurface>
      </section>

      <section className="verdict-zone">
        <VerdictTicker items={verdicts} title="DEMONSTRABLE STORY" />
        <p className="muted small verdict-subtitle">{narrative.verdictSubtitle}</p>
      </section>

      <section className="pixel-surface panel-strip">
        <p className="eyebrow">DEMO CHECKLIST</p>
        <div className="strip-grid">
          {narrative.checklist.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </section>
    </main>
  );
}
