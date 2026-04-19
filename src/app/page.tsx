import Link from "next/link";

const productHighlights = [
  {
    title: "Who it is for",
    body: "Founders and product teams deciding which adjacent segment is worth chasing next.",
  },
  {
    title: "What it returns",
    body: "A ranked segment list, buyer shift, pain map, wedge recommendation, debate, YC lens, and decision memo.",
  },
  {
    title: "How it feels",
    body: "Simple on the surface, structured underneath, with the same pixel command-center style throughout.",
  },
];

const productSteps = [
  "Capture the current product and ICP.",
  "Guide the user through a short multi-step flow instead of a giant form.",
  "Run the analysis chain and present expansion outputs in one workspace.",
];

export default function Home() {
  return (
    <main className="product-shell">
      <section className="product-nav">
        <Link className="product-brand" href="/">
          ExpansionOS
        </Link>
        <nav className="product-nav-links">
          <Link className="active" href="/">
            Home
          </Link>
          <Link href="/flow">Guided Flow</Link>
        </nav>
      </section>

      <section className="product-hero">
        <div className="hero-copy">
          <p className="product-kicker">ExpansionOS PRD v1.1</p>
          <h1>Adjacency expansion decisions for teams that need a sharp next move.</h1>
          <p className="product-copy">
            ExpansionOS helps a team decide where to expand next by translating
            product context into a structured recommendation. It compares nearby
            segments, maps the buyer change, pressures the wedge, and ends with
            a plain-English memo you can actually discuss.
          </p>
          <div className="product-cta-row">
            <Link className="product-button" href="/flow">
              Start guided flow
            </Link>
            <a className="product-button product-button-ghost" href="#what-it-does">
              Learn more
            </a>
          </div>
        </div>

        <div className="hero-board">
          <div className="hero-board-row">
            <span>Input</span>
            <strong>Product + ICP</strong>
          </div>
          <div className="hero-board-row">
            <span>Engine</span>
            <strong>7-agent chain</strong>
          </div>
          <div className="hero-board-row">
            <span>Output</span>
            <strong>Segment + wedge + memo</strong>
          </div>
        </div>
      </section>

      <section className="landing-band" id="what-it-does">
        <div className="section-heading">
          <p className="product-kicker">What this product does</p>
          <h2>It gives expansion work a repeatable shape.</h2>
        </div>
        <div className="landing-grid">
          {productHighlights.map((item) => (
            <article className="landing-tile" key={item.title}>
              <span>{item.title}</span>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-band">
        <div className="section-heading">
          <p className="product-kicker">User flow</p>
          <h2>Short steps in, decision-grade output out.</h2>
        </div>
        <div className="flow-strip">
          {productSteps.map((step, index) => (
            <article className="flow-tile" key={step}>
              <span>0{index + 1}</span>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-band landing-band-callout">
        <div className="section-heading">
          <p className="product-kicker">Ready to try it</p>
          <h2>Use the guided flow from the navbar and build the brief a few fields at a time.</h2>
        </div>
      </section>
    </main>
  );
}
