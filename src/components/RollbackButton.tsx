"use client"

import { useState, useEffect, useRef } from "react"

interface Props {
  missionId: string
  onRolledBack?: (checkpointId: string) => void
}

type ButtonState = "idle" | "confirming" | "loading" | "success"

export default function RollbackButton({ missionId, onRolledBack }: Props) {
  const [state, setState] = useState<ButtonState>("idle")
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clear any pending timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  function handleClick() {
    if (state === "loading" || state === "success") return

    if (state === "idle") {
      // First click — enter confirming state, auto-revert after 2s
      setState("confirming")
      timerRef.current = setTimeout(() => {
        setState("idle")
      }, 2000)
      return
    }

    if (state === "confirming") {
      // Second click within 2s — execute rollback
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      executeRollback()
    }
  }

  async function executeRollback() {
    setState("loading")
    try {
      const res = await fetch(`/api/missions/${missionId}/rollback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
      const data = await res.json()
      const checkpointId = (data.restoredCheckpoint as string) ?? "latest"

      setState("success")
      onRolledBack?.(checkpointId)

      timerRef.current = setTimeout(() => {
        setState("idle")
      }, 2000)
    } catch {
      setState("idle")
    }
  }

  const isConfirming = state === "confirming"
  const isLoading = state === "loading"
  const isSuccess = state === "success"

  const buttonStyle: React.CSSProperties = {
    border: isConfirming
      ? "1px solid rgb(239,68,68)"
      : "1px solid var(--border-main)",
    color: isConfirming
      ? "rgb(239,68,68)"
      : isSuccess
      ? "rgb(16,185,129)"
      : "var(--text-secondary)",
    backgroundColor: isConfirming
      ? "rgba(239,68,68,0.08)"
      : "transparent",
    cursor: isLoading ? "not-allowed" : "pointer",
    opacity: isLoading ? 0.7 : 1,
    transition: "all 150ms",
  }

  let label: string
  if (isLoading) label = "..."
  else if (isSuccess) label = "✓ Revertido"
  else if (isConfirming) label = "Confirmar rollback?"
  else label = "↩ Rollback"

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="px-2 py-1 text-xs rounded-lg transition-colors"
      style={buttonStyle}
    >
      {label}
    </button>
  )
}
