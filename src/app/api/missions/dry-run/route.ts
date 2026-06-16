import { NextRequest, NextResponse } from 'next/server'

export interface DryRunStep {
  id: string
  label: string
  estimated_cost: number
}

export interface DryRunResult {
  steps: DryRunStep[]
  estimatedCostUsd: number
  riskLevel: string
}

export async function POST(req: NextRequest) {
  let body: { objective?: string; factory?: string; risk_level?: string } = {}

  try {
    body = await req.json()
  } catch {
    // keep empty body
  }

  const fallback: DryRunResult = {
    steps: [
      { id: 's1', label: 'Research fase inicial', estimated_cost: 0.002 },
      { id: 's2', label: 'Content generation', estimated_cost: 0.003 },
    ],
    estimatedCostUsd: 0.005,
    riskLevel: body.risk_level ?? 'R1',
  }

  try {
    const res = await fetch('http://localhost:8765/missions/dry-run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(6000),
    })

    if (!res.ok) return NextResponse.json(fallback)

    const data: DryRunResult = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(fallback)
  }
}
