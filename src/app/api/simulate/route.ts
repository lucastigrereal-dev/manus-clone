import { NextRequest, NextResponse } from "next/server";

interface SimulateBody {
  objective: string;
  factory?: string;
  risk_level?: string;
}

interface Scenario {
  name: string;
  cost: number;
  time: string;
  risk: string;
  description: string;
}

const FALLBACK_SCENARIOS: Scenario[] = [
  {
    name: "Rápido",
    cost: 0.003,
    time: "2 min",
    risk: "R0",
    description: "Execução mínima sem checks",
  },
  {
    name: "Balanceado",
    cost: 0.008,
    time: "8 min",
    risk: "R1",
    description: "Qualidade e velocidade equilibradas",
  },
  {
    name: "Completo",
    cost: 0.02,
    time: "25 min",
    risk: "R2",
    description: "Máxima qualidade com todas as verificações",
  },
];

export async function POST(req: NextRequest) {
  let body: SimulateBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.objective) {
    return NextResponse.json({ error: "objective is required" }, { status: 400 });
  }

  // Try to proxy to OMNIS backend with 6s timeout
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const upstream = await fetch("http://localhost:8765/missions/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        objective: body.objective,
        factory: body.factory,
        risk_level: body.risk_level,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (upstream.ok) {
      const data = await upstream.json();
      return NextResponse.json(data);
    }
  } catch {
    // Fallback to generated scenarios
  }

  // Fallback: return 3 static scenarios
  return NextResponse.json({ scenarios: FALLBACK_SCENARIOS });
}
