"use client"

import { motion } from "framer-motion"

interface Step {
  id: string
  label: string
  progress: number
  status: "pending" | "running" | "done" | "error"
}

interface WaveProgressCardProps {
  waveId: string
  label: string
  steps: Step[]
  status: "pending" | "running" | "done"
}

function StatusIcon({ status }: { status: "pending" | "running" | "done" }) {
  if (status === "running") {
    return (
      <span
        className="animate-spin inline-block w-4 h-4 rounded-full border-2"
        style={{
          borderColor: "rgba(217,119,6,0.3)",
          borderTopColor: "rgb(217,119,6)",
        }}
      />
    )
  }
  if (status === "done") {
    return (
      <span style={{ color: "rgb(16,185,129)", fontSize: "1rem", lineHeight: 1 }}>
        ✓
      </span>
    )
  }
  return (
    <span style={{ color: "var(--text-disable)", fontSize: "0.85rem", lineHeight: 1 }}>
      ○
    </span>
  )
}

function stepColor(status: Step["status"]): string {
  if (status === "running") return "rgb(217,119,6)"
  if (status === "done") return "rgb(16,185,129)"
  if (status === "error") return "rgb(239,68,68)"
  return "var(--text-disable)"
}

function cardBorderColor(status: WaveProgressCardProps["status"]): string {
  if (status === "running") return "rgba(217,119,6,0.30)"
  if (status === "done") return "rgba(16,185,129,0.30)"
  return "var(--border-main)"
}

export default function WaveProgressCard({
  label,
  steps,
  status,
}: WaveProgressCardProps) {
  return (
    <div
      className="px-3 py-2 rounded-xl"
      style={{
        border: `1px solid ${cardBorderColor(status)}`,
        backgroundColor: "var(--background-menu-white)",
      }}
    >
      {/* Wave header */}
      <div className="flex items-center gap-2 mb-2">
        <StatusIcon status={status} />
        <span
          className="text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          {label}
        </span>
      </div>

      {/* Steps */}
      {steps.length > 0 && (
        <div className="flex flex-col gap-2 pl-1">
          {steps.map((step) => (
            <div key={step.id}>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  •
                </span>
                <span
                  className="text-xs"
                  style={{ color: stepColor(step.status) }}
                >
                  {step.label}
                </span>
              </div>
              {/* Progress bar */}
              {(step.status === "running" || step.status === "done") && (
                <div
                  className="ml-4 h-1 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--border-light)" }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: stepColor(step.status) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${step.progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
