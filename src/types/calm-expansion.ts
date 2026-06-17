// src/types/calm-expansion.ts
// Tipos do pacote de expansão CALM — espelham calm_canonical_schemas.json
// Wave 3A: snake_case, ULID, risk_level (NUNCA camelCase)

import type { RiskLevel } from './calm'

// ─── Médico do Sistema (Ideias #1, #2, #3, #8, #10, #16, #24) ───────────────

export type Climate = 'sol' | 'nuvens' | 'chuva' | 'tempestade' | 'fogo'

export interface ServiceStatus {
  name: string            // core | akasha | kratos | redis | litellm
  status: 'ok' | 'slow' | 'degraded' | 'down'
  latency_ms: number
  port?: number | null
  detail?: string | null  // causa quando degradado
}

export interface SystemHealth {
  health_id: string
  score: number           // 0-100
  climate: Climate
  services: ServiceStatus[]
  bottleneck?: string | null  // Ideia #24 — o que trava agora
  checked_at: string
}

export interface Diagnosis {
  diagnosis_id: string
  level_leigo: string         // "Tá funcionando, mas o KRATOS está mancando"
  level_operacional?: string  // "Backend :5101 degradado por venv"
  level_tecnico?: Record<string, unknown>  // logs, stacktrace, payload
  hypothesis?: string | null
  evidence?: string[]
  probable_cause?: string | null
  next_action: string
  severity: RiskLevel
  created_at: string
}

// ─── Governança (Ideias #6, #7, #20, #21, #22) ──────────────────────────────

export interface Decision {
  decision_id: string
  title: string
  kind: 'approval' | 'ingestion_choice' | 'mission_modify' | 'conflict_resolution'
  risk_level: RiskLevel
  status: 'pending' | 'decided' | 'expired'
  mission_id?: string | null
  options?: string[]
  blocking: boolean       // se true → entra em "o que precisa de mim"
  created_at: string
}

export type RiskSignalLevel = 'sussurro' | 'aviso' | 'alerta' | 'bloqueio'

export interface RiskSignal {
  signal_id: string
  level: RiskSignalLevel  // hierarquia de interrupção
  tier: RiskLevel
  reason: string
  factors?: string[]      // arquivos_sensiveis, comandos, apis_externas...
  mission_id?: string | null
  raised_at: string
}

// ─── Forecast + Caixa Preta (Ideias #15, #23) ───────────────────────────────

export interface OperationalForecast {
  forecast_id: string
  action: string
  failure_probability: number  // 0-1
  reason: string
  recommendation: string
  based_on?: string[]
}

export interface BlackBoxRun {
  blackbox_id: string
  run_id: string
  intent_original: string
  plan?: string[]
  tools_called?: string[]
  approvals?: Record<string, unknown>[]
  files_touched?: string[]
  events?: Record<string, unknown>[]
  result: 'success' | 'failure' | 'rejected' | 'cancelled'
  error?: string | null
  lesson_learned?: string | null
  created_at: string
}

// ─── Estado do Usuário (Ideias #17, #18, #19, #30-zen) ──────────────────────

export type FocusMode = 'foco_brutal' | 'visao_geral' | 'execucao' | 'zen' | 'normal'

export interface UserFocusState {
  mode: FocusMode
  open_items: number
  cognitive_limit: number  // default 7 — acima, agrupa
  set_at: string
}

// ─── Canvas (Ideias #31-38) ─────────────────────────────────────────────────

export type CanvasType =
  | 'mindmap'
  | 'kanban'
  | 'calendar'
  | 'doc'
  | 'integration_map'
  | 'automation_flow'
  | 'system_map'
  | 'mission_flow'
  | 'artifact_board'

export interface CanvasNode {
  node_id: string
  label: string
  x: number
  y: number
  kind?: string
  status?: 'ok' | 'degraded' | 'down' | 'not_configured' | null
  meta?: Record<string, unknown>
}

export interface CanvasEdge {
  edge_id: string
  source: string
  target: string
  label?: string | null
  status?: 'ok' | 'degraded' | 'failed' | 'not_configured' | null
}

export interface CanvasArtifact {
  canvas_id: string
  type: CanvasType
  title: string
  mission_id?: string | null
  project_id?: string | null
  nodes: CanvasNode[]
  edges: CanvasEdge[]
  created_from: 'chat' | 'manual'
  status: 'active' | 'archived'
  created_at: string
}
