import { NextRequest, NextResponse } from 'next/server'

export interface PreflightResult {
  estimatedCostUsd: number
  decision: 'GO' | 'VETO'
  breakdown: Array<{ operation: string; costUsd: number }>
}

const FALLBACK: PreflightResult = {
  estimatedCostUsd: 0.002,
  decision: 'GO',
  breakdown: [],
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message, agent } = body as { message: string; agent?: string }

    const res = await fetch('http://localhost:8765/cost/estimate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ message, agent }),
      signal: AbortSignal.timeout(4000),
    })

    if (!res.ok) return NextResponse.json(FALLBACK)

    const data: PreflightResult = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(FALLBACK)
  }
}
