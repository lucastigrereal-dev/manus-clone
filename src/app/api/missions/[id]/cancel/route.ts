import { NextResponse } from 'next/server'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  let body: Record<string, unknown> = {}
  try {
    body = await req.json()
  } catch {
    // empty body ok
  }

  try {
    const res = await fetch(`http://localhost:8766/missions/${id}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    })

    if (!res.ok) {
      let payload: unknown
      try {
        payload = await res.json()
      } catch {
        payload = { error: `omnis-control respondeu ${res.status}` }
      }
      return NextResponse.json(payload, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'omnis-control indisponível' }, { status: 503 })
  }
}
