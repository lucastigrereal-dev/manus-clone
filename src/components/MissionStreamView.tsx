"use client"

import { useEffect, useMemo, useState } from "react"
import { useMissionStream } from "@/hooks/useMissionStream"
import { normalizeEvent } from "@/lib/missionEvents"
import WaveProgressCard from "@/components/WaveProgressCard"
import AgentLane from "@/components/AgentLane"
import RollbackButton from "@/components/RollbackButton"
import MissionReplayTimeline from "@/components/MissionReplayTimeline"
import MissionFilmstrip from "@/components/MissionFilmstrip"
import FailureRecoveryCard from "@/components/FailureRecoveryCard"
import { useUiStore } from "@/stores/uiStore"

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

interface AgentStepState {
  id: string
  label: string
  status: "running" | "done" | "pending" | "error"
}

interface AgentState {
  name: string
  steps: AgentStepState[]
  isActive: boolean
}

interface PendingApproval {
  approvalId: string
  summary: string
  riskLevel: string
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

function riskBadgeStyle(riskLevel: string): React.CSSProperties {
  if (riskLevel === "R3" || riskLevel === "R4") {
    return { backgroundColor: "rgba(239,68,68,0.15)", color: "rgb(239,68,68)", border: "1px solid rgba(239,68,68,0.30)" }
  }
  if (riskLevel === "R2") {
    return { backgroundColor: "rgba(251,146,60,0.15)", color: "rgb(234,88,12)", border: "1px solid rgba(251,146,60,0.30)" }
  }
  return { backgroundColor: "rgba(107,114,128,0.12)", color: "rgb(107,114,128)", border: "1px solid rgba(107,114,128,0.20)" }
}

export default function MissionStreamView({ missionId, onClose }: Props) {
  const { events, status, error } = useMissionStream(missionId)
  // Normaliza no boundary: tolera o shape canônico do Core (risk_tier, nested
  // `data`, event_type lifecycle) E o shape sintético do mock. Ver src/lib/missionEvents.ts
  const norm = useMemo(() => events.map(normalizeEvent), [events])
  const addToast = useUiStore((s) => s.addToast)
  const [agentsExpanded, setAgentsExpanded] = useState(false)
  const [approvalLoading, setApprovalLoading] = useState(false)
  const [dismissedApprovals, setDismissedApprovals] = useState<Set<string>>(new Set())
  const [showReplay, setShowReplay] = useState(false)
  const [replayFrames, setReplayFrames] = useState<Array<{ ts: string; label: string; type: string }>>([])
  const [replayLoading, setReplayLoading] = useState(false)

  // Fetch replay frames when replay panel is opened
  useEffect(() => {
    if (!showReplay || replayFrames.length > 0 || replayLoading) return
    let cancelled = false
    setReplayLoading(true)
    fetch(`/api/missions/${missionId}/replay`)
      .then((r) => r.json())
      .then((data: Array<{ ts: string; label: string; type: string }>) => {
        if (!cancelled) setReplayFrames(data)
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setReplayLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [showReplay, missionId, replayFrames.length, replayLoading])

  // Derive wave state from events
  const waves = useMemo<WaveState[]>(() => {
    const waveMap = new Map<string, WaveState>()
    const waveOrder: string[] = []

    for (const evt of norm) {
      if (evt.type === "wave_start") {
        const waveId = evt.waveId
        if (waveId && !waveMap.has(waveId)) {
          waveMap.set(waveId, {
            id: waveId,
            label: evt.label ?? waveId,
            steps: [],
            status: "running",
          })
          waveOrder.push(waveId)
        }
      } else if (evt.type === "step_start") {
        const wave = evt.waveId ? waveMap.get(evt.waveId) : undefined
        if (wave && evt.stepId) {
          wave.steps.push({
            id: evt.stepId,
            label: evt.label ?? evt.stepId,
            progress: 0,
            status: "running",
          })
        }
      } else if (evt.type === "step_progress") {
        const wave = evt.waveId ? waveMap.get(evt.waveId) : undefined
        if (wave) {
          const step = wave.steps.find((s) => s.id === evt.stepId)
          if (step && evt.progress != null) {
            step.progress = evt.progress
          }
        }
      } else if (evt.type === "step_done") {
        const wave = evt.waveId ? waveMap.get(evt.waveId) : undefined
        if (wave) {
          const step = wave.steps.find((s) => s.id === evt.stepId)
          if (step) {
            step.status = "done"
            step.progress = 100
          }
        }
      } else if (evt.type === "wave_done") {
        const wave = evt.waveId ? waveMap.get(evt.waveId) : undefined
        if (wave) {
          wave.status = "done"
        }
      }
    }

    return waveOrder.map((id) => waveMap.get(id)!)
  }, [norm])

  // Derive agent lanes from events
  const agentLanes = useMemo<AgentState[]>(() => {
    const agentMap = new Map<string, AgentState>()
    const agentOrder: string[] = []

    for (const evt of norm) {
      const agentName = evt.agent
      if (!agentName) continue

      if (!agentMap.has(agentName)) {
        agentMap.set(agentName, { name: agentName, steps: [], isActive: false })
        agentOrder.push(agentName)
      }

      const agentState = agentMap.get(agentName)!

      if (evt.type === "step_start" && evt.stepId) {
        agentState.steps.push({
          id: evt.stepId,
          label: evt.label ?? evt.stepId,
          status: "running",
        })
        agentState.isActive = true
      } else if (evt.type === "step_done") {
        const step = agentState.steps.find((s) => s.id === evt.stepId)
        if (step) {
          step.status = "done"
        }
        // isActive = still has running steps
        agentState.isActive = agentState.steps.some((s) => s.status === "running")
      }
    }

    return agentOrder.map((name) => agentMap.get(name)!)
  }, [norm])

  // Derive pending approval from events (most recent undismissed one)
  const pendingApproval = useMemo<PendingApproval | null>(() => {
    for (let i = norm.length - 1; i >= 0; i--) {
      const evt = norm[i]
      // Core canônico: needs_approval (status) / HumanApprovalRequired (sintético)
      if (evt.type === "HumanApprovalRequired" || evt.type === "needs_approval") {
        const approvalId = evt.approvalId ?? evt.missionId ?? `apr_${i}`
        if (!dismissedApprovals.has(approvalId)) {
          return {
            approvalId,
            summary: evt.summary ?? "",
            riskLevel: evt.riskTier ?? "R1",
          }
        }
      }
    }
    return null
  }, [norm, dismissedApprovals])

  // Derive failure class from error events
  const failureClass = useMemo<string | null>(() => {
    for (let i = norm.length - 1; i >= 0; i--) {
      const evt = norm[i]
      // Core canônico: failed → mapeado para mission_error pelo normalizador
      if (
        evt.type === "step_error" ||
        evt.type === "mission_error" ||
        evt.type === "error"
      ) {
        return evt.errorClass ?? "UNKNOWN"
      }
    }
    return null
  }, [norm])

  const hasMissionDone = norm.some((e) => e.type === "mission_done")
  const hasAgents = agentLanes.length > 0

  const banner = statusBanner(status)

  async function handleApprovalDecide(decision: "approve" | "reject" | "modify") {
    if (!pendingApproval || approvalLoading) return
    setApprovalLoading(true)
    try {
      await fetch(`/api/approvals/${pendingApproval.approvalId}/decide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      })
    } finally {
      setApprovalLoading(false)
      setDismissedApprovals((prev) => new Set([...prev, pendingApproval.approvalId]))
    }
  }

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

      {/* Error detail */}
      {error && (
        <div
          className="px-3 py-2 text-xs"
          style={{ color: "rgb(239,68,68)", backgroundColor: "rgba(239,68,68,0.06)" }}
        >
          {error}
        </div>
      )}

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 px-3 py-3">

        {/* ── Inline Approval Panel (EVO-025) ── */}
        {pendingApproval && (
          <div
            className="rounded-xl flex flex-col gap-2"
            style={{
              padding: "10px 12px",
              backgroundColor: "rgba(251,146,60,0.08)",
              border: "1px solid rgba(251,146,60,0.35)",
            }}
          >
            {/* Title */}
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold" style={{ color: "rgb(234,88,12)" }}>
                ⚠️ Gate de Aprovação
              </span>
              <span
                className="text-xs rounded px-1.5 py-0.5 font-medium"
                style={riskBadgeStyle(pendingApproval.riskLevel)}
              >
                {pendingApproval.riskLevel}
              </span>
            </div>

            {/* Summary */}
            <p className="text-xs leading-snug" style={{ color: "var(--text-secondary)" }}>
              {pendingApproval.summary}
            </p>

            {/* Action buttons */}
            <div className="flex gap-1.5 flex-wrap">
              <button
                disabled={approvalLoading}
                onClick={() => handleApprovalDecide("approve")}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-60"
                style={{
                  backgroundColor: "rgba(16,185,129,0.15)",
                  color: "rgb(16,185,129)",
                  border: "1px solid rgba(16,185,129,0.30)",
                }}
              >
                {approvalLoading ? "..." : "Aprovar"}
              </button>
              <button
                disabled={approvalLoading}
                onClick={() => handleApprovalDecide("reject")}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-60"
                style={{
                  backgroundColor: "rgba(239,68,68,0.12)",
                  color: "rgb(239,68,68)",
                  border: "1px solid rgba(239,68,68,0.28)",
                }}
              >
                {approvalLoading ? "..." : "Rejeitar"}
              </button>
              <button
                disabled={approvalLoading}
                onClick={() => handleApprovalDecide("modify")}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-60"
                style={{
                  backgroundColor: "rgba(251,146,60,0.12)",
                  color: "rgb(217,119,6)",
                  border: "1px solid rgba(251,146,60,0.28)",
                }}
              >
                {approvalLoading ? "..." : "Modificar"}
              </button>
            </div>
          </div>
        )}

        {/* ── Replay timeline replaces wave cards area when active ── */}
        {showReplay ? (
          <>
            {/* EVO-039 — Filmstrip scrub header above the detailed timeline */}
            <MissionFilmstrip
              frames={replayFrames}
              title="Filmstrip"
            />
            <MissionReplayTimeline
              missionId={missionId}
              onClose={() => setShowReplay(false)}
              frames={replayFrames}
            />
          </>
        ) : (
          <>
            {/* Wave cards */}
            {waves.map((wave) => (
              <WaveProgressCard
                key={wave.id}
                waveId={wave.id}
                label={wave.label}
                steps={wave.steps}
                status={wave.status}
              />
            ))}

            {/* ── Agent Lanes Section (EVO-024) ── */}
            {hasAgents && (
              <div
                className="rounded-xl flex flex-col"
                style={{
                  border: "1px solid var(--border-main)",
                  backgroundColor: "var(--background-nav)",
                  overflow: "hidden",
                }}
              >
                {/* Collapsible header */}
                <button
                  onClick={() => setAgentsExpanded((v) => !v)}
                  className="flex items-center justify-between px-3 py-2 transition-colors text-left w-full"
                  style={{
                    color: "var(--text-secondary)",
                    borderBottom: agentsExpanded ? "1px solid var(--border-main)" : "none",
                  }}
                >
                  <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                    Agentes
                    <span
                      className="ml-1.5 text-xs rounded-full px-1.5 py-0.5"
                      style={{
                        backgroundColor: "rgba(107,114,128,0.15)",
                        color: "var(--text-tertiary)",
                      }}
                    >
                      {agentLanes.length}
                    </span>
                  </span>
                  <svg
                    width={14}
                    height={14}
                    viewBox="0 0 14 14"
                    fill="none"
                    style={{
                      transform: agentsExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 150ms",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    <path
                      d="M3 5l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Agent lanes */}
                {agentsExpanded && (
                  <div className="flex flex-col gap-1.5 p-2">
                    {agentLanes.map((lane) => (
                      <AgentLane
                        key={lane.name}
                        agent={lane.name}
                        steps={lane.steps}
                        isActive={lane.isActive}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Mission done banner + EVO-026/EVO-027 actions */}
            {hasMissionDone && (
              <div
                className="flex flex-col gap-2 px-3 py-2 rounded-xl"
                style={{
                  backgroundColor: "rgba(16,185,129,0.10)",
                  border: "1px solid rgba(16,185,129,0.25)",
                }}
              >
                <span
                  className="text-sm text-center font-medium"
                  style={{ color: "rgb(16,185,129)" }}
                >
                  ✓ Missão concluída com sucesso
                </span>
                <div className="flex gap-2 justify-center flex-wrap">
                  <RollbackButton
                    missionId={missionId}
                    onRolledBack={() => {
                      /* reset handled by parent if needed */
                    }}
                  />
                  <button
                    onClick={() => setShowReplay(true)}
                    className="px-2 py-1 text-xs rounded-lg border transition-colors"
                    style={{
                      border: "1px solid var(--border-main)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    📹 Ver Replay
                  </button>
                </div>
              </div>
            )}

            {/* Error state actions */}
            {status === "error" && !hasMissionDone && (
              <div className="flex flex-col gap-2">
                {failureClass && (
                  <FailureRecoveryCard
                    errorClass={failureClass}
                    missionId={missionId}
                    onAction={(action) => {
                      addToast({
                        kind: "info",
                        message: `Ação de recuperação: ${action} (${failureClass})`,
                      })
                    }}
                  />
                )}
                <div className="flex gap-2 justify-center flex-wrap">
                  <RollbackButton
                    missionId={missionId}
                    onRolledBack={() => {
                      /* reset handled by parent if needed */
                    }}
                  />
                  <button
                    onClick={() => setShowReplay(true)}
                    className="px-2 py-1 text-xs rounded-lg border transition-colors"
                    style={{
                      border: "1px solid var(--border-main)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    📹 Ver Replay
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
