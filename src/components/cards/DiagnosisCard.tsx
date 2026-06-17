'use client'

// src/components/cards/DiagnosisCard.tsx
// Ideia #2, #3 — Médico do Sistema com diagnóstico em 3 níveis
// Renderizado NO CHAT como resposta de "faz check-up"

import React, { useState } from 'react'
import type { Diagnosis, SystemHealth, Climate } from '@/types/calm-expansion'

const CLIMATE_EMOJI: Record<Climate, string> = {
  sol: '☀️', nuvens: '🌥️', chuva: '🌧️', tempestade: '⛈️', fogo: '🔥',
}

const CLIMATE_LABEL: Record<Climate, string> = {
  sol: 'Estável', nuvens: 'Atenção', chuva: 'Degradado', tempestade: 'Incidente', fogo: 'Crítico',
}

const SEVERITY_COLOR: Record<string, string> = {
  R0: '#10b981', R1: '#3b82f6', R2: '#f59e0b', R3: '#ef4444', R4: '#dc2626',
}

interface DiagnosisCardProps {
  diagnosis: Diagnosis
  health: SystemHealth
  onFixBottleneck?: () => void
}

type Level = 'leigo' | 'operacional' | 'tecnico'

export default function DiagnosisCard({ diagnosis, health, onFixBottleneck }: DiagnosisCardProps) {
  const [level, setLevel] = useState<Level>('leigo')
  const color = SEVERITY_COLOR[diagnosis.severity] ?? '#3b82f6'

  return (
    <div
      className="rounded-2xl p-4 my-2"
      style={{ border: `1px solid ${color}40`, backgroundColor: `${color}08` }}
    >
      {/* Clima + header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{CLIMATE_EMOJI[health.climate]}</span>
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Clima do OMNIS: {CLIMATE_LABEL[health.climate]}
        </span>
        <span className="text-xs ml-auto font-mono" style={{ color: 'var(--text-tertiary)' }}>
          {health.score}/100
        </span>
      </div>

      {/* Conteúdo por nível */}
      <div className="text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
        {level === 'leigo' && <p>{diagnosis.level_leigo}</p>}
        {level === 'operacional' && <p style={{ color: 'var(--text-secondary)' }}>{diagnosis.level_operacional}</p>}
        {level === 'tecnico' && (
          <div className="space-y-1">
            {diagnosis.evidence?.map((e, i) => (
              <p key={i} className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>· {e}</p>
            ))}
          </div>
        )}
      </div>

      {/* Próxima ação — sempre visível */}
      <div className="rounded-xl p-3 mb-3" style={{ backgroundColor: 'var(--background-menu-white)', border: '1px solid var(--border-main)' }}>
        <p className="text-[11px] uppercase tracking-wide font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>
          Próxima ação
        </p>
        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{diagnosis.next_action}</p>
      </div>

      {/* Seletor de nível */}
      <div className="flex gap-1.5 flex-wrap">
        {(['leigo', 'operacional', 'tecnico'] as Level[]).map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium transition-colors"
            style={{
              backgroundColor: level === l ? '#6366F1' : 'transparent',
              color: level === l ? 'white' : 'var(--text-secondary)',
              border: '1px solid var(--border-main)',
            }}
          >
            {l === 'leigo' ? 'Simples' : l === 'operacional' ? 'Operacional' : 'Técnico'}
          </button>
        ))}
        {health.bottleneck && onFixBottleneck && (
          <button
            onClick={onFixBottleneck}
            className="px-2.5 py-1 rounded-lg text-xs font-medium ml-auto"
            style={{ backgroundColor: '#10b981', color: 'white' }}
          >
            Corrigir gargalo
          </button>
        )}
      </div>
    </div>
  )
}
