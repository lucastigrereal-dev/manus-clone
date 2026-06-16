"use client"

import { useState, useMemo } from "react"
import type { MissionEvent } from "@/hooks/useMissionStream"

interface Props {
  missionId: string
  events: MissionEvent[]
}

type Tab = "steps" | "logs" | "artifacts"

interface StepRow {
  stepId: string
  label: string
  agent?: string
  status: "running" | "done" | "error"
}

function formatStepStatus(status: "running" | "done" | "error"): string {
  if (status === "running") return "⏳"
  if (status === "done") return "✓"
  return "✗"
}

function formatStepStatusColor(status: "running" | "done" | "error"): string {
  if (status === "running") return "rgb(217,119,6)"
  if (status === "done") return "rgb(16,185,129)"
  return "rgb(239,68,68)"
}

export default function ExecutionSidecar({ missionId, events }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("steps")
  const [collapsed, setCollapsed] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // Derive steps from events — deduplicate by stepId, latest status wins
  const steps = useMemo<StepRow[]>(() => {
    const stepMap = new Map<string, StepRow>()
    const stepOrder: string[] = []

    for (const evt of events) {
      if (evt.type === "step_start") {
        const stepId = evt.stepId as string
        if (!stepMap.has(stepId)) {
          stepOrder.push(stepId)
        }
        stepMap.set(stepId, {
          stepId,
          label: (evt.label as string) ?? stepId,
          agent: evt.agent as string | undefined,
          status: "running",
        })
      } else if (evt.type === "step_done") {
        const stepId = evt.stepId as string
        const existing = stepMap.get(stepId)
        if (existing) {
          stepMap.set(stepId, { ...existing, status: "done" })
        } else {
          stepOrder.push(stepId)
          stepMap.set(stepId, {
            stepId,
            label: stepId,
            status: "done",
          })
        }
      } else if (
        evt.type === "step_error" ||
        (evt.type === "error" && (evt.stepId as string | undefined))
      ) {
        const stepId = evt.stepId as string
        if (stepId) {
          const existing = stepMap.get(stepId)
          if (existing) {
            stepMap.set(stepId, { ...existing, status: "error" })
          } else {
            stepOrder.push(stepId)
            stepMap.set(stepId, {
              stepId,
              label: stepId,
              status: "error",
            })
          }
        }
      }
    }

    return stepOrder.map((id) => stepMap.get(id)!)
  }, [events])

  if (dismissed || !missionId) return null

  const height = collapsed ? "3rem" : "12rem"

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 flex flex-col"
      style={{
        height,
        backgroundColor: "var(--background-menu-white)",
        borderTop: "1px solid var(--border-main)",
        boxShadow: "0 -4px 12px rgba(0,0,0,0.08)",
        transition: "height 200ms ease",
      }}
    >
      {/* Drag handle / header row */}
      <div
        className="flex items-center justify-between px-4 shrink-0"
        style={{
          height: "3rem",
          borderBottom: collapsed ? "none" : "1px solid var(--border-main)",
        }}
      >
        {/* Left: drag lines icon + mission label */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-0.5 opacity-40" aria-hidden>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 16,
                  height: 2,
                  borderRadius: 1,
                  backgroundColor: "var(--text-tertiary)",
                }}
              />
            ))}
          </div>
          <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
            Sidecar — Missão {missionId}
          </span>
          <span
            className="text-xs rounded-full px-1.5 py-0.5"
            style={{
              backgroundColor: "rgba(107,114,128,0.12)",
              color: "var(--text-tertiary)",
            }}
          >
            {steps.length} steps
          </span>
        </div>

        {/* Right: tab pills (only when expanded) + collapse + close */}
        <div className="flex items-center gap-1">
          {!collapsed && (
            <div className="flex items-center gap-0.5 mr-2">
              {(["steps", "logs", "artifacts"] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-2 py-1 rounded text-xs capitalize transition-colors"
                  style={{
                    backgroundColor:
                      activeTab === tab ? "var(--background-nav)" : "transparent",
                    color:
                      activeTab === tab
                        ? "var(--text-primary)"
                        : "var(--text-tertiary)",
                    border:
                      activeTab === tab
                        ? "1px solid var(--border-main)"
                        : "1px solid transparent",
                  }}
                >
                  {tab === "steps" ? "Steps" : tab === "logs" ? "Logs" : "Artifacts"}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="px-2 py-1 rounded text-xs transition-colors"
            style={{ color: "var(--text-tertiary)" }}
            aria-label={collapsed ? "Expandir" : "Minimizar"}
          >
            {collapsed ? "▲" : "▼"}
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="px-2 py-1 rounded text-xs transition-colors"
            style={{ color: "var(--text-tertiary)" }}
            aria-label="Fechar sidecar"
          >
            ×
          </button>
        </div>
      </div>

      {/* Content area */}
      {!collapsed && (
        <div className="flex-1 overflow-hidden">
          {/* Steps tab */}
          {activeTab === "steps" && (
            <div className="h-full overflow-y-auto px-4 py-2 flex flex-col gap-1">
              {steps.length === 0 ? (
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  Nenhum step ainda...
                </p>
              ) : (
                steps.map((step) => (
                  <div
                    key={step.stepId}
                    className="flex items-center gap-2 py-0.5"
                  >
                    <span
                      className="text-xs w-4 shrink-0 text-center font-medium"
                      style={{ color: formatStepStatusColor(step.status) }}
                    >
                      {formatStepStatus(step.status)}
                    </span>
                    <span
                      className="text-xs flex-1 truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {step.label}
                    </span>
                    {step.agent && (
                      <span
                        className="text-xs rounded px-1.5 py-0.5 shrink-0"
                        style={{
                          backgroundColor: "rgba(107,114,128,0.12)",
                          color: "var(--text-tertiary)",
                        }}
                      >
                        {step.agent}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Logs tab */}
          {activeTab === "logs" && (
            <div
              className="h-full overflow-y-auto p-2 font-mono text-xs"
              style={{
                backgroundColor: "rgba(0,0,0,0.03)",
                color: "var(--text-secondary)",
              }}
            >
              {events.length === 0 ? (
                <span style={{ color: "var(--text-tertiary)" }}>Sem eventos ainda...</span>
              ) : (
                events.map((evt, i) => (
                  <div key={i} className="leading-5 truncate">
                    <span style={{ color: "var(--text-tertiary)" }}>[{i}]</span>{" "}
                    <span style={{ color: "var(--text-primary)" }}>{evt.type}</span>{" "}
                    {JSON.stringify(evt)}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Artifacts tab */}
          {activeTab === "artifacts" && (
            <div className="h-full flex flex-col items-center justify-center gap-1">
              <span className="text-2xl">📦</span>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                Nenhum artifact ainda
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
