'use client'

import React, { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useUiStore } from '@/stores/uiStore'

type RiskLevel = 'R0' | 'R1' | 'R2' | 'R3'
type MissionStatus = 'queued' | 'running' | 'done' | 'failed' | 'cancelled'

export interface MissionCardData {
  id: string
  title: string
  status: MissionStatus
  risk_level: RiskLevel
  ts: string | Date
  factory: string
  estimatedCostUsd?: number
}

interface MissionCardProps extends MissionCardData {
  onCancel?: (id: string) => void
}

const RISK_COLORS: Record<RiskLevel, string> = {
  R0: '#10b981',
  R1: '#3b82f6',
  R2: '#f59e0b',
  R3: '#ef4444',
}

const STATUS_BADGE: Record<MissionStatus, { label: string; bg: string; color: string }> = {
  queued:    { label: 'Na fila',    bg: 'rgba(120,120,120,0.12)', color: '#7f7f7f' },
  running:   { label: 'Rodando',    bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b' },
  done:      { label: 'Concluída',  bg: 'rgba(16,185,129,0.12)',  color: '#10b981' },
  failed:    { label: 'Falhou',     bg: 'rgba(239,68,68,0.12)',   color: '#ef4444' },
  cancelled: { label: 'Cancelada',  bg: 'rgba(100,100,100,0.12)', color: '#909090' },
}

const STATUS_BORDER: Record<MissionStatus, string> = {
  queued:    'rgba(120,120,120,0.15)',
  running:   'rgba(245,158,11,0.25)',
  done:      'rgba(16,185,129,0.25)',
  failed:    'rgba(239,68,68,0.25)',
  cancelled: 'rgba(100,100,100,0.18)',
}

const STATUS_BG: Record<MissionStatus, string> = {
  queued:    'rgba(120,120,120,0.04)',
  running:   'rgba(245,158,11,0.06)',
  done:      'rgba(16,185,129,0.06)',
  failed:    'rgba(239,68,68,0.06)',
  cancelled: 'rgba(100,100,100,0.05)',
}

export default function MissionCard({
  id,
  title,
  status,
  risk_level,
  ts,
  factory,
  estimatedCostUsd,
  onCancel,
}: MissionCardProps) {
  const badge = STATUS_BADGE[status]
  const riskColor = RISK_COLORS[risk_level]
  const date = ts instanceof Date ? ts : new Date(ts)
  const addToast = useUiStore((s) => s.addToast)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const canCancel = status === 'running' || status === 'queued'

  async function handleConfirmCancel() {
    setCancelling(true)
    try {
      const res = await fetch(`/api/missions/${id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'user_request', cancelled_by: 'lucas' }),
      })
      setConfirmOpen(false)
      if (res.status === 200) {
        onCancel?.(id)
        addToast({ kind: 'success', message: 'Missão cancelada.' })
      } else if (res.status === 409) {
        addToast({ kind: 'warning', message: 'Missão já finalizada.' })
      } else {
        addToast({ kind: 'error', message: 'Erro ao cancelar. Tente novamente.' })
      }
    } catch {
      setConfirmOpen(false)
      addToast({ kind: 'error', message: 'Erro ao cancelar. Tente novamente.' })
    } finally {
      setCancelling(false)
    }
  }

  return (
    <>
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

        {/* Cancel button — only for active missions */}
        {canCancel && (
          <div className="mt-3 flex justify-end">
            <button
              disabled={cancelling}
              onClick={() => setConfirmOpen(true)}
              style={{
                fontSize: '11px',
                padding: '3px 10px',
                borderRadius: '6px',
                border: '1px solid rgba(239,68,68,0.55)',
                color: '#ef4444',
                backgroundColor: 'transparent',
                cursor: cancelling ? 'not-allowed' : 'pointer',
                lineHeight: '1.5',
                fontWeight: 500,
                transition: 'opacity 0.15s',
                opacity: cancelling ? 0.4 : 1,
              }}
              onMouseEnter={(e) => { if (!cancelling) e.currentTarget.style.opacity = '0.75' }}
              onMouseLeave={(e) => { if (!cancelling) e.currentTarget.style.opacity = '1' }}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Inline confirmation dialog */}
      {confirmOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(0,0,0,0.40)' }}
            onClick={() => setConfirmOpen(false)}
          />

          {/* Dialog panel */}
          <div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
            style={{
              backgroundColor: 'var(--bg-surface, #1a1a1a)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: '14px',
              padding: '24px',
              width: '320px',
              boxShadow: '0 24px 48px rgba(0,0,0,0.50)',
            }}
          >
            <h3
              className="text-sm font-semibold mb-1"
              style={{ color: 'var(--text-primary, #f0f0f0)' }}
            >
              Cancelar missão?
            </h3>
            <p
              className="text-xs mb-5"
              style={{ color: 'var(--text-tertiary, #888)' }}
            >
              Esta ação não pode ser desfeita.
            </p>

            <div className="flex gap-2 justify-end">
              {/* Voltar */}
              <button
                onClick={() => setConfirmOpen(false)}
                style={{
                  fontSize: '12px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'var(--text-secondary, #aaa)',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Voltar
              </button>

              {/* Confirmar cancelamento */}
              <button
                onClick={handleConfirmCancel}
                disabled={cancelling}
                style={{
                  fontSize: '12px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(239,68,68,0.70)',
                  color: cancelling ? 'rgba(239,68,68,0.5)' : '#ef4444',
                  backgroundColor: 'rgba(239,68,68,0.08)',
                  cursor: cancelling ? 'not-allowed' : 'pointer',
                  fontWeight: 500,
                  opacity: cancelling ? 0.7 : 1,
                }}
              >
                {cancelling ? 'Cancelando...' : 'Cancelar missão'}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
