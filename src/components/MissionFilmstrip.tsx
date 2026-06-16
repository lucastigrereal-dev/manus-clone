"use client"

import { useState } from "react"
import { format } from "date-fns"

interface FilmstripFrame {
  ts: string
  label: string
  type: string
}

interface Props {
  frames: FilmstripFrame[]
  title?: string
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
    case "HumanApprovalRequired":
      return "rgb(217,119,6)" // amber
    default:
      return "rgb(113,113,122)" // zinc
  }
}

function formatTime(ts: string): string {
  try {
    return format(new Date(ts), "HH:mm:ss")
  } catch {
    return ts
  }
}

function formatFull(ts: string): string {
  try {
    return format(new Date(ts), "dd/MM/yyyy HH:mm:ss")
  } catch {
    return ts
  }
}

export default function MissionFilmstrip({ frames, title }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const selected = selectedIndex !== null ? frames[selectedIndex] : null
  const color = selected ? dotColor(selected.type) : "rgb(59,130,246)"

  return (
    <div className="flex flex-col gap-2">
      {title && (
        <span className="text-xs font-semibold px-1" style={{ color: "var(--text-primary)" }}>
          {title}
        </span>
      )}

      {frames.length === 0 ? (
        <div
          className="px-3 py-4 rounded-xl text-center text-xs"
          style={{
            color: "var(--text-tertiary)",
            border: "1px solid var(--border-main)",
            backgroundColor: "var(--background-gray-main)",
          }}
        >
          Nenhum frame disponível
        </div>
      ) : (
        <>
          {/* Horizontal scrubber */}
          <div
            className="overflow-x-auto rounded-xl"
            style={{
              border: "1px solid var(--border-main)",
              backgroundColor: "var(--background-gray-main)",
              paddingTop: "8px",
              paddingBottom: "8px",
            }}
          >
            <div className="flex items-center gap-0" style={{ minWidth: "max-content", paddingLeft: "8px", paddingRight: "8px" }}>
              {frames.map((frame, idx) => {
                const isSelected = selectedIndex === idx
                const color = dotColor(frame.type)
                const isLast = idx === frames.length - 1

                return (
                  <div key={idx} className="flex items-center gap-0">
                    {/* Frame cell */}
                    <button
                      onClick={() => setSelectedIndex(isSelected ? null : idx)}
                      className="w-24 flex-shrink-0 flex flex-col items-center gap-1 cursor-pointer p-1 rounded-lg transition-colors"
                      style={{
                        transform: isSelected ? "scale(1.10)" : "scale(1)",
                        transition: "transform 150ms, border-color 150ms",
                        border: isSelected ? `1px solid ${color}` : "1px solid transparent",
                        backgroundColor: isSelected ? `${color}12` : "transparent",
                      }}
                    >
                      {/* Dot */}
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      {/* Time label */}
                      <span
                        className="font-mono"
                        style={{ fontSize: "10px", color: "var(--text-tertiary)" }}
                      >
                        {formatTime(frame.ts)}
                      </span>
                      {/* Event label */}
                      <span
                        className="text-center"
                        style={{
                          fontSize: "10px",
                          color: "var(--text-secondary)",
                          maxWidth: "88px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={frame.label}
                      >
                        {frame.label.length > 12 ? frame.label.slice(0, 12) + "…" : frame.label}
                      </span>
                    </button>

                    {/* Connector line between frames */}
                    {!isLast && (
                      <div
                        className="flex-shrink-0"
                        style={{
                          width: "16px",
                          borderTop: "2px dashed var(--border-main)",
                          alignSelf: "flex-start",
                          marginTop: "13px",
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Detail panel */}
          {selected && (
            <div
              className="rounded-xl px-3 py-2.5 flex flex-col gap-1.5"
              style={{
                border: `1px solid ${color}40`,
                backgroundColor: `${color}0a`,
              }}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-xs font-mono"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {formatFull(selected.ts)}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    fontFamily: "monospace",
                    color,
                    backgroundColor: `${color}18`,
                    border: `1px solid ${color}40`,
                    borderRadius: "4px",
                    padding: "1px 5px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selected.type}
                </span>
              </div>
              <p className="text-xs leading-snug" style={{ color: "var(--text-primary)" }}>
                {selected.label}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
