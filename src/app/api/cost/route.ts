import { NextResponse } from 'next/server'

export interface CostOperation {
  operation: string
  count: number
  duration_s: number
  market_value_brl: number
}

export interface CostSummary {
  total_market_value_brl: number
  savings_brl: number
  operations: CostOperation[]
  period_start: string
  period_end: string
  warnings: string[]
}

const FALLBACK: CostSummary = {
  total_market_value_brl: 0,
  savings_brl: 0,
  operations: [],
  period_start: new Date().toISOString(),
  period_end: new Date().toISOString(),
  warnings: ['Backend indisponível'],
}

export async function GET() {
  try {
    const res = await fetch('http://localhost:8765/cost/summary', {
      signal: AbortSignal.timeout(4000),
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return NextResponse.json(FALLBACK)
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(FALLBACK)
  }
}
