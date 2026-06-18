'use client'

import React, { useState } from 'react'
import { useSessionStore, type StoredMessage } from '@/stores/sessionStore'

interface ConversationListProps {
  onSessionSelect: (messages: StoredMessage[]) => void
}

export default function ConversationList({ onSessionSelect }: ConversationListProps) {
  const {
    sessions,
    activeSessionId,
    createSession,
    setActiveSession,
    togglePin,
    renameSession,
    deleteSession,
    searchSessions,
  } = useSessionStore()

  const [query, setQuery] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const displayed = query
    ? searchSessions(query)
    : [...sessions].sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
        return b.updatedAt.localeCompare(a.updatedAt)
      })

  const handleNew = () => {
    createSession()
    onSessionSelect([])
  }

  const handleSelect = (sess: (typeof sessions)[0]) => {
    setActiveSession(sess.id)
    onSessionSelect(sess.messages)
  }

  const handleDelete = (id: string) => {
    deleteSession(id)
    setConfirmDelete(null)
  }

  return (
    <div className="mt-4">
      <div className="px-3 mb-2 flex items-center justify-between">
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-disable)' }}
        >
          Conversas
        </span>
        <button
          onClick={handleNew}
          className="text-xs px-2 py-0.5 rounded-md transition-colors hover:bg-neutral-100"
          style={{ color: 'var(--text-tertiary)', border: '1px solid var(--border-main)' }}
          title="Nova conversa"
        >
          + Nova
        </button>
      </div>

      {/* Search */}
      <div className="px-3 mb-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar conversas..."
          className="w-full px-2 py-1.5 rounded-lg text-xs outline-none"
          style={{
            backgroundColor: 'var(--background-gray-main)',
            border: '1px solid var(--border-main)',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      {/* List */}
      {displayed.length === 0 ? (
        <p className="px-3 py-4 text-xs text-center" style={{ color: 'var(--text-disable)' }}>
          {query ? 'Nenhuma conversa encontrada.' : 'Nenhuma conversa ainda. Clique em "+ Nova".'}
        </p>
      ) : (
        <ul className="space-y-0.5 px-2">
          {displayed.map((sess) => (
            <li key={sess.id} className="group relative">
              {editingId === sess.id ? (
                <input
                  autoFocus
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => {
                    renameSession(sess.id, editTitle)
                    setEditingId(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      renameSession(sess.id, editTitle)
                      setEditingId(null)
                    }
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                  className="w-full px-3 py-1.5 text-xs rounded-lg outline-none"
                  style={{
                    backgroundColor: 'var(--background-gray-main)',
                    border: '1px solid var(--border-main)',
                    color: 'var(--text-primary)',
                  }}
                />
              ) : (
                <button
                  onClick={() => handleSelect(sess)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors pr-16 ${
                    activeSessionId === sess.id ? 'bg-neutral-100' : 'hover:bg-neutral-50'
                  }`}
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <div className="flex items-center gap-1 min-w-0">
                    {sess.pinned && (
                      <span className="flex-shrink-0 text-[10px]" style={{ color: 'var(--text-disable)' }}>
                        📌
                      </span>
                    )}
                    <span className="truncate">{sess.title || 'Nova conversa'}</span>
                  </div>
                </button>
              )}

              {/* Hover actions */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-0.5 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    togglePin(sess.id)
                  }}
                  className="p-1 rounded hover:bg-neutral-100"
                  style={{ color: 'var(--text-disable)', fontSize: 10 }}
                  title={sess.pinned ? 'Desafixar' : 'Fixar'}
                >
                  {sess.pinned ? '📌' : '📍'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingId(sess.id)
                    setEditTitle(sess.title)
                  }}
                  className="p-1 rounded hover:bg-neutral-100"
                  style={{ color: 'var(--text-disable)', fontSize: 10 }}
                  title="Renomear"
                >
                  ✏️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setConfirmDelete(sess.id)
                  }}
                  className="p-1 rounded hover:bg-red-50"
                  style={{ color: 'var(--text-disable)', fontSize: 10 }}
                  title="Excluir"
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Delete confirmation dialog */}
      {confirmDelete && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setConfirmDelete(null)}
          />
          <div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-4 rounded-xl shadow-xl"
            style={{
              backgroundColor: 'var(--background-menu-white)',
              border: '1px solid var(--border-main)',
              minWidth: 260,
            }}
          >
            <p className="text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
              Excluir esta conversa? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-3 py-1.5 rounded-lg text-xs transition-colors hover:bg-neutral-50"
                style={{ border: '1px solid var(--border-main)', color: 'var(--text-secondary)' }}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-3 py-1.5 rounded-lg text-xs text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: '#ef4444' }}
              >
                Excluir
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
