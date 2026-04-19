import Link from "next/link";
import { concepts, getConcept } from "@/lib/concepts";

type ConceptShellProps = {
  slug: string;
  themeClassName: string;
  children: React.ReactNode;
};

export function ConceptShell({ slug, themeClassName, children }: ConceptShellProps) {
  const concept = getConcept(slug);

  if (!concept) {
    return null;
  }

  return (
    <div className={`theme-wrap ${themeClassName}`}>
      <main className="concept-shell">
        <nav className="top-nav panel">
          <Link href="/">Back to gallery</Link>
          <div className="top-nav-links">
            {concepts.map((item) => (
              <Link
                key={item.slug}
                href={`/${item.slug}`}
                className={item.slug === slug ? "active" : undefined}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </nav>

        <section className="concept-hero panel">
          <div>
            <p className="eyebrow">{concept.category} Direction</p>
            <h1>{concept.title}</h1>
            <p className="hero-copy">{concept.summary}</p>
          </div>
          <div className="hero-aside">
            {concept.heroMetrics.map((metric) => (
              <div key={metric.label} className="metric-card">
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </div>
            ))}
          </div>
        </section>

        {children}
      </main>
    </div>
  );
}

