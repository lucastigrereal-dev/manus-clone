'use client'

import React from 'react'
import useSWR from 'swr'
import type { OracleData } from '@/app/api/oraculo/route'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const TREND_ICON: Record<string, string> = { up: '↑', down: '↓', flat: '—' }
const TREND_COLOR: Record<string, string> = { up: '#10b981', down: '#ef4444', flat: '#7f7f7f' }

export default function OracleKPIs() {
  const { data } = useSWR<OracleData>('/api/oraculo', fetcher, {
    refreshInterval: 60_000,
    revalidateOnFocus: false,
  })

  if (!data?.kpis?.length) return null

  return (
    <div className="hidden lg:flex items-center gap-4">
      {data.kpis.map((kpi) => (
        <div key={kpi.name} className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-disable)' }}>
            {kpi.name}
          </span>
          <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
            {kpi.value}
          </span>
          {kpi.trend && (
            <span className="text-[10px] font-bold" style={{ color: TREND_COLOR[kpi.trend] ?? '#7f7f7f' }}>
              {TREND_ICON[kpi.trend]}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
