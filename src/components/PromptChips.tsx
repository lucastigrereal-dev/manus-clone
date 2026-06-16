'use client'

import React from 'react'

interface PromptChipsProps {
  onChipSelect: (prompt: string) => void
}

const CHIPS = [
  { label: '📱 Legenda Instagram', prompt: 'Crie uma legenda SEOgram para o perfil [perfil] sobre [tema]' },
  { label: '🔬 Pesquisar benchmark', prompt: 'Pesquise benchmarks de [tema] no mercado brasileiro 2026' },
  { label: '⚡ Nova missão App Factory', prompt: 'Quero criar um app que faz [descrição]. Monte o PRD com paralelismo interno.' },
  { label: '💰 Análise de custo preflight', prompt: 'Analise o custo estimado desta missão antes de executar' },
  { label: '🧠 Buscar no AKASHA', prompt: 'Busque no AKASHA memórias sobre [tema]' },
  { label: '📊 Status dos serviços', prompt: 'Mostre o status atual de todos os serviços OMNIS' },
  { label: '🎯 Próxima melhor ação', prompt: 'Com base no contexto atual, qual é o próximo melhor movimento?' },
  { label: '📝 Gerar PRD', prompt: 'Gere um PRD completo com seção de paralelismo interno para: [ideia]' },
]

export default function PromptChips({ onChipSelect }: PromptChipsProps) {
  return (
    <div className="w-full overflow-x-auto py-2">
      <div className="flex gap-2 flex-nowrap px-1">
        {CHIPS.map((chip) => (
          <button
            key={chip.label}
            onClick={() => onChipSelect(chip.prompt)}
            className="flex-shrink-0 h-9 flex items-center gap-1.5 px-3 rounded-full border text-sm transition-all hover:opacity-80"
            style={{
              borderColor: 'var(--border-main)',
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--background-menu-white)',
              whiteSpace: 'nowrap',
            }}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  )
}
