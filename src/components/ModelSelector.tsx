'use client'

import React, { useState, useRef, useEffect } from 'react'

export const MODELS = [
  { id: 'ollama-fast',  label: 'Fast',  desc: 'GLM 5.1 — respostas rápidas',   icon: '⚡' },
  { id: 'ollama-code',  label: 'Code',  desc: 'Kimi K2 — código e técnico',    icon: '🔧' },
  { id: 'ollama-smart', label: 'Smart', desc: 'DeepSeek V4 — análise profunda', icon: '🧠' },
] as const

export type ModelId = typeof MODELS[number]['id']

const STORAGE_KEY = 'omnis:selected-model'

function loadModel(): ModelId {
  if (typeof window === 'undefined') return 'ollama-fast'
  return (localStorage.getItem(STORAGE_KEY) as ModelId) ?? 'ollama-fast'
}

interface ModelSelectorProps {
  value?: ModelId
  onChange?: (id: ModelId) => void
}

export default function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false)
  const [internal, setInternal] = useState<ModelId>(loadModel)
  const ref = useRef<HTMLDivElement>(null)

  const selected = value ?? internal
  const current = MODELS.find((m) => m.id === selected) ?? MODELS[0]

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function select(id: ModelId) {
    if (!value) {
      setInternal(id)
      localStorage.setItem(STORAGE_KEY, id)
    }
    onChange?.(id)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
        style={{
          border: '1px solid var(--border-main)',
          color: 'var(--text-secondary)',
          backgroundColor: open ? 'var(--background-nav)' : 'transparent',
        }}
        title={current.desc}
      >
        <span>{current.icon}</span>
        <span>{current.label}</span>
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          style={{ opacity: 0.5, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}
        >
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute bottom-full mb-1.5 left-0 w-52 rounded-xl shadow-lg overflow-hidden z-50"
          style={{ border: '1px solid var(--border-main)', backgroundColor: 'var(--background-menu-white)' }}
        >
          {MODELS.map((m) => (
            <button
              key={m.id}
              onClick={() => select(m.id)}
              className="w-full flex items-start gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <span className="text-base mt-0.5">{m.icon}</span>
              <div>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {m.label}
                  {m.id === selected && (
                    <span className="ml-1.5 text-[10px] font-normal" style={{ color: '#6366F1' }}>ativo</span>
                  )}
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{m.desc}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
