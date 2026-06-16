import { NextRequest, NextResponse } from 'next/server'

// Campo canônico do Core é `risk_tier` (src/contracts/mission_result_schema.py),
// não `risk_level`. O shell aceita ambos na entrada e fala `risk_tier` com o Core.
export interface MissionResult {
  mission_id: string
  status: string
  objective: string
  factory: string
  risk_tier: string
  estimated_cost: number
}

export async function POST(req: NextRequest) {
  let body: { objective?: string; factory?: string; risk_tier?: string; risk_level?: string } = {}

  try {
    body = await req.json()
  } catch {
    // keep empty body
  }

  const { objective = '', factory } = body
  const risk_tier = body.risk_tier ?? body.risk_level

  try {
    const res = await fetch('http://localhost:8765/missions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      // contrato canônico: risk_tier
      body: JSON.stringify({ objective, factory, risk_tier }),
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) throw new Error(`upstream ${res.status}`)

    const data = await res.json()
    // tolerante: Core retorna risk_tier; aceita risk_level legado se vier
    const result: MissionResult = {
      mission_id: data.mission_id,
      status: data.status,
      objective: data.objective ?? objective,
      factory: data.factory ?? factory ?? 'Research',
      risk_tier: data.risk_tier ?? data.risk_level ?? risk_tier ?? 'R1',
      estimated_cost: data.estimated_cost ?? 0,
    }
    return NextResponse.json(result)
  } catch {
    const mock: MissionResult = {
      mission_id: `mis_MOCK${Date.now()}`,
      status: 'queued',
      objective,
      factory: factory ?? 'Research',
      risk_tier: risk_tier ?? 'R1',
      estimated_cost: 0.005,
    }
    return NextResponse.json(mock)
  }
}
