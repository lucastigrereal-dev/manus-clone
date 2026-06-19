import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface FactoryDecideBody {
  decision: 'approve' | 'reject'
  notes?: string
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ action_id: string }> }
) {
  const { action_id } = await params
  let body: FactoryDecideBody

  try {
    body = (await req.json()) as FactoryDecideBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Proxy to OMNIS Core factory endpoint
  try {
    const res = await fetch(
      `http://localhost:8766/factory/publish/${action_id}/decide`,
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
      action_id,
      message: 'Decisão registrada (mock)',
    },
    { status: 200 }
  )
}
