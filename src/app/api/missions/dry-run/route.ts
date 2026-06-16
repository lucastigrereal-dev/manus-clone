import { NextRequest, NextResponse } from 'next/server'

export interface DryRunStep {
  id: string
  label: string
  estimated_cost: number
}

export interface DryRunResult {
  steps: DryRunStep[]
  estimatedCostUsd: number
  riskTier: string
}

export async function POST(req: NextRequest) {
  let body: { objective?: string; factory?: string; risk_tier?: string; risk_level?: string } = {}

  try {
    body = await req.json()
  } catch {
    // keep empty body
  }

  const risk_tier = body.risk_tier ?? body.risk_level ?? 'R1'

  const fallback: DryRunResult = {
    steps: [
      { id: 's1', label: 'Research fase inicial', estimated_cost: 0.002 },
      { id: 's2', label: 'Content generation', estimated_cost: 0.003 },
    ],
    estimatedCostUsd: 0.005,
    riskTier: risk_tier,
  }

  try {
    const res = await fetch('http://localhost:8765/missions/dry-run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      // contrato canônico: risk_tier
      body: JSON.stringify({ objective: body.objective, factory: body.factory, risk_tier }),
      signal: AbortSignal.timeout(6000),
    })

    if (!res.ok) return NextResponse.json(fallback)

    const data = await res.json()
    const result: DryRunResult = {
      steps: data.steps ?? fallback.steps,
      estimatedCostUsd: data.estimatedCostUsd ?? data.estimated_cost_usd ?? fallback.estimatedCostUsd,
      riskTier: data.risk_tier ?? data.riskTier ?? data.riskLevel ?? risk_tier,
    }
    return NextResponse.json(result)
  } catch {
    return NextResponse.json(fallback)
  }
}
