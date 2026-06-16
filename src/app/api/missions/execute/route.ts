import { NextRequest, NextResponse } from 'next/server'

const CORE_URL = 'http://localhost:8766/missions/execute'

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {}
  try {
    body = await req.json()
  } catch {
    // empty body ok
  }

  const payload = {
    request_text: (body.request_text as string) ?? '',
    dry_run: true,
  }

  try {
    const res = await fetch(CORE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return NextResponse.json(
        { error: `Core respondeu ${res.status}`, detail: text },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    // Core offline — mock needs_approval so o fluxo pode ser exercitado
    const ts = Date.now()
    return NextResponse.json({
      run_id: `run_mock_${ts}`,
      mission_id: `msn_mock_${ts}`,
      status: 'needs_approval',
      dry_run: true,
      next_action: 'Aguardando aprovação do operador (Core offline)',
      request_text: payload.request_text,
    })
  }
}
