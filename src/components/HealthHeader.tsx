'use client'

import React from 'react'
import useSWR from 'swr'
import type { HealthResponse, ServiceHealth } from '@/app/api/health/route'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function statusColor(status: ServiceHealth['status']): string {
  if (status === 'ok')      return '#10b981'
  if (status === 'slow')    return '#f59e0b'
  return '#ef4444'
}

function StatusPill({ s }: { s: ServiceHealth }) {
  const color = statusColor(s.status)
  const label = s.latencyMs > 0 ? `${s.latencyMs}ms` : '—'

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ backgroundColor: `${color}14`, border: `1px solid ${color}40` }}>
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: color, boxShadow: s.status === 'ok' ? `0 0 4px ${color}` : 'none' }}
      />
      <span className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
        {s.name}
      </span>
      <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
        {label}
      </span>
    </div>
  )
}

export default function HealthHeader() {
  const { data } = useSWR<HealthResponse>('/api/health', fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: false,
  })

  const services = data?.services ?? []

  if (!services.length) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse" />
        <span className="text-[11px]" style={{ color: 'var(--text-disable)' }}>verificando...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {services.map((s) => (
        <StatusPill key={s.name} s={s} />
      ))}
    </div>
  )
}
