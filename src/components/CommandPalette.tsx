'use client'

import React, { useCallback } from 'react'
import { Command } from 'cmdk'
import { useUiStore } from '@/stores/uiStore'
import { KRATOS_ORIGIN } from '@/lib/kratosOrigin'

interface OmnisCommand {
  id: string
  label: string
  kind: 'route' | 'action' | 'factory' | 'external'
  icon: string
  shortcut?: string
}

const COMMANDS: OmnisCommand[] = [
  { id: 'new-mission',    label: 'Nova missão',          kind: 'action',   icon: '✏️' },
  { id: 'new-project',    label: 'Criar projeto',        kind: 'action',   icon: '📁' },
  { id: 'search-akasha',  label: 'Buscar no AKASHA',     kind: 'action',   icon: '🧠' },
  { id: 'deep-research',  label: 'Ativar Deep Research', kind: 'action',   icon: '🔬' },
  { id: 'select-model',   label: 'Trocar modelo',        kind: 'action',   icon: '⚡' },
  { id: 'focus',          label: 'Modo Foco',            kind: 'action',   icon: '🎯' },
  { id: 'open-settings',  label: 'Configurações',        kind: 'route',    icon: '⚙️' },
  { id: 'app-factory',    label: 'App Factory',          kind: 'factory',  icon: '🏭' },
  { id: 'dev-build',      label: 'Dev Build',            kind: 'factory',  icon: '💻' },
  { id: 'instagram',      label: 'Instagram',            kind: 'factory',  icon: '📸' },
  { id: 'kratos',         label: 'Abrir KRATOS',         kind: 'external', icon: '🔗', shortcut: ':5174' },
]

const KIND_LABELS: Record<string, string> = {
  route: 'Navegar',
  action: 'Ação',
  factory: 'Factory',
  external: 'Externo',
}

export default function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, toggleFocusMode, setActiveFactory } =
    useUiStore()

  const runCommand = useCallback(
    (cmd: OmnisCommand) => {
      setCommandPaletteOpen(false)
      switch (cmd.id) {
        case 'focus':
          toggleFocusMode()
          break
        case 'kratos':
          window.location.assign(KRATOS_ORIGIN)
          break
        case 'app-factory':
        case 'dev-build':
        case 'instagram':
          setActiveFactory(cmd.id)
          break
        default:
          console.info('[CommandPalette] route:', cmd.id)
      }
    },
    [setCommandPaletteOpen, toggleFocusMode, setActiveFactory],
  )

  if (!commandPaletteOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40"
        onClick={() => setCommandPaletteOpen(false)}
      />

      {/* Panel */}
      <div
        className="fixed left-1/2 top-[20vh] z-50 w-full max-w-lg -translate-x-1/2 rounded-2xl shadow-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--background-menu-white)',
          border: '1px solid var(--border-main)',
        }}
      >
        <Command
          onKeyDown={(e) => {
            if (e.key === 'Escape') setCommandPaletteOpen(false)
          }}
        >
          {/* Search input */}
          <div
            className="flex items-center gap-3 px-4 py-3 border-b"
            style={{ borderColor: 'var(--border-main)' }}
          >
            <span style={{ color: 'var(--text-tertiary)' }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </span>
            <Command.Input
              placeholder="Buscar comando..."
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: 'var(--text-primary)' }}
              autoFocus
            />
            <kbd
              className="text-xs px-1.5 py-0.5 rounded"
              style={{
                color: 'var(--text-tertiary)',
                backgroundColor: 'var(--background-gray-main)',
                border: '1px solid var(--border-main)',
              }}
            >
              ESC
            </kbd>
          </div>

          {/* Results */}
          <Command.List className="max-h-72 overflow-y-auto py-2">
            <Command.Empty
              className="px-4 py-8 text-center text-sm"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Nenhum comando encontrado.
            </Command.Empty>

            {Object.entries(KIND_LABELS).map(([kind, kindLabel]) => {
              const items = COMMANDS.filter((c) => c.kind === kind)
              if (!items.length) return null
              return (
                <Command.Group key={kind} heading={kindLabel}>
                  <div
                    className="px-3 py-1 text-xs uppercase tracking-widest"
                    style={{ color: 'var(--text-disable)' }}
                  >
                    {kindLabel}
                  </div>
                  {items.map((cmd) => (
                    <Command.Item
                      key={cmd.id}
                      value={cmd.label}
                      onSelect={() => runCommand(cmd)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer rounded-lg mx-1 transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <span className="text-base">{cmd.icon}</span>
                      <span className="flex-1">{cmd.label}</span>
                      {cmd.shortcut && (
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          {cmd.shortcut}
                        </span>
                      )}
                    </Command.Item>
                  ))}
                </Command.Group>
              )
            })}
          </Command.List>

          {/* Footer hint */}
          <div
            className="px-4 py-2 text-xs flex gap-4 border-t"
            style={{ color: 'var(--text-disable)', borderColor: 'var(--border-main)' }}
          >
            <span>↑↓ navegar</span>
            <span>↵ selecionar</span>
            <span>ESC fechar</span>
          </div>
        </Command>
      </div>
    </>
  )
}
