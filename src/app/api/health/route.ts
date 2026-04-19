import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const hasOpenAi = Boolean(process.env.OPENAI_API_KEY);
  const hasCrustData = Boolean(process.env.CRUSTDATA_API_KEY);
  const hasCrustEndpoint = Boolean(process.env.CRUSTDATA_MARKET_ENDPOINT);

  return NextResponse.json(
    {
      service: "ExpansionOS API",
      status: "ok",
      timestamp: new Date().toISOString(),
      dependencies: {
        openai: hasOpenAi ? "configured" : "missing",
        crustData: hasCrustData && hasCrustEndpoint ? "configured" : "missing",
      },
      endpoints: [
        "/api/health",
        "/api/analyze",
      ],
      mode: hasOpenAi ? "ai" : "fallback",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
