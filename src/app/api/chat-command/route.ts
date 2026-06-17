// src/app/api/chat-command/route.ts
// Porta única do CALM. Recebe mensagem, orquestra, executa tool se preciso, responde.
import { NextRequest, NextResponse } from 'next/server'
import { orchestrate } from '@/lib/calm/chat-orchestrator'
import { getTool } from '@/lib/calm/tool-registry'
import type { ChatCommandRequest, ChatCommandResponse } from '@/types/calm'

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ChatCommandRequest
  const decision = orchestrate(body)

  // Casos que a própria route resolve chamando o tool:
  if (decision.kind === 'tool_result' && decision.intent.tool) {
    const tool = getTool(decision.intent.tool)
    if (tool) {
      try {
        const base = req.nextUrl.origin
        let url = `${base}${tool.endpoint}`
        let fetchOpts: RequestInit = { method: tool.method }

        if (tool.method === 'GET' && decision.intent.extracted_query) {
          url += `?q=${encodeURIComponent(decision.intent.extracted_query)}`
        } else if (tool.method === 'POST') {
          fetchOpts = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: body.message }),
          }
        }

        const res = await fetch(url, fetchOpts)
        const data = await res.json().catch(() => null)
        const out: ChatCommandResponse = { ...decision, tool_result: data }
        return NextResponse.json(out)
      } catch (err) {
        return NextResponse.json({
          kind: 'error',
          intent: decision.intent,
          error: err instanceof Error ? err.message : 'Falha ao chamar ferramenta',
        } as ChatCommandResponse)
      }
    }
  }

  // assistant_text, mission_launch, clarification → frontend resolve
  return NextResponse.json(decision)
}
