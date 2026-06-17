// src/lib/calm/chat-orchestrator.ts
// O cérebro: recebe mensagem → classifica → decide o que fazer → monta resposta.
// NÃO executa a chamada HTTP em si (isso fica na route). Decide e descreve.
import { classifyIntent } from './intent-router'
import { getTool } from './tool-registry'
import type { ChatCommandRequest, ChatCommandResponse } from '@/types/calm'

export function orchestrate(req: ChatCommandRequest): ChatCommandResponse {
  const intent = classifyIntent(req.message)

  // 1. Conversa normal → responder via Aurora
  if (intent.intent === 'chat_normal') {
    return { kind: 'assistant_text', intent }
  }

  // 2. Canvas (Wave 2 — ainda não implementado) → clarification graciosa
  if (intent.intent === 'canvas_open') {
    return {
      kind: 'clarification',
      intent,
      text: 'O Canvas chega na próxima wave. Por ora, posso buscar, criar missão ou checar status. O que prefere?',
      clarification_options: ['Buscar na Caixa', 'Criar missão', 'Ver status'],
    }
  }

  // 3. Queries especiais (gargalo, next action) → respondidas pelo Core/health
  if (intent.intent === 'gargalo_query' || intent.intent === 'next_action_query') {
    return { kind: 'tool_result', intent, text: 'Consultando estado do sistema…' }
  }

  // 4. Missão → dispara MissionRunner (que já tem SSE + approval)
  if (intent.intent === 'mission_execute' || intent.intent === 'mission_create') {
    return {
      kind: 'mission_launch',
      intent,
      mission_text: req.message,
    }
  }

  // 5. Tool com endpoint (akasha, health) → route executa a chamada
  const tool = intent.tool ? getTool(intent.tool) : null
  if (tool) {
    return { kind: 'tool_result', intent }
  }

  // 6. Fallback
  return { kind: 'assistant_text', intent }
}
