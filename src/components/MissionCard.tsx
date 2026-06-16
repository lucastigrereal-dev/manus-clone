'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type RiskLevel = 'R0' | 'R1' | 'R2' | 'R3'
type MissionStatus = 'queued' | 'running' | 'done' | 'failed'

export interface MissionCardData {
  id: string
  title: string
  status: MissionStatus
  risk_level: RiskLevel
  ts: string | Date
  factory: string
  estimatedCostUsd?: number
}

const RISK_COLORS: Record<RiskLevel, string> = {
  R0: '#10b981',
  R1: '#3b82f6',
  R2: '#f59e0b',
  R3: '#ef4444',
}

const STATUS_BADGE: Record<MissionStatus, { label: string; bg: string; color: string }> = {
  queued:  { label: 'Na fila',   bg: 'rgba(120,120,120,0.12)', color: '#7f7f7f' },
  running: { label: 'Rodando',   bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b' },
  done:    { label: 'Concluída', bg: 'rgba(16,185,129,0.12)',  color: '#10b981' },
  failed:  { label: 'Falhou',    bg: 'rgba(239,68,68,0.12)',   color: '#ef4444' },
}

const STATUS_BORDER: Record<MissionStatus, string> = {
  queued:  'rgba(120,120,120,0.15)',
  running: 'rgba(245,158,11,0.25)',
  done:    'rgba(16,185,129,0.25)',
  failed:  'rgba(239,68,68,0.25)',
}

const STATUS_BG: Record<MissionStatus, string> = {
  queued:  'rgba(120,120,120,0.04)',
  running: 'rgba(245,158,11,0.06)',
  done:    'rgba(16,185,129,0.06)',
  failed:  'rgba(239,68,68,0.06)',
}

export default function MissionCard({ id, title, status, risk_level, ts, factory, estimatedCostUsd }: MissionCardData) {
  const badge = STATUS_BADGE[status]
  const riskColor = RISK_COLORS[risk_level]
  const date = ts instanceof Date ? ts : new Date(ts)

  return (
    <div
      className="rounded-2xl p-4 transition-all"
      style={{
        border: `1px solid ${STATUS_BORDER[status]}`,
        backgroundColor: STATUS_BG[status],
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Factory label */}
          <p
            className="text-[10px] uppercase tracking-widest mb-0.5 font-medium"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {factory}
          </p>
          {/* Title */}
          <h4 className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h4>
        </div>

        {/* Right: status badge + risk pill */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: badge.bg, color: badge.color }}
          >
            {badge.label}
          </span>
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded"
            style={{
              border: `1px solid ${riskColor}`,
              color: riskColor,
              backgroundColor: `${riskColor}14`,
            }}
          >
            {risk_level}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between text-xs" style={{ color: 'var(--text-tertiary)' }}>
        <span>{format(date, "d MMM, HH:mm", { locale: ptBR })}</span>
        {estimatedCostUsd != null && (
          <span className="font-medium">💰 ${estimatedCostUsd.toFixed(4)}</span>
        )}
      </div>
    </div>
  )
}
