'use client'

import React, { useState } from 'react'
import { useProjectStore } from '@/stores/projectStore'

function CreateProjectModal({ onClose }: { onClose: () => void }) {
  const createProject = useProjectStore((s) => s.createProject)
  const [name, setName] = useState('')
  const [instructions, setInstructions] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    createProject(name.trim(), instructions.trim())
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose} />
      <div
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-2xl p-6"
        style={{ backgroundColor: 'var(--background-menu-white)', border: '1px solid var(--border-main)' }}
      >
        <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Novo projeto
        </h2>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>
              Nome
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Marketing Hotel Vitalità"
              autoFocus
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                border: '1px solid var(--border-main)',
                backgroundColor: 'var(--background-gray-main)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>
              Instrução fixa (herdada por todas as missões)
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Ex: Sempre responder em PT-BR. Tom formal. Focar em leads B2B."
              rows={3}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={{
                border: '1px solid var(--border-main)',
                backgroundColor: 'var(--background-gray-main)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
          <div className="flex gap-2 justify-end mt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-1.5 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-40"
              style={{ backgroundColor: '#6366F1' }}
            >
              Criar
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default function ProjectPanel() {
  const { projects, activeProjectId, setActiveProject, deleteProject } = useProjectStore()
  const [creating, setCreating] = useState(false)

  return (
    <div className="flex flex-col gap-1">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-disable)' }}>
          Projetos
        </span>
        <button
          onClick={() => setCreating(true)}
          className="w-5 h-5 flex items-center justify-center rounded transition-colors hover:bg-neutral-200/50"
          style={{ color: 'var(--text-secondary)' }}
          title="Novo projeto"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* List */}
      {projects.length === 0 && (
        <p className="px-3 text-xs" style={{ color: 'var(--text-disable)' }}>
          Nenhum projeto ainda.
        </p>
      )}

      {projects.map((project) => {
        const isActive = project.id === activeProjectId
        return (
          <div
            key={project.id}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-colors mx-1"
            onClick={() => setActiveProject(isActive ? null : project.id)}
            style={{
              backgroundColor: isActive ? 'var(--background-nav)' : 'transparent',
              border: isActive ? `1px solid ${project.color}30` : '1px solid transparent',
            }}
          >
            {/* Color dot */}
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: project.color }}
            />

            {/* Name + count */}
            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-medium truncate"
                style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}
              >
                {project.name}
              </p>
              <p className="text-[10px]" style={{ color: 'var(--text-disable)' }}>
                {project.missions.length} missões · {project.files.length} docs
              </p>
            </div>

            {/* Delete on hover */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (confirm(`Deletar "${project.name}"?`)) deleteProject(project.id)
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded"
              style={{ color: 'var(--text-disable)' }}
              title="Deletar projeto"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 10L10 2M2 2l8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )
      })}

      {creating && <CreateProjectModal onClose={() => setCreating(false)} />}
    </div>
  )
}
