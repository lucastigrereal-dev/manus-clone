'use client'

import React, { useState } from 'react'
import VoiceButton from '@/components/VoiceButton'
import ModelSelector, { ModelId } from '@/components/ModelSelector'
import FileUploadChat, { AttachedFile } from '@/components/FileUploadChat'
import ResearchToggle from '@/components/ResearchToggle'
import SearchFocusSelector, { FocusId } from '@/components/SearchFocusSelector'

interface ComposerProps {
  value: string
  onChange: (value: string) => void
  selectedMode: string | null
  onModeChange: (mode: string | null) => void
  onSubmit?: () => void
  disabled?: boolean
}

export default function Composer({ value, onChange, selectedMode, onModeChange, onSubmit, disabled }: ComposerProps) {
  const [selectedModel, setSelectedModel] = useState<ModelId>('ollama-fast')
  const [researchMode, setResearchMode] = useState(false)
  const [searchFocus, setSearchFocus] = useState<FocusId>('akasha')
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])

  const addFile = (f: AttachedFile) => setAttachedFiles((prev) => [...prev, f])
  const removeFile = (id: string) => setAttachedFiles((prev) => prev.filter((f) => f.id !== id))

  const handleChipSelect = (chip: string) => {
    onChange(value ? `${value} — ${chip}` : chip)
  }

  const placeholders: Record<string, string> = {
    content: 'Descreva o conteúdo que quer criar (post, carrossel, copy...)',
    instagram: 'Qual conta e período quer analisar? Ex: @agenteviaja últimos 28d',
    dev: 'Descreva o app ou automação que quer construir',
    automation: 'Qual fluxo quer automatizar? Ex: DMs de leads quentes',
    research: 'O que quer pesquisar? Ex: mercado de pousadas em Natal',
    report: 'Qual relatório quer gerar? Ex: semanal do Instagram Turismo SP',
  }

  const placeholder = selectedMode
    ? placeholders[selectedMode] ?? 'Atribua uma tarefa ou pergunte qualquer coisa'
    : 'Atribua uma tarefa ou pergunte qualquer coisa'

  return (
    <div className="w-full max-w-3xl">
      <div
        className="rounded-[22px] transition-all relative"
        style={{
          backgroundColor: 'var(--background-menu-white)',
          boxShadow: '0px 12px 32px 0px rgba(0,0,0,0.02)',
          border: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        {/* Selected Mode Badge */}
        {selectedMode && (
          <div className="px-4 pt-3 pb-1">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: 'var(--background-gray-main)', color: 'var(--text-primary)', border: '1px solid var(--border-main)' }}
            >
              <span>
                {selectedMode === 'content' && '✍️ Criar conteúdo'}
                {selectedMode === 'instagram' && '📸 Analisar Instagram'}
                {selectedMode === 'dev' && '💻 Desenvolver app'}
                {selectedMode === 'automation' && '⚡ Criar automação'}
                {selectedMode === 'research' && '🔍 Pesquisar mercado'}
                {selectedMode === 'report' && '📊 Gerar relatório'}
              </span>
              <button onClick={() => onModeChange(null)} className="ml-1 hover:text-red-500 transition-colors">×</button>
            </div>
          </div>
        )}

        {/* Textarea */}
        <div className="px-4 py-2">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                if (value.trim() && !disabled && onSubmit) onSubmit()
              }
            }}
            disabled={disabled}
            placeholder={disabled ? 'Aurora está pensando...' : placeholder}
            className="w-full min-h-[46px] resize-none outline-none bg-transparent text-[15px] leading-[24px] disabled:opacity-50"
            style={{ color: 'var(--text-primary)' }}
            rows={1}
          />
        </div>

        {/* Search Focus + Research row */}
        <div className="px-4 pb-2 flex flex-wrap items-center gap-2">
          <SearchFocusSelector value={searchFocus} onChange={setSearchFocus} />
          <div className="w-px h-4 self-center shrink-0" style={{ backgroundColor: 'var(--border-main)' }} />
          <ResearchToggle
            active={researchMode}
            onToggle={() => setResearchMode((v) => !v)}
            onChipSelect={handleChipSelect}
          />
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center gap-1">
            {/* File Upload — replaces static attach dropdown */}
            <FileUploadChat files={attachedFiles} onAdd={addFile} onRemove={removeFile} />

            {/* Model Selector */}
            <ModelSelector value={selectedModel} onChange={setSelectedModel} />

            {/* App Factory */}
            <button
              className="px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors hover:bg-neutral-100"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-main)' }}
              title="App Factory v3.1"
            >
              🏭 App Factory
            </button>

            {/* Dev Build */}
            <button
              className="px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors hover:bg-neutral-100 relative"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-main)' }}
              title="Dev / Automação"
            >
              🖥️ Dev Build
              <span
                className="absolute -top-1.5 -right-1.5 text-[9px] px-1 py-0.5 rounded-full text-white font-medium"
                style={{ backgroundColor: 'var(--Button-black)' }}
              >
                Novo
              </span>
            </button>

            {/* Instagram */}
            <button
              className="px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors hover:bg-neutral-100"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-main)' }}
              title="6 contas Creator"
            >
              📸 Instagram
            </button>

            {/* Meeting */}
            <button
              className="p-2 rounded-lg transition-colors hover:bg-neutral-100"
              style={{ color: 'var(--text-tertiary)' }}
              title="Gravar reunião"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-1">
            {/* Mic — EVO-031 Voice Shell */}
            <VoiceButton onTranscript={(t) => onChange(value + (value ? ' ' : '') + t)} />

            {/* Send */}
            <button
              disabled={!value.trim() || disabled}
              onClick={() => { if (value.trim() && onSubmit) onSubmit() }}
              className="p-2 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                backgroundColor: value.trim() && !disabled ? 'var(--Button-black)' : 'transparent',
                color: value.trim() && !disabled ? 'white' : 'var(--text-disable)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
