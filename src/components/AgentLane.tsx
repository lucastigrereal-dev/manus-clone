"use client"

interface AgentStep {
  id: string
  label: string
  status: "running" | "done" | "pending" | "error"
}

interface Props {
  agent: string
  steps: AgentStep[]
  isActive: boolean
}

const AGENT_COLORS: Record<string, { bg: string; border: string; text: string; avatar: string }> = {
  hermes:  { bg: "rgba(59,130,246,0.10)",  border: "rgba(59,130,246,0.70)",  text: "rgb(59,130,246)",  avatar: "rgba(59,130,246,0.20)"  },
  vulcano: { bg: "rgba(249,115,22,0.10)",  border: "rgba(249,115,22,0.70)",  text: "rgb(249,115,22)",  avatar: "rgba(249,115,22,0.20)"  },
  muse:    { bg: "rgba(168,85,247,0.10)",  border: "rgba(168,85,247,0.70)",  text: "rgb(168,85,247)",  avatar: "rgba(168,85,247,0.20)"  },
  aurora:  { bg: "rgba(16,185,129,0.10)",  border: "rgba(16,185,129,0.70)",  text: "rgb(16,185,129)",  avatar: "rgba(16,185,129,0.20)"  },
  default: { bg: "rgba(107,114,128,0.10)", border: "rgba(107,114,128,0.70)", text: "rgb(107,114,128)", avatar: "rgba(107,114,128,0.20)" },
}

function getColors(agent: string) {
  return AGENT_COLORS[agent.toLowerCase()] ?? AGENT_COLORS.default
}

function stepStatusStyle(status: AgentStep["status"], agentText: string): React.CSSProperties {
  switch (status) {
    case "running":
      return { backgroundColor: "rgba(217,119,6,0.15)", color: "rgb(217,119,6)", border: "1px solid rgba(217,119,6,0.30)" }
    case "done":
      return { backgroundColor: "rgba(16,185,129,0.12)", color: "rgb(16,185,129)", border: "1px solid rgba(16,185,129,0.30)" }
    case "error":
      return { backgroundColor: "rgba(239,68,68,0.12)", color: "rgb(239,68,68)", border: "1px solid rgba(239,68,68,0.30)" }
    default:
      return { backgroundColor: "rgba(107,114,128,0.10)", color: "rgb(107,114,128)", border: "1px solid rgba(107,114,128,0.20)" }
  }
}

function StatusDot({ status, color }: { status: AgentStep["status"]; color: string }) {
  const dotColor =
    status === "done"    ? "rgb(16,185,129)"  :
    status === "running" ? "rgb(217,119,6)"   :
    status === "error"   ? "rgb(239,68,68)"   :
    "rgb(107,114,128)"

  return (
    <span
      className={status === "running" ? "animate-pulse" : ""}
      style={{
        display: "inline-block",
        width: 7,
        height: 7,
        borderRadius: "50%",
        backgroundColor: dotColor,
        flexShrink: 0,
      }}
    />
  )
}

export default function AgentLane({ agent, steps, isActive }: Props) {
  const colors = getColors(agent)
  const activeStep = steps.find((s) => s.status === "running")

  return (
    <div
      className="flex items-start gap-2 rounded-lg"
      style={{
        padding: "6px 8px",
        backgroundColor: colors.bg,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Pulsing left border when active */}
      {isActive && (
        <div
          className="animate-pulse"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 2,
            backgroundColor: colors.border,
            borderRadius: "2px 0 0 2px",
          }}
        />
      )}

      {/* Avatar */}
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          backgroundColor: colors.avatar,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 600,
          color: colors.text,
          flexShrink: 0,
          marginLeft: isActive ? 4 : 0,
        }}
      >
        {agent[0]?.toUpperCase() ?? "?"}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        {/* Agent name + status dot */}
        <div className="flex items-center gap-1.5">
          <span
            className="text-xs font-medium"
            style={{ color: colors.text }}
          >
            {agent}
          </span>
          <StatusDot status={activeStep?.status ?? (steps.length > 0 ? "pending" : "pending")} color={colors.text} />
        </div>

        {/* Step badges */}
        {steps.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {steps.map((step) => (
              <span
                key={step.id}
                className="rounded"
                style={{
                  padding: "1px 5px",
                  fontSize: 10,
                  fontWeight: 500,
                  ...stepStatusStyle(step.status, colors.text),
                }}
              >
                {step.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
