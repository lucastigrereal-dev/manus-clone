'use client'
import React from 'react'

interface FocusBrutalCardProps {
  onActivate: () => void
  onDismiss: () => void
}

export default function FocusBrutalCard({ onActivate, onDismiss }: FocusBrutalCardProps) {
  return (
    <div className="rounded-2xl p-5 my-2" style={{ border: '1px solid #6366f1', backgroundColor: '#6366f108' }}>
      <p className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
        🎯 Modo Foco Brutal
      </p>
      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
        Vou esconder tudo e mostrar só a próxima ação mais importante. Quer ativar?
      </p>
      <div className="flex gap-2">
        <button
          onClick={onActivate}
          className="px-4 py-2 rounded-xl text-sm font-semibold"
          style={{ backgroundColor: '#6366f1', color: 'white' }}
        >
          Sim, entra no foco
        </button>
        <button
          onClick={onDismiss}
          className="px-4 py-2 rounded-xl text-sm font-semibold"
          style={{ backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-main)' }}
        >
          Talvez depois
        </button>
      </div>
    </div>
  )
}
