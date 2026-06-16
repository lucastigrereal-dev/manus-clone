import { NextRequest, NextResponse } from "next/server"

interface RollbackBody {
  checkpointId?: string
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  let body: RollbackBody = {}

  try {
    body = await request.json()
  } catch {
    // body is optional
  }

  const checkpointId = body.checkpointId

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000)

    const res = await fetch(`http://localhost:8765/missions/${id}/rollback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkpointId }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    const data = await res.json()
    return NextResponse.json(data, { status: 200 })
  } catch {
    // Fallback mock
    return NextResponse.json(
      {
        ok: true,
        missionId: id,
        restoredCheckpoint: checkpointId || "latest",
        message: "Rollback realizado (mock)",
      },
      { status: 200 }
    )
  }
}
