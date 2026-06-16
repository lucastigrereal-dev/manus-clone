import { NextRequest, NextResponse } from "next/server"

const OMNIS_BASE = "http://localhost:8765"
const N8N_BASE = "http://localhost:5678"
const TIMEOUT_MS = 5000

const MOCK_AGENDA = {
  items: [
    {
      id: "ag1",
      time: "09:00",
      mission: "Benchmark hotéis Natal",
      factory: "Research",
      status: "pending",
    },
    {
      id: "ag2",
      time: "11:00",
      mission: "Post Instagram Família Tigre",
      factory: "Content",
      status: "pending",
    },
    {
      id: "ag3",
      time: "15:00",
      mission: "Relatório semanal",
      factory: "Report",
      status: "done",
    },
  ],
  nextRun: "09:00",
  n8nConnected: false,
}

export async function GET() {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

    const res = await fetch(`${OMNIS_BASE}/autopilot/agenda`, {
      signal: controller.signal,
    })
    clearTimeout(timer)

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(MOCK_AGENDA)
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  // Fire-and-forget n8n webhook (ignore errors)
  fetch(`${N8N_BASE}/webhook/omnis-autopilot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => undefined)

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

    const res = await fetch(`${OMNIS_BASE}/autopilot/agenda`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    clearTimeout(timer)

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({
      ok: true,
      id: `ag_${Date.now()}`,
      message: "Agendado (mock)",
    })
  }
}
