import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface DecideBody {
  decision: 'approve' | 'reject' | 'modify'
  notes?: string
  modifiedPayload?: unknown
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  let body: DecideBody

  try {
    body = (await req.json()) as DecideBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Proxy to OMNIS backend
  try {
    const res = await fetch(
      `http://localhost:8765/kratos/live/approvals/${id}/decide`,
      {
        method: 'POST',
        signal: AbortSignal.timeout(6000),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    )

    if (res.ok) {
      const data: unknown = await res.json()
      return NextResponse.json(data, { status: 200 })
    }
  } catch {
    // backend unreachable — fall through to mock
  }

  // Fallback mock response
  return NextResponse.json(
    {
      ok: true,
      decision: body.decision,
      missionId: id,
      message: 'Decisão registrada (mock)',
    },
    { status: 200 }
  )
}
