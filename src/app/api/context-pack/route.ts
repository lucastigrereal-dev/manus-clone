import { NextRequest, NextResponse } from "next/server";

export interface Turn {
  role: "user" | "assistant";
  content: string;
}

export interface ContextPackResponse {
  recentTurns: Turn[];
  summaryRef: string | null;
  memoryRefs: string[];
}

export async function POST(req: NextRequest) {
  let body: { turns?: Turn[]; conversationId?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { recentTurns: [], summaryRef: null, memoryRefs: [] } satisfies ContextPackResponse,
      { status: 200 }
    );
  }

  const turns: Turn[] = body.turns ?? [];
  const recentTurns = turns.slice(-8);
  const conversationId = body.conversationId ?? "global";

  try {
    const upstream = await fetch("http://localhost:8765/akasha/context-pack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ turns: recentTurns, conversationId }),
      signal: AbortSignal.timeout(5000),
    });

    if (!upstream.ok) {
      throw new Error(`upstream ${upstream.status}`);
    }

    const data: ContextPackResponse = await upstream.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    // Fallback: return sliced turns with no summary/memory refs
    const fallback: ContextPackResponse = {
      recentTurns,
      summaryRef: null,
      memoryRefs: [],
    };
    return NextResponse.json(fallback, { status: 200 });
  }
}
