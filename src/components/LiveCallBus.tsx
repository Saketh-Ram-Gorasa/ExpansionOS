import type { LiveCallPacket } from "@/lib/expansionData";

type LiveCallBusProps = {
  packets: LiveCallPacket[];
};

const statusLabels: Record<LiveCallPacket["status"], string> = {
  queued: "QUEUED",
  fetching: "FETCHING",
  success: "SUCCESS",
  error: "ERROR",
};

const statusText: Record<LiveCallPacket["status"], string> = {
  queued: "Waiting on lane",
  fetching: "Live endpoint call",
  success: "Response applied",
  error: "Retry blocked",
};

export function LiveCallBus({ packets }: LiveCallBusProps) {
  return (
    <div className="call-bus" role="status" aria-live="polite">
      <div className="call-headline">
        <p className="eyebrow">CrustData Hotline</p>
        <p className="muted small">Live API route simulation</p>
      </div>

      <div className="call-track" aria-hidden="true">
        <div className="call-node">CORE</div>
        <div className="call-pulse">
          <span className="call-node-dot call-node-dot--left" />
          <span className="call-node-dot call-node-dot--mid" />
          <span className="call-node-dot call-node-dot--right" />
        </div>
        <div className="call-node">CRUSTDATA</div>
      </div>

      <ol className="call-log-list">
        {packets.map((packet, index) => (
          <li
            key={packet.id}
            className={`call-item status-${packet.status}`}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <span className="packet-time">{packet.timestamp}</span>
            <p className="packet-path">
              {packet.from} ? {packet.to}
            </p>
            <p className="packet-title">{packet.action}</p>
            <p className="packet-subtitle muted small">{statusText[packet.status]}</p>
            <span className="packet-chip">{statusLabels[packet.status]}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
