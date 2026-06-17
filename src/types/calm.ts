// src/types/calm.ts
// Tipos canônicos do CALM Intent System — Wave 3A schema (snake_case, ULID, risk_level)
export type IntentType =
  | 'chat_normal'
  | 'knowledge_search'   // AKASHA / Caixa
  | 'mission_create'     // criar missão dry-run
  | 'mission_execute'    // executar missão
  | 'system_status'      // health / KRATOS status
  | 'gargalo_query'      // "qual o gargalo?"
  | 'next_action_query'  // "o que precisa de mim?"
  | 'canvas_open'        // "abre mapa mental" (Wave 2)
  | 'clarification'      // ambíguo — perguntar

export type RiskLevel = 'R0' | 'R1' | 'R2' | 'R3' | 'R4'

export interface IntentResult {
  intent: IntentType
  tool: string | null          // chave no Tool Registry
  confidence: number           // 0.0 - 1.0
  risk_level: RiskLevel
  needs_approval: boolean
  extracted_query?: string     // texto relevante extraído
  reasoning?: string           // por que classificou assim
}

export interface ToolDefinition {
  key: string                  // ex: "akasha.search"
  endpoint: string             // ex: "/api/akasha/search"
  method: 'GET' | 'POST'
  risk_level: RiskLevel
  needs_approval: boolean
  produces_stream: boolean
  produces_artifact: boolean
  result_card: string          // qual card renderiza
  description: string
}

export interface ChatCommandRequest {
  message: string
  agent?: string               // aurora | hermes | vulcano | muse
  project_id?: string
  history?: Array<{ role: string; content: string }>
  mode?: 'safe' | 'execute'
}

export interface ChatCommandResponse {
  kind: 'assistant_text' | 'tool_result' | 'approval_required' | 'mission_launch' | 'clarification' | 'error'
  intent: IntentResult
  text?: string                // resposta textual
  tool_result?: unknown        // payload da ferramenta
  mission_text?: string        // se kind === mission_launch, texto pra MissionRunner
  clarification_options?: string[]  // se ambíguo
  error?: string
}
