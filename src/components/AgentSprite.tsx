import { AgentAvatar } from "@/components/AgentAvatar";
import type { ExpansionAgent } from "@/lib/expansionData";

type AgentSpriteProps = {
  agent: ExpansionAgent;
  order: number;
};

export function AgentSprite({ agent, order }: AgentSpriteProps) {
  const stateLabel = {
    idle: "IDLE",
    thinking: "THINK",
    calling: "CALL",
    done: "DONE",
  } as const;

  return (
    <article className="agent-tile" data-state={agent.state} data-order={order}>
      <div className="agent-stage" aria-hidden="true">
        <AgentAvatar style={agent.style} accent={agent.accent} state={agent.state} />
        <span className="agent-lamp" />
      </div>

        <div className="agent-main">
          <div className="agent-name-row">
            <h3>{agent.name}</h3>
            <span className={`state-chip state-${agent.state}`}>{stateLabel[agent.state]}</span>
          </div>

          <p className="agent-title">{agent.title}</p>
          <p className="agent-intent">INTENT: {agent.intent}</p>

          <div className="agent-meta">
            <p>
              <span className="meta-label">signal</span>
              {agent.signal}
          </p>
          <p>
            <span className="meta-label">source</span>
            {agent.source}
          </p>
        </div>

        <p className="agent-output">{agent.output}</p>

        <div className="agent-foot">
          <span className="muted small">NEXT</span>
          <strong>{agent.nextMove}</strong>
        </div>

        <div className="confidence-strip" aria-hidden="true">
          <span>CONFIDENCE {agent.confidence}%</span>
          <div className="confidence-track">
            <span style={{ width: `${agent.confidence}%` }} />
          </div>
        </div>
      </div>
    </article>
  );
}
