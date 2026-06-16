/**
 * Boundary adapter entre o OMNIS Core canônico e o shell.
 *
 * GROUND TRUTH (omnis-control):
 *   - src/contracts/mission_result_schema.py  → campo de risco é `risk_tier` (R0-R3)
 *   - src/first_missions/event_emitter.py      → MissionEvent canônico:
 *       { event_id, event_type, mission_id, mission_name, mission_type,
 *         status, timestamp, data }
 *     event_type de ciclo de vida: started | completed | failed | dry_run | status_change
 *     event_id: `mev_<uuid4 hex8>` (NÃO ULID)
 *
 * ⚠️ Os tipos sintéticos wave_start/step_start/step_progress/step_done/wave_done
 *    NÃO são emitidos pelo Core hoje (o emitter é lifecycle-only). A visualização
 *    de waves/steps/agentes (EVO-022..025) depende de granularidade que o Core
 *    ainda não produz — é UI à frente do backend. Este adapter garante que,
 *    quando o Core real conectar, os eventos de ciclo de vida e os nomes de campo
 *    canônicos (risk_tier, nested data) sejam lidos sem quebrar silenciosamente.
 */

export type RawEvent = Record<string, unknown>

export interface NormalizedEvent {
  type: string
  waveId?: string
  stepId?: string
  label?: string
  progress?: number
  agent?: string
  approvalId?: string
  summary?: string
  riskTier?: string
  missionId?: string
  errorClass?: string
  raw: RawEvent
}

/** Mapeia event_type canônico de ciclo de vida → tipo que a UI entende. */
const LIFECYCLE_MAP: Record<string, string> = {
  started: 'mission_start',
  completed: 'mission_done',
  failed: 'mission_error',
  dry_run: 'mission_start',
  status_change: 'status_change',
}

function str(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined
}

/**
 * Normaliza um evento bruto (canônico do Core OU sintético do mock) numa forma
 * única. Tolerante a:
 *   - payload aninhado em `data` (Core) vs plano (mock)
 *   - snake_case canônico (risk_tier, wave_id, step_id) vs camelCase legado
 *   - chave de tipo `event_type` (Core) vs `type` (mock)
 */
export function normalizeEvent(raw: RawEvent): NormalizedEvent {
  const data =
    raw.data && typeof raw.data === 'object'
      ? (raw.data as Record<string, unknown>)
      : {}
  // top-level vence, mas campos de `data` afloram
  const m: Record<string, unknown> = { ...data, ...raw }

  const rawType = str(raw.type) ?? str(raw.event_type) ?? 'unknown'
  const type = LIFECYCLE_MAP[rawType] ?? rawType

  return {
    type,
    waveId: str(m.wave_id) ?? str(m.waveId),
    stepId: str(m.step_id) ?? str(m.stepId),
    label: str(m.label),
    progress: typeof m.progress === 'number' ? (m.progress as number) : undefined,
    agent: str(m.agent),
    approvalId: str(m.approval_id) ?? str(m.approvalId),
    summary: str(m.summary),
    riskTier: str(m.risk_tier) ?? str(m.riskLevel) ?? str(m.risk_level),
    missionId: str(m.mission_id) ?? str(m.missionId),
    errorClass: str(m.error_class) ?? str(m.errorClass),
    raw: m,
  }
}
