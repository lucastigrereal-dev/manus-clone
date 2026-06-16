import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export type MissionEvent = { type: string; [key: string]: unknown }

const MOCK_EVENTS: MissionEvent[] = [
  { type: 'wave_start', waveId: 'w1', label: 'Research' },
  { type: 'step_start', stepId: 's1', label: 'Fetching data', waveId: 'w1', agent: 'hermes' },
  { type: 'step_progress', stepId: 's1', progress: 50, waveId: 'w1' },
  { type: 'step_done', stepId: 's1', waveId: 'w1', agent: 'hermes' },
  { type: 'step_start', stepId: 's2', label: 'Indexing sources', waveId: 'w1', agent: 'hermes' },
  { type: 'step_done', stepId: 's2', waveId: 'w1', agent: 'hermes' },
  { type: 'wave_done', waveId: 'w1', label: 'Research' },
  { type: 'HumanApprovalRequired', approvalId: 'apr_MOCK001', summary: 'Publicar conteúdo em 3 contas Instagram', riskLevel: 'R2' },
  { type: 'wave_start', waveId: 'w2', label: 'Analysis' },
  { type: 'step_start', stepId: 's3', label: 'Processing results', waveId: 'w2', agent: 'muse' },
  { type: 'step_done', stepId: 's3', waveId: 'w2', agent: 'muse' },
  { type: 'step_start', stepId: 's4', label: 'Generating report', waveId: 'w2', agent: 'muse' },
  { type: 'step_done', stepId: 's4', waveId: 'w2', agent: 'muse' },
  { type: 'wave_done', waveId: 'w2', label: 'Analysis' },
]

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
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
          missionId: id,
          summary: 'Missão concluída com sucesso',
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
