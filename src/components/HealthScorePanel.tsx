'use client'

import React from 'react'
import useSWR from 'swr'
import type { HealthResponse } from '@/app/api/health/route'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function scoreColor(score: number): string {
  if (score >= 80) return '#10b981'
  if (score >= 50) return '#f59e0b'
  return '#ef4444'
}

function scoreLabel(score: number): string {
  if (score >= 80) return 'Saudável'
  if (score >= 50) return 'Degradado'
  return 'Crítico'
}

export default function HealthScorePanel() {
  const { data } = useSWR<HealthResponse>('/api/health', fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: false,
  })

  const score = data?.score ?? 0
  const services = data?.services ?? []
  const color = scoreColor(score)
  const circumference = 2 * Math.PI * 28
  const strokeDash = (score / 100) * circumference

  return (
    <div
      className="p-4 rounded-2xl space-y-4"
      style={{ border: '1px solid var(--border-main)', backgroundColor: 'var(--background-menu-white)' }}
    >
      {/* Score gauge */}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="var(--border-main)" strokeWidth="6" />
            <circle
              cx="32" cy="32" r="28" fill="none"
              stroke={color} strokeWidth="6"
              strokeDasharray={`${strokeDash} ${circumference}`}
              strokeLinecap="round"
              transform="rotate(-90 32 32)"
              style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold" style={{ color }}>{score}</span>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {scoreLabel(score)}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Score de saúde OMNIS
          </p>
        </div>
      </div>

      {/* Service breakdown */}
      <div className="space-y-1.5">
        {services.map((s) => {
          const sColor = s.status === 'ok' ? '#10b981' : s.status === 'slow' ? '#f59e0b' : '#ef4444'
          return (
            <div key={s.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sColor }} />
                <span style={{ color: 'var(--text-secondary)' }}>{s.name}</span>
              </div>
              <span style={{ color: 'var(--text-tertiary)' }}>
                {s.latencyMs > 0 ? `${s.latencyMs}ms` : '—'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
