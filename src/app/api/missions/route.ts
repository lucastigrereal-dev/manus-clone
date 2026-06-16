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
  run_id?: string
  next_action?: string
  dry_run?: boolean
  source?: 'core' | 'mock'
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
    // Endpoint REAL de execução do Core: POST /missions/execute
    // (src/api/routers/missions.py). dry_run=true = seguro, default universal OMNIS.
    // Roda o MissionRuntime e publica mission_started/completed no SSE bus.
    const res = await fetch('http://localhost:8765/missions/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        request_text: objective,
        objective: 'research',
        dry_run: true,
      }),
      signal: AbortSignal.timeout(20000), // execute roda o runtime — pode levar segundos
    })

    if (!res.ok) throw new Error(`upstream ${res.status}`)

    // Core retorna: { run_id, mission_id, status, dry_run, execution, error, next_action }
    const data = await res.json()
    const result: MissionResult = {
      mission_id: data.mission_id,
      status: data.status,
      objective,
      factory: factory ?? 'Research',
      risk_tier: risk_tier ?? 'R1',
      estimated_cost: 0,
      run_id: data.run_id,
      next_action: data.next_action,
      dry_run: data.dry_run,
      source: 'core', // prova: veio do Core real, não do mock
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
      source: 'mock', // Core indisponível — fallback honesto
    }
    return NextResponse.json(mock)
  }
}
