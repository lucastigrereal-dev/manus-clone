'use client'

import React, { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useUiStore } from '@/stores/uiStore'

const KIND_STYLES: Record<string, { border: string; icon: string }> = {
  info:    { border: '#3b82f6', icon: 'ℹ️' },
  success: { border: '#10b981', icon: '✅' },
  warning: { border: '#f59e0b', icon: '⚠️' },
  error:   { border: '#ef4444', icon: '❌' },
}

function Toast({ id, kind, message, autoDismiss = 4000 }: {
  id: string; kind: string; message: string; autoDismiss?: number
}) {
  const removeToast = useUiStore((s) => s.removeToast)
  const style = KIND_STYLES[kind] ?? KIND_STYLES.info

  useEffect(() => {
    const t = setTimeout(() => removeToast(id), autoDismiss)
    return () => clearTimeout(t)
  }, [id, autoDismiss, removeToast])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-3 max-w-sm w-full rounded-xl px-4 py-3 shadow-lg"
      style={{
        backgroundColor: 'var(--background-menu-white)',
        border: `1px solid ${style.border}`,
        color: 'var(--text-primary)',
      }}
    >
      <span className="text-base flex-shrink-0 mt-0.5">{style.icon}</span>
      <p className="text-sm flex-1">{message}</p>
      <button
        onClick={() => removeToast(id)}
        className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity text-sm"
        style={{ color: 'var(--text-secondary)' }}
        aria-label="Fechar"
      >
        ×
      </button>
    </motion.div>
  )
}

export default function InlineToast() {
  const toasts = useUiStore((s) => s.toasts)

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2 items-end pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast {...t} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
