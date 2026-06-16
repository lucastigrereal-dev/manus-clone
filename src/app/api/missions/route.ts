import { NextRequest, NextResponse } from 'next/server'

export interface MissionResult {
  mission_id: string
  status: string
  objective: string
  factory: string
  risk_level: string
  estimated_cost: number
}

export async function POST(req: NextRequest) {
  let body: { objective?: string; factory?: string; risk_level?: string } = {}

  try {
    body = await req.json()
  } catch {
    // keep empty body
  }

  const { objective = '', factory, risk_level } = body

  try {
    const res = await fetch('http://localhost:8765/missions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ objective, factory, risk_level }),
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) throw new Error(`upstream ${res.status}`)

    const data: MissionResult = await res.json()
    return NextResponse.json(data)
  } catch {
    const mock: MissionResult = {
      mission_id: `mis_MOCK${Date.now()}`,
      status: 'queued',
      objective,
      factory: factory ?? 'Research',
      risk_level: risk_level ?? 'R1',
      estimated_cost: 0.005,
    }
    return NextResponse.json(mock)
  }
}
