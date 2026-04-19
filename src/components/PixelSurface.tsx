import type { ReactNode } from "react";

type PixelSurfaceProps = {
  children: ReactNode;
  title?: string;
  tone?: "core" | "muted";
  badge?: string;
};

export function PixelSurface({ children, title, tone = "core", badge }: PixelSurfaceProps) {
  return (
    <section className={`pixel-surface pixel-surface-${tone}`}>
      {(title ?? badge) && (
        <header className="pixel-surface-head">
          {title ? <h2>{title}</h2> : null}
          {badge ? <span className="pixel-chip">{badge}</span> : null}
        </header>
      )}
      <div>{children}</div>
    </section>
  );
}
