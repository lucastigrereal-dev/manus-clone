import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [], query: q ?? '', total: 0 })
  }

  const limit = Number(req.nextUrl.searchParams.get('limit') ?? '5')

  try {
    const res = await fetch('http://localhost:8765/akasha/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: q, limit: Math.min(limit, 10), collection: null }),
      signal: AbortSignal.timeout(5000),
    })

    if (!res.ok) {
      return NextResponse.json({ results: [], query: q, total: 0, error: `Backend ${res.status}` })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ results: [], query: q, total: 0, error: 'Backend unreachable' })
  }
}
