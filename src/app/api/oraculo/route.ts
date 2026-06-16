import { NextResponse } from 'next/server'

export interface OracleKPI {
  name: string
  value: string
  delta?: string
  trend?: 'up' | 'down' | 'flat'
}

export interface OracleData {
  kpis: OracleKPI[]
  timestamp: string
}

const FALLBACK: OracleData = {
  kpis: [
    { name: 'Missões/semana', value: '—', trend: 'flat' },
    { name: 'Custo total', value: 'R$ 0,00', trend: 'flat' },
    { name: 'Valor gerado', value: 'R$ 0,00', trend: 'up' },
  ],
  timestamp: new Date().toISOString(),
}

export async function GET() {
  try {
    const [costRes, missionsRes] = await Promise.allSettled([
      fetch('http://localhost:8765/cost/summary', { signal: AbortSignal.timeout(3000) }),
      fetch('http://localhost:8765/missions?limit=50', { signal: AbortSignal.timeout(3000) }),
    ])

    const cost = costRes.status === 'fulfilled' && costRes.value.ok
      ? await costRes.value.json()
      : null

    const missions = missionsRes.status === 'fulfilled' && missionsRes.value.ok
      ? await missionsRes.value.json()
      : null

    const totalMissions = missions?.total ?? missions?.missions?.length ?? 0
    const marketValue = cost?.total_market_value_brl ?? 0
    const savings = cost?.savings_brl ?? 0

    const kpis: OracleKPI[] = [
      {
        name: 'Missões',
        value: String(totalMissions),
        trend: totalMissions > 0 ? 'up' : 'flat',
      },
      {
        name: 'Valor gerado',
        value: `R$ ${marketValue.toFixed(2)}`,
        trend: marketValue > 0 ? 'up' : 'flat',
      },
      {
        name: 'Economia',
        value: `R$ ${savings.toFixed(2)}`,
        trend: savings > 0 ? 'up' : 'flat',
      },
    ]

    return NextResponse.json({ kpis, timestamp: new Date().toISOString() } satisfies OracleData)
  } catch {
    return NextResponse.json(FALLBACK)
  }
}
