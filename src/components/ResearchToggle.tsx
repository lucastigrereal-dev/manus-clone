'use client'

import React from 'react'

const RESEARCH_CHIPS = [
  'Benchmark de mercado',
  'Análise de concorrentes',
  'Pesquisa de tendências 2026',
  'Validar hipótese',
]

interface ResearchToggleProps {
  active: boolean
  onToggle: () => void
  onChipSelect?: (chip: string) => void
}

export default function ResearchToggle({ active, onToggle, onChipSelect }: ResearchToggleProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={onToggle}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
        style={{
          border: `1px solid ${active ? '#6366F1' : 'var(--border-main)'}`,
          color: active ? '#6366F1' : 'var(--text-secondary)',
          backgroundColor: active ? 'rgba(99,102,241,0.08)' : 'transparent',
        }}
        title="Ativar modo Deep Research — análise aprofundada com múltiplas fontes"
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.4" />
          <path d="M8.5 8.5L11 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M5.5 3.5v4M3.5 5.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        Deep Research
      </button>

      {active && onChipSelect && RESEARCH_CHIPS.map((chip) => (
        <button
          key={chip}
          onClick={() => onChipSelect(chip)}
          className="px-2 py-1 rounded-md text-[11px] transition-colors"
          style={{
            border: '1px solid rgba(99,102,241,0.3)',
            color: '#6366F1',
            backgroundColor: 'rgba(99,102,241,0.06)',
          }}
        >
          {chip}
        </button>
      ))}
    </div>
  )
}
