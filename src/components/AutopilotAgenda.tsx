"use client"

import { useState } from "react"
import useSWR from "swr"

interface AgendaItem {
  id: string
  time: string
  mission: string
  factory: string
  status: "pending" | "running" | "done"
}

interface AgendaData {
  items: AgendaItem[]
  nextRun: string
  n8nConnected: boolean
}

const FACTORIES = ["Research", "Content", "Report", "App", "SDR", "Analytics"]

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function statusDot(status: AgendaItem["status"]) {
  if (status === "done") {
    return (
      <span
        className="inline-block w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: "rgb(16,185,129)" }}
        title="Concluído"
      />
    )
  }
  if (status === "running") {
    return (
      <span
        className="inline-block w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
        style={{ backgroundColor: "rgb(59,130,246)" }}
        title="Em execução"
      />
    )
  }
  // pending
  return (
    <span
      className="inline-block w-2 h-2 rounded-full flex-shrink-0"
      style={{ backgroundColor: "rgb(217,119,6)" }}
      title="Pendente"
    />
  )
}

export default function AutopilotAgenda() {
  const { data, mutate } = useSWR<AgendaData>("/api/autopilot", fetcher, {
    refreshInterval: 60000,
  })
  const [showForm, setShowForm] = useState(false)
  const [time, setTime] = useState("09:00")
  const [mission, setMission] = useState("")
  const [factory, setFactory] = useState("Research")
  const [submitting, setSubmitting] = useState(false)
  const [open, setOpen] = useState(true)

  const items = data?.items ?? []
  const n8nConnected = data?.n8nConnected ?? false

  async function handleSchedule(e: React.FormEvent) {
    e.preventDefault()
    if (!mission.trim()) return
    setSubmitting(true)
    try {
      await fetch("/api/autopilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ time, mission: mission.trim(), factory }),
      })
      await mutate()
      setShowForm(false)
      setMission("")
      setTime("09:00")
      setFactory("Research")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="rounded-xl mt-4"
      style={{
        backgroundColor: "var(--background-menu-white)",
        border: "1px solid var(--border-main)",
      }}
    >
      {/* Section header — collapsible */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
        style={{ borderBottom: open ? "1px solid var(--border-main)" : "none" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Agenda Autopilot
          </span>
          {/* n8n status */}
          <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: n8nConnected ? "rgb(16,185,129)" : "rgb(156,163,175)" }}
            />
            n8n {n8nConnected ? "conectado" : "desconectado"}
          </span>
        </div>
        <svg
          width={14}
          height={14}
          viewBox="0 0 14 14"
          fill="none"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
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

      {open && (
        <div className="px-4 py-3 flex flex-col gap-3">
          {/* R3 approval gate warning — always shown */}
          <div
            className="flex items-start gap-2 px-3 py-2 rounded-lg text-xs"
            style={{
              backgroundColor: "rgba(251,146,60,0.08)",
              border: "1px solid rgba(251,146,60,0.35)",
              color: "rgb(217,119,6)",
            }}
          >
            ⚠️ Requer aprovação R3 antes da execução real
          </div>

          {/* Agenda items */}
          {items.length === 0 ? (
            <p className="text-xs text-center py-3" style={{ color: "var(--text-tertiary)" }}>
              Nenhum item agendado.
            </p>
          ) : (
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid var(--border-main)" }}
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-3 py-2.5 border-b last:border-b-0"
                  style={{ borderColor: "var(--border-light)" }}
                >
                  {statusDot(item.status)}
                  <span
                    className="text-sm font-semibold w-12 flex-shrink-0"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.time}
                  </span>
                  <span
                    className="flex-1 text-sm truncate"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item.mission}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: "var(--background-gray-main)",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    {item.factory}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Inline form toggle */}
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="text-sm px-3 py-2 rounded-xl transition-colors text-left"
              style={{
                border: "1px dashed var(--border-main)",
                color: "var(--text-tertiary)",
              }}
            >
              + Novo agendamento
            </button>
          ) : (
            <form
              onSubmit={handleSchedule}
              className="flex flex-col gap-2 p-3 rounded-xl"
              style={{ border: "1px solid var(--border-main)", backgroundColor: "var(--background-gray-main)" }}
            >
              <div className="flex gap-2">
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <label className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    Horário
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="text-sm px-2 py-1 rounded-lg"
                    style={{
                      border: "1px solid var(--border-main)",
                      backgroundColor: "var(--background-menu-white)",
                      color: "var(--text-primary)",
                      outline: "none",
                    }}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    Factory
                  </label>
                  <select
                    value={factory}
                    onChange={(e) => setFactory(e.target.value)}
                    className="text-sm px-2 py-1 rounded-lg"
                    style={{
                      border: "1px solid var(--border-main)",
                      backgroundColor: "var(--background-menu-white)",
                      color: "var(--text-primary)",
                      outline: "none",
                    }}
                  >
                    {FACTORIES.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  Missão
                </label>
                <textarea
                  rows={1}
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  placeholder="Descreva a missão..."
                  className="text-sm px-2 py-1.5 rounded-lg resize-none"
                  style={{
                    border: "1px solid var(--border-main)",
                    backgroundColor: "var(--background-menu-white)",
                    color: "var(--text-primary)",
                    outline: "none",
                  }}
                  required
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting || !mission.trim()}
                  className="text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                  style={{
                    backgroundColor: "var(--Button-black)",
                    color: "var(--Button-white)",
                  }}
                >
                  {submitting ? "Agendando..." : "Agendar"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
