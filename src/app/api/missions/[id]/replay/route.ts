import { NextRequest, NextResponse } from "next/server"

const MOCK_FRAMES = [
  { ts: "2026-06-16T10:00:00Z", label: "Missão iniciada", type: "mission_start" },
  { ts: "2026-06-16T10:00:05Z", label: "Wave Research iniciada", type: "wave_start", waveId: "w1" },
  { ts: "2026-06-16T10:00:10Z", label: "Step: Fetching data", type: "step_done", stepId: "s1" },
  { ts: "2026-06-16T10:00:20Z", label: "Wave Research concluída", type: "wave_done", waveId: "w1" },
  { ts: "2026-06-16T10:00:25Z", label: "Gate de aprovação", type: "HumanApprovalRequired" },
  { ts: "2026-06-16T10:00:45Z", label: "Aprovado pelo operador", type: "approval_done" },
  { ts: "2026-06-16T10:01:00Z", label: "Wave Analysis iniciada", type: "wave_start", waveId: "w2" },
  { ts: "2026-06-16T10:01:30Z", label: "Missão concluída", type: "mission_done" },
]

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000)

    const res = await fetch(`http://localhost:8765/missions/${id}/replay`, {
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    const data = await res.json()
    return NextResponse.json(data, { status: 200 })
  } catch {
    // Fallback mock frames
    return NextResponse.json(MOCK_FRAMES, { status: 200 })
  }
}
