"use client"

import { useMemo } from "react"
import { useMissionStream } from "@/hooks/useMissionStream"
import WaveProgressCard from "@/components/WaveProgressCard"

interface Props {
  missionId: string
  onClose: () => void
}

interface StepState {
  id: string
  label: string
  progress: number
  status: "pending" | "running" | "done" | "error"
}

interface WaveState {
  id: string
  label: string
  steps: StepState[]
  status: "pending" | "running" | "done"
}

function statusBanner(
  status: "idle" | "connecting" | "streaming" | "done" | "error"
): { text: string; color: string; bg: string } {
  switch (status) {
    case "connecting":
      return { text: "Conectando...", color: "var(--text-secondary)", bg: "var(--background-nav)" }
    case "streaming":
      return { text: "Streaming...", color: "rgb(217,119,6)", bg: "rgba(217,119,6,0.08)" }
    case "done":
      return { text: "Missão concluída ✓", color: "rgb(16,185,129)", bg: "rgba(16,185,129,0.08)" }
    case "error":
      return { text: "Erro na conexão", color: "rgb(239,68,68)", bg: "rgba(239,68,68,0.08)" }
    default:
      return { text: "Aguardando...", color: "var(--text-tertiary)", bg: "var(--background-nav)" }
  }
}

export default function MissionStreamView({ missionId, onClose }: Props) {
  const { events, status, error } = useMissionStream(missionId)

  // Derive wave state from events
  const waves = useMemo<WaveState[]>(() => {
    const waveMap = new Map<string, WaveState>()
    const waveOrder: string[] = []

    for (const evt of events) {
      if (evt.type === "wave_start") {
        const waveId = evt.waveId as string
        if (!waveMap.has(waveId)) {
          waveMap.set(waveId, {
            id: waveId,
            label: (evt.label as string) ?? waveId,
            steps: [],
            status: "running",
          })
          waveOrder.push(waveId)
        }
      } else if (evt.type === "step_start") {
        const waveId = evt.waveId as string
        const wave = waveMap.get(waveId)
        if (wave) {
          wave.steps.push({
            id: evt.stepId as string,
            label: (evt.label as string) ?? (evt.stepId as string),
            progress: 0,
            status: "running",
          })
        }
      } else if (evt.type === "step_progress") {
        const waveId = evt.waveId as string
        const wave = waveMap.get(waveId)
        if (wave) {
          const step = wave.steps.find((s) => s.id === evt.stepId)
          if (step) {
            step.progress = (evt.progress as number) ?? step.progress
          }
        }
      } else if (evt.type === "step_done") {
        const waveId = evt.waveId as string
        const wave = waveMap.get(waveId)
        if (wave) {
          const step = wave.steps.find((s) => s.id === evt.stepId)
          if (step) {
            step.status = "done"
            step.progress = 100
          }
        }
      } else if (evt.type === "wave_done") {
        const waveId = evt.waveId as string
        const wave = waveMap.get(waveId)
        if (wave) {
          wave.status = "done"
        }
      }
    }

    return waveOrder.map((id) => waveMap.get(id)!)
  }, [events])

  const hasMissionDone = events.some((e) => e.type === "mission_done")
  const hasHumanApproval = events.some((e) => e.type === "HumanApprovalRequired")

  const banner = statusBanner(status)

  return (
    <div
      className="flex flex-col h-full"
      style={{
        backgroundColor: "var(--background-menu-white)",
        borderLeft: "1px solid var(--border-main)",
        width: "20rem",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ borderBottom: "1px solid var(--border-main)" }}
      >
        <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          Missão {missionId}
        </span>
        <button
          onClick={onClose}
          className="text-sm px-2 py-1 rounded transition-colors"
          style={{ color: "var(--text-secondary)" }}
          aria-label="Fechar"
        >
          ×
        </button>
      </div>

      {/* Status banner */}
      <div
        className="px-3 py-2 text-xs font-medium"
        style={{ color: banner.color, backgroundColor: banner.bg }}
      >
        {banner.text}
      </div>

      {/* Human approval banner */}
      {hasHumanApproval && (
        <div
          className="px-3 py-2 text-xs"
          style={{
            backgroundColor: "rgba(251,146,60,0.10)",
            color: "rgb(234,88,12)",
            borderBottom: "1px solid rgba(251,146,60,0.20)",
          }}
        >
          ⚠️ Aprovação necessária — aguardando gate humano
        </div>
      )}

      {/* Error detail */}
      {error && (
        <div
          className="px-3 py-2 text-xs"
          style={{ color: "rgb(239,68,68)", backgroundColor: "rgba(239,68,68,0.06)" }}
        >
          {error}
        </div>
      )}

      {/* Wave cards */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 px-3 py-3">
        {waves.map((wave) => (
          <WaveProgressCard
            key={wave.id}
            waveId={wave.id}
            label={wave.label}
            steps={wave.steps}
            status={wave.status}
          />
        ))}

        {/* Mission done banner */}
        {hasMissionDone && (
          <div
            className="px-3 py-2 rounded-xl text-sm text-center font-medium"
            style={{
              backgroundColor: "rgba(16,185,129,0.10)",
              color: "rgb(16,185,129)",
              border: "1px solid rgba(16,185,129,0.25)",
            }}
          >
            ✓ Missão concluída com sucesso
          </div>
        )}
      </div>
    </div>
  )
}
