import { NextResponse } from "next/server";

import { validateAnalyzeRequest, validateAnalyzeResponse } from "@/lib/contracts";
import { buildFailedAnalyzeResponse, runAnalyzeOrchestration } from "@/lib/orchestrator";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const input = validateAnalyzeRequest(payload);
  if (!input.ok) {
    return NextResponse.json(
      {
        error: "Invalid /analyze payload.",
        details: input.errors,
      },
      { status: 400 },
    );
  }

  try {
    const output = await runAnalyzeOrchestration(input.data);
    const validated = validateAnalyzeResponse(output);
    if (!validated.ok) {
      const fallback = buildFailedAnalyzeResponse({
        errors: ["Route-level output validation failed.", ...validated.errors],
        fallbackSteps: ["route_output_validation"],
      });
      return NextResponse.json(fallback, { status: 200 });
    }
    return NextResponse.json(validated.data, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error.";
    const fallback = buildFailedAnalyzeResponse({
      errors: [`Unhandled /analyze error: ${message}`],
      fallbackSteps: ["route_exception"],
    });
    return NextResponse.json(fallback, { status: 200 });
  }
}
