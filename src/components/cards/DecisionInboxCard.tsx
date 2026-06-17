'use client'

// src/components/cards/DecisionInboxCard.tsx
// Ideia #20, #21 — "O que precisa de mim?" — só decisões que travam (blocking)

import React from 'react'
import type { Decision } from '@/types/calm-expansion'

const RISK_COLOR: Record<string, string> = {
  R0: '#10b981', R1: '#3b82f6', R2: '#f59e0b', R3: '#ef4444', R4: '#dc2626',
}

interface DecisionInboxCardProps {
  decisions: Decision[]
  onDecide: (decisionId: string, choice: string) => void
}

export default function DecisionInboxCard({ decisions, onDecide }: DecisionInboxCardProps) {
  const blocking = decisions.filter((d) => d.blocking && d.status === 'pending')

  if (blocking.length === 0) {
    return (
      <div className="rounded-2xl p-4 my-2" style={{ border: '1px solid #86efac', backgroundColor: '#f0fdf4' }}>
        <p className="text-sm" style={{ color: '#166534' }}>
          ✓ Nada precisa de você agora. Tudo rodando ou aguardando o sistema.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl p-4 my-2" style={{ border: '1px solid var(--border-main)', backgroundColor: 'var(--background-menu-white)' }}>
      <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
        Só preciso que você decida {blocking.length} {blocking.length === 1 ? 'coisa' : 'coisas'}:
      </p>
      <div className="space-y-3">
        {blocking.map((d, i) => {
          const color = RISK_COLOR[d.risk_level] ?? '#f59e0b'
          return (
            <div key={d.decision_id} className="rounded-xl p-3" style={{ border: `1px solid ${color}30`, backgroundColor: `${color}08` }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold" style={{ color: 'var(--text-tertiary)' }}>{i + 1}.</span>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{d.title}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded ml-auto" style={{ color, border: `1px solid ${color}` }}>
                  {d.risk_level}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(d.options ?? ['Aprovar', 'Rejeitar']).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => onDecide(d.decision_id, opt)}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
                    style={{ backgroundColor: 'var(--background-nav)', color: 'var(--text-primary)', border: '1px solid var(--border-main)' }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
