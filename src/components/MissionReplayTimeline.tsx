"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"

interface ReplayFrame {
  ts: string
  label: string
  type: string
  [key: string]: unknown
}

interface Props {
  missionId: string
  onClose: () => void
  frames?: ReplayFrame[]
}

function dotColor(type: string): string {
  switch (type) {
    case "mission_start":
    case "mission_done":
    case "approval_done":
      return "rgb(16,185,129)" // emerald
    case "wave_start":
    case "wave_done":
      return "rgb(59,130,246)" // blue
    case "step_done":
      return "rgb(156,163,175)" // gray
    case "HumanApprovalRequired":
      return "rgb(217,119,6)" // amber
    default:
      return "rgb(113,113,122)" // zinc
  }
}

function typeBadgeStyle(type: string): React.CSSProperties {
  const color = dotColor(type)
  return {
    backgroundColor: `${color}18`,
    color,
    border: `1px solid ${color}40`,
    borderRadius: "4px",
    padding: "1px 5px",
    fontSize: "10px",
    fontFamily: "monospace",
    whiteSpace: "nowrap" as const,
  }
}

function SkeletonRow() {
  return (
    <div className="flex gap-3 items-start" style={{ minHeight: "2.5rem" }}>
      <div
        style={{
          width: "52px",
          flexShrink: 0,
          height: "12px",
          borderRadius: "4px",
          backgroundColor: "var(--border-main)",
          marginTop: "4px",
          opacity: 0.5,
        }}
      />
      <div
        className="flex flex-col gap-1 flex-1"
        style={{ borderLeft: "2px solid var(--border-main)", paddingLeft: "12px" }}
      >
        <div
          style={{
            width: "60%",
            height: "12px",
            borderRadius: "4px",
            backgroundColor: "var(--border-main)",
            opacity: 0.5,
          }}
        />
        <div
          style={{
            width: "35%",
            height: "10px",
            borderRadius: "4px",
            backgroundColor: "var(--border-main)",
            opacity: 0.35,
          }}
        />
      </div>
    </div>
  )
}

export default function MissionReplayTimeline({ missionId, onClose, frames: framesProp }: Props) {
  const [internalFrames, setInternalFrames] = useState<ReplayFrame[]>([])
  const [loading, setLoading] = useState(framesProp === undefined)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

  // If frames prop provided, skip internal fetch
  useEffect(() => {
    if (framesProp !== undefined) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchReplay() {
      try {
        const res = await fetch(`/api/missions/${missionId}/replay`)
        const data: ReplayFrame[] = await res.json()
        if (!cancelled) {
          setInternalFrames(data)
        }
      } catch {
        // leave frames empty
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchReplay()
    return () => {
      cancelled = true
    }
  }, [missionId, framesProp])

  const frames = framesProp ?? internalFrames

  return (
    <div className="flex flex-col gap-2 px-3 py-3">
      {/* Title row */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Replay da Missão
        </span>
        <button
          onClick={onClose}
          className="text-sm px-2 py-1 rounded transition-colors"
          style={{ color: "var(--text-secondary)" }}
          aria-label="Fechar replay"
        >
          ×
        </button>
      </div>

      {/* Scrollable timeline */}
      <div
        className="overflow-y-auto flex flex-col gap-0"
        style={{ maxHeight: "24rem" }}
      >
        {loading ? (
          <div className="flex flex-col gap-3 py-1">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        ) : frames.length === 0 ? (
          <p className="text-xs py-4 text-center" style={{ color: "var(--text-tertiary)" }}>
            Sem dados de replay disponíveis.
          </p>
        ) : (
          frames.map((frame, idx) => {
            const isSelected = selectedIdx === idx
            const isLast = idx === frames.length - 1
            const color = dotColor(frame.type)
            let timeStr = ""
            try {
              timeStr = format(new Date(frame.ts), "HH:mm:ss")
            } catch {
              timeStr = frame.ts
            }

            return (
              <button
                key={idx}
                onClick={() => setSelectedIdx(isSelected ? null : idx)}
                className="flex gap-3 items-start text-left w-full transition-colors rounded-lg"
                style={{
                  padding: "6px 8px",
                  backgroundColor: isSelected
                    ? "rgba(59,130,246,0.07)"
                    : "transparent",
                  border: isSelected
                    ? "1px solid rgba(59,130,246,0.25)"
                    : "1px solid transparent",
                }}
              >
                {/* Timestamp */}
                <span
                  className="text-xs font-mono flex-shrink-0"
                  style={{
                    color: "var(--text-tertiary)",
                    width: "52px",
                    paddingTop: "2px",
                    lineHeight: 1.4,
                  }}
                >
                  {timeStr}
                </span>

                {/* Dot + line + content */}
                <div
                  className="flex flex-col flex-1"
                  style={{
                    borderLeft: isLast ? "2px solid transparent" : "2px solid var(--border-main)",
                    paddingLeft: "12px",
                    position: "relative",
                  }}
                >
                  {/* Dot */}
                  <div
                    style={{
                      position: "absolute",
                      left: "-6px",
                      top: "4px",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: color,
                      flexShrink: 0,
                      boxShadow: isSelected ? `0 0 0 3px ${color}28` : "none",
                    }}
                  />

                  {/* Label */}
                  <span
                    className="text-xs leading-snug"
                    style={{ color: "var(--text-primary)", paddingBottom: "3px" }}
                  >
                    {frame.label}
                  </span>

                  {/* Type badge */}
                  <span style={typeBadgeStyle(frame.type)}>{frame.type}</span>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
