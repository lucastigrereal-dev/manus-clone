import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export type MissionEvent = { type: string; [key: string]: unknown }

// ⚠️ DEMO-ONLY. O Core canônico (src/first_missions/event_emitter.py) emite
// apenas eventos de CICLO DE VIDA (started|completed|failed|dry_run) com payload
// aninhado em `data` e campo de risco `risk_tier`. Os tipos wave_*/step_* abaixo
// NÃO existem no Core hoje — a granularidade de waves/steps/agentes (EVO-022..025)
// é UI à frente do backend. Campos em snake_case canônico (risk_tier, payload em
// `data`) para que o normalizador (src/lib/missionEvents.ts) leia mock e Core igual.
const MOCK_EVENTS: MissionEvent[] = [
  { type: 'wave_start', event_id: 'mev_demo01', data: { wave_id: 'w1', label: 'Research' } },
  { type: 'step_start', event_id: 'mev_demo02', data: { step_id: 's1', label: 'Fetching data', wave_id: 'w1', agent: 'hermes' } },
  { type: 'step_progress', event_id: 'mev_demo03', data: { step_id: 's1', progress: 50, wave_id: 'w1' } },
  { type: 'step_done', event_id: 'mev_demo04', data: { step_id: 's1', wave_id: 'w1', agent: 'hermes' } },
  { type: 'step_start', event_id: 'mev_demo05', data: { step_id: 's2', label: 'Indexing sources', wave_id: 'w1', agent: 'hermes' } },
  { type: 'step_done', event_id: 'mev_demo06', data: { step_id: 's2', wave_id: 'w1', agent: 'hermes' } },
  { type: 'wave_done', event_id: 'mev_demo07', data: { wave_id: 'w1', label: 'Research' } },
  { type: 'HumanApprovalRequired', event_id: 'mev_demo08', data: { approval_id: 'apr_MOCK001', summary: 'Publicar conteúdo em 3 contas Instagram', risk_tier: 'R2' } },
  { type: 'wave_start', event_id: 'mev_demo09', data: { wave_id: 'w2', label: 'Analysis' } },
  { type: 'step_start', event_id: 'mev_demo10', data: { step_id: 's3', label: 'Processing results', wave_id: 'w2', agent: 'muse' } },
  { type: 'step_done', event_id: 'mev_demo11', data: { step_id: 's3', wave_id: 'w2', agent: 'muse' } },
  { type: 'step_start', event_id: 'mev_demo12', data: { step_id: 's4', label: 'Generating report', wave_id: 'w2', agent: 'muse' } },
  { type: 'step_done', event_id: 'mev_demo13', data: { step_id: 's4', wave_id: 'w2', agent: 'muse' } },
  { type: 'wave_done', event_id: 'mev_demo14', data: { wave_id: 'w2', label: 'Analysis' } },
]

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const encoder = new TextEncoder()
  let backendConnected = false

  const stream = new ReadableStream({
    async start(controller) {
      // Try to connect to backend
      try {
        const res = await fetch(`http://localhost:8765/missions/${id}/stream`, {
          signal: AbortSignal.timeout(3000),
          headers: { Accept: 'text/event-stream' },
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
        // backend unreachable — fall through to mock
      }

      if (!backendConnected) {
        // Emit mock events with 500ms delay
        for (const evt of MOCK_EVENTS) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(evt)}\n\n`))
          await new Promise<void>((r) => setTimeout(r, 500))
        }
        // Emit mission_done
        const doneEvt: MissionEvent = {
          type: 'mission_done',
          event_id: 'mev_demo15',
          data: { mission_id: id, summary: 'Missão concluída com sucesso' },
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(doneEvt)}\n\n`))
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
