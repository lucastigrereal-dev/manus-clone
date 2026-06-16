"use client"

import { getPlaybook } from "@/data/failurePlaybooks"

interface Props {
  errorClass: string
  missionId: string
  onAction: (action: string) => void
}

function borderColor(severity: "low" | "medium" | "high"): React.CSSProperties {
  if (severity === "high") {
    return {
      border: "1px solid rgba(239,68,68,0.45)",
      backgroundColor: "rgba(239,68,68,0.07)",
    }
  }
  if (severity === "medium") {
    return {
      border: "1px solid rgba(251,146,60,0.45)",
      backgroundColor: "rgba(251,146,60,0.07)",
    }
  }
  return {
    border: "1px solid rgba(59,130,246,0.45)",
    backgroundColor: "rgba(59,130,246,0.07)",
  }
}

function severityBadge(severity: "low" | "medium" | "high"): React.CSSProperties {
  if (severity === "high") {
    return {
      backgroundColor: "rgba(239,68,68,0.15)",
      color: "rgb(239,68,68)",
      border: "1px solid rgba(239,68,68,0.30)",
    }
  }
  if (severity === "medium") {
    return {
      backgroundColor: "rgba(251,146,60,0.15)",
      color: "rgb(234,88,12)",
      border: "1px solid rgba(251,146,60,0.30)",
    }
  }
  return {
    backgroundColor: "rgba(59,130,246,0.15)",
    color: "rgb(59,130,246)",
    border: "1px solid rgba(59,130,246,0.30)",
  }
}

export default function FailureRecoveryCard({ errorClass, missionId, onAction }: Props) {
  const playbook = getPlaybook(errorClass)

  function copyContext() {
    const payload = JSON.stringify({
      errorClass,
      missionId,
      suggestedAction: playbook.suggestedAction,
    })
    navigator.clipboard.writeText(payload).catch(() => {})
  }

  return (
    <div
      className="rounded-xl flex flex-col gap-2 px-3 py-2"
      style={borderColor(playbook.severity)}
    >
      {/* Title row */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          ⚠️ {playbook.errorClass}
        </span>
        <span
          className="text-xs rounded px-1.5 py-0.5 font-medium"
          style={severityBadge(playbook.severity)}
        >
          {playbook.severity}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs leading-snug" style={{ color: "var(--text-secondary)" }}>
        {playbook.description}
      </p>

      {/* Suggested action */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Ação sugerida:</span>
        <span
          className="font-mono text-xs px-1.5 py-0.5 rounded"
          style={{
            backgroundColor: "rgba(0,0,0,0.05)",
            color: "var(--text-primary)",
          }}
        >
          {playbook.suggestedAction}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-1.5 flex-wrap">
        {playbook.autoRetry && (
          <button
            onClick={() => onAction("retry")}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              backgroundColor: "rgba(16,185,129,0.15)",
              color: "rgb(16,185,129)",
              border: "1px solid rgba(16,185,129,0.30)",
            }}
          >
            ↻ Tentar novamente
          </button>
        )}
        {!playbook.autoRetry && (
          <button
            onClick={() => onAction("escalate")}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              backgroundColor: "rgba(107,114,128,0.12)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-main)",
            }}
          >
            🤝 Escalar para humano
          </button>
        )}
        <button
          onClick={copyContext}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          style={{
            backgroundColor: "rgba(107,114,128,0.10)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border-main)",
          }}
        >
          📋 Copiar contexto
        </button>
      </div>
    </div>
  )
}
