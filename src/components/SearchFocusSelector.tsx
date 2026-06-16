'use client'

import React from 'react'

export type FocusId = 'akasha' | 'web' | 'instagram' | 'projects' | 'obsidian'

const FOCUS_OPTIONS: { id: FocusId; label: string; desc: string; locked?: boolean }[] = [
  { id: 'akasha',    label: 'AKASHA',    desc: 'Memória do OMNIS' },
  { id: 'web',       label: 'Web',       desc: 'Internet em tempo real' },
  { id: 'instagram', label: 'Instagram', desc: 'Seus perfis' },
  { id: 'projects',  label: 'Projetos',  desc: 'Docs dos projetos' },
  { id: 'obsidian',  label: 'Obsidian',  desc: '38K notas', locked: true },
]

interface SearchFocusSelectorProps {
  value: FocusId
  onChange: (id: FocusId) => void
}

export default function SearchFocusSelector({ value, onChange }: SearchFocusSelectorProps) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {FOCUS_OPTIONS.map((opt) => {
        const isActive = value === opt.id
        return (
          <button
            key={opt.id}
            onClick={() => !opt.locked && onChange(opt.id)}
            disabled={opt.locked}
            title={opt.locked ? `${opt.desc} — requer ingestão` : opt.desc}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all"
            style={{
              border: `1px solid ${isActive ? '#6366F1' : 'var(--border-main)'}`,
              color: opt.locked
                ? 'var(--text-disable)'
                : isActive
                ? '#6366F1'
                : 'var(--text-secondary)',
              backgroundColor: isActive ? 'rgba(99,102,241,0.08)' : 'transparent',
              cursor: opt.locked ? 'not-allowed' : 'pointer',
            }}
          >
            {opt.label}
            {opt.locked && (
              <span
                className="px-1 rounded text-[9px] font-semibold"
                style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}
              >
                ingestão
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
