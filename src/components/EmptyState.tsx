'use client'

import React from 'react'

const EMPTY_STATES = {
  no_missions: {
    icon: '🚀',
    title: 'Nenhuma missão ainda',
    description: 'Digite um objetivo ou escolha um chip abaixo',
    cta: 'Nova missão',
  },
  no_history: {
    icon: '📋',
    title: 'Histórico vazio',
    description: 'Suas missões aparecem aqui após a primeira execução',
    cta: null,
  },
  no_search: {
    icon: '🔍',
    title: 'Nenhum resultado',
    description: 'Tente outros termos ou busque no AKASHA',
    cta: 'Buscar no AKASHA',
  },
  no_approvals: {
    icon: '✅',
    title: 'Nenhuma aprovação pendente',
    description: 'Ótimo! Tudo está fluindo sem gates humanos',
    cta: null,
  },
} as const

type EmptyStateVariant = keyof typeof EMPTY_STATES

interface EmptyStateProps {
  variant: EmptyStateVariant
  onCta?: () => void
}

export default function EmptyState({ variant, onCta }: EmptyStateProps) {
  const { icon, title, description, cta } = EMPTY_STATES[variant]

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <span className="text-4xl mb-4" role="img" aria-label={title}>
        {icon}
      </span>
      <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p className="text-sm max-w-[260px]" style={{ color: 'var(--text-tertiary)' }}>
        {description}
      </p>
      {cta && onCta && (
        <button
          onClick={onCta}
          className="mt-5 px-4 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
          style={{
            backgroundColor: 'var(--Button-black)',
            color: 'var(--Button-white)',
          }}
        >
          {cta}
        </button>
      )}
    </div>
  )
}
