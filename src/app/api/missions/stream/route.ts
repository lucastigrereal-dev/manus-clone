import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CORE_STREAM_URL = 'http://localhost:8766/live/stream'

// Mock events — emitidos quando Core está offline.
// Campos canônicos: event_type (snake_case), run_id, data.
function makeMockEvents(run_id: string) {
  return [
    { event_type: 'mission_started', run_id, data: { label: 'Missão iniciada', dry_run: true } },
    { event_type: 'step_start', run_id, data: { step_id: 's1', label: 'Análise do contexto', agent: 'aurora' } },
    { event_type: 'step_progress', run_id, data: { step_id: 's1', progress: 50, agent: 'aurora' } },
    { event_type: 'step_done', run_id, data: { step_id: 's1', agent: 'aurora' } },
    { event_type: 'step_start', run_id, data: { step_id: 's2', label: 'Processando solicitação', agent: 'hermes' } },
    { event_type: 'step_done', run_id, data: { step_id: 's2', agent: 'hermes' } },
    { event_type: 'step_start', run_id, data: { step_id: 's3', label: 'Gerando resultado', agent: 'aurora' } },
    { event_type: 'step_done', run_id, data: { step_id: 's3', agent: 'aurora' } },
    { event_type: 'mission_done', run_id, data: { summary: 'Missão concluída com sucesso (dry_run · Core offline)' } },
  ]
}

export async function GET(req: NextRequest) {
  const run_id = req.nextUrl.searchParams.get('run_id') ?? 'unknown'
  const encoder = new TextEncoder()
  let backendConnected = false

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const url = run_id !== 'unknown'
          ? `${CORE_STREAM_URL}?run_id=${encodeURIComponent(run_id)}`
          : CORE_STREAM_URL

        const res = await fetch(url, {
          headers: { Accept: 'text/event-stream' },
          signal: AbortSignal.timeout(3000),
        })

        if (res.ok && res.body) {
          backendConnected = true
          const reader = res.body.getReader()
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            controller.enqueue(value)
          }
        }
      } catch {
        // Core inacessível — cai no mock
      }

      if (!backendConnected) {
        for (const evt of makeMockEvents(run_id)) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(evt)}\n\n`))
          await new Promise<void>((r) => setTimeout(r, 600))
        }
      }

      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
