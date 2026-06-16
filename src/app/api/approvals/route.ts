import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch('http://localhost:8765/kratos/live/approvals', {
      signal: AbortSignal.timeout(3000),
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return NextResponse.json({ items: [], count: 0 })

    const data = await res.json()
    const raw: any[] = Array.isArray(data) ? data : (data?.queue ?? data?.approvals ?? [])
    const pending = raw.filter((i: any) => !i?.status || i?.status === 'pending')

    const items = pending.map((i: any) => ({
      approvalId: i.item_id ?? i.approval_id ?? i.id ?? 'unknown',
      summary: i.gate_reason ?? i.action ?? i.tool_name ?? 'Aprovação necessária',
      risk_level: i.risk_tier ?? i.risk_level ?? 'R1',
      mission_id: i.mission_id ?? null,
      created_at: i.created_at ?? new Date().toISOString(),
    }))

    return NextResponse.json({ items, count: items.length })
  } catch {
    return NextResponse.json({ items: [], count: 0 })
  }
}
