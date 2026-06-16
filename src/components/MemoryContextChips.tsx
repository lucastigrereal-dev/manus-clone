'use client'

import React, { useState } from 'react'

export interface MemoryChunk {
  chunkId: string
  label: string
  source: string
  score: number
  preview?: string
}

interface MemoryContextChipsProps {
  chunks: MemoryChunk[]
  className?: string
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 0.8 ? '#10b981' : score >= 0.6 ? '#f59e0b' : '#94a3b8'
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1 w-16 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-main)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${score * 100}%`, backgroundColor: color }} />
      </div>
      <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
        {Math.round(score * 100)}%
      </span>
    </div>
  )
}

export default function MemoryContextChips({ chunks, className = '' }: MemoryContextChipsProps) {
  const [open, setOpen] = useState<string | null>(null)

  if (!chunks.length) return null

  return (
    <div className={`flex flex-wrap gap-1.5 mt-2 ${className}`}>
      <span className="text-[10px] uppercase tracking-widest self-center" style={{ color: 'var(--text-disable)' }}>
        🧠 AKASHA
      </span>
      {chunks.map((chunk) => (
        <div key={chunk.chunkId} className="relative">
          <button
            onClick={() => setOpen(open === chunk.chunkId ? null : chunk.chunkId)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all"
            style={{
              border: `1px solid var(--border-main)`,
              backgroundColor: open === chunk.chunkId ? 'var(--background-nav)' : 'var(--background-gray-main)',
              color: 'var(--text-secondary)',
            }}
          >
            <span className="max-w-[120px] truncate">{chunk.label}</span>
            <span className="opacity-50">{Math.round(chunk.score * 100)}%</span>
          </button>

          {open === chunk.chunkId && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(null)} />
              <div
                className="absolute z-50 bottom-full mb-2 left-0 w-72 rounded-xl p-3 shadow-xl"
                style={{
                  backgroundColor: 'var(--background-menu-white)',
                  border: '1px solid var(--border-main)',
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {chunk.label}
                  </span>
                  <ScoreBar score={chunk.score} />
                </div>
                <p className="text-[11px] leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
                  {chunk.preview ?? chunk.source}
                </p>
                <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                  Fonte: {chunk.source}
                </p>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
