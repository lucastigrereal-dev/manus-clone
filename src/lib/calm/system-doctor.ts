// src/lib/calm/system-doctor.ts
// O Médico Invisível do OMNIS (Ideias #2, #3, #8, #16, #23, #24, #26)
// Transforma /api/health cru em diagnóstico humano de 3 níveis + clima + gargalo + forecast.
// Mede tudo por trás, fala só quando precisa, e quando fala já vem com próxima ação.

import type {
  SystemHealth,
  ServiceStatus,
  Climate,
  Diagnosis,
  OperationalForecast,
} from '@/types/calm-expansion'
import type { RiskLevel } from '@/types/calm'

// Dependências conhecidas: o que quebra se um serviço cai (Ideia #26)
const DEPENDENCY_MAP: Record<string, string[]> = {
  core: ['chat', 'missions', 'akasha_search', 'kratos_status', 'sse_stream', 'factory'],
  akasha: ['knowledge_search', 'context_injection', 'precedent_memory'],
  redis: ['sse_stream', 'event_bus', 'mission_progress'],
  litellm: ['aurora_chat', 'council_critics', 'all_llm_calls'],
  kratos: ['mission_dashboard', 'approval_queue_visual'],
}

// ─── Clima Operacional (Ideia #8) ──────────────────────────────────────────

export function computeClimate(services: ServiceStatus[]): Climate {
  const down = services.filter((s) => s.status === 'down').length
  const degraded = services.filter((s) => s.status === 'degraded').length
  const slow = services.filter((s) => s.status === 'slow').length

  // Serviço crítico (core/litellm) down → fogo
  const criticalDown = services.some(
    (s) => s.status === 'down' && (s.name === 'core' || s.name === 'litellm')
  )
  if (criticalDown) return 'fogo'
  if (down >= 2) return 'tempestade'
  if (down === 1 || degraded >= 2) return 'chuva'
  if (degraded === 1 || slow >= 2) return 'nuvens'
  return 'sol'
}

// ─── Score de saúde (espelha HealthScorePanel existente) ────────────────────

export function computeScore(services: ServiceStatus[]): number {
  if (services.length === 0) return 0
  const weights: Record<string, number> = { ok: 1, slow: 0.7, degraded: 0.4, down: 0 }
  // core e litellm pesam dobrado
  let total = 0
  let maxTotal = 0
  for (const s of services) {
    const weight = s.name === 'core' || s.name === 'litellm' ? 2 : 1
    total += (weights[s.status] ?? 0) * weight
    maxTotal += weight
  }
  return Math.round((total / maxTotal) * 100)
}

// ─── Radar de Gargalo (Ideia #24) ──────────────────────────────────────────

export function findBottleneck(services: ServiceStatus[]): string | null {
  // Prioridade: serviço crítico down > degraded com mais dependentes
  const criticalDown = services.find(
    (s) => s.status === 'down' && (s.name === 'core' || s.name === 'litellm')
  )
  if (criticalDown) {
    return `${criticalDown.name} offline — bloqueia ${(DEPENDENCY_MAP[criticalDown.name] ?? []).length} funções`
  }

  // Maior número de dependentes entre os degradados/down
  const broken = services.filter((s) => s.status === 'down' || s.status === 'degraded')
  if (broken.length === 0) return null

  broken.sort(
    (a, b) => (DEPENDENCY_MAP[b.name]?.length ?? 0) - (DEPENDENCY_MAP[a.name]?.length ?? 0)
  )
  const worst = broken[0]
  return `${worst.name} ${worst.status}${worst.detail ? ` — ${worst.detail}` : ''}`
}

// ─── Diagnóstico em 3 níveis (Ideias #2, #3, #16) ───────────────────────────

export function diagnose(health: SystemHealth): Diagnosis {
  const broken = health.services.filter((s) => s.status !== 'ok')
  const climateWord: Record<Climate, string> = {
    sol: 'tudo estável',
    nuvens: 'atenção em um ponto',
    chuva: 'degradado',
    tempestade: 'múltiplas falhas',
    fogo: 'crítico',
  }

  // Nível leigo
  let leigo: string
  if (broken.length === 0) {
    leigo = 'Tá tudo funcionando bem. Sistema saudável.'
  } else {
    const names = broken.map((s) => s.name).join(', ')
    leigo = `Tá funcionando, mas ${names} ${broken.length === 1 ? 'está mancando' : 'estão com problema'}.`
  }

  // Nível operacional
  const operacional = broken.length
    ? broken.map((s) => `${s.name}${s.port ? ` :${s.port}` : ''} ${s.status}${s.detail ? ` — ${s.detail}` : ''}`).join('. ')
    : 'Todos os serviços respondendo dentro do esperado.'

  // Perito: hipótese + evidência + causa (Ideia #16)
  const worst = health.bottleneck
  const severity: RiskLevel =
    health.climate === 'fogo' ? 'R3' :
    health.climate === 'tempestade' ? 'R2' :
    health.climate === 'chuva' ? 'R2' :
    health.climate === 'nuvens' ? 'R1' : 'R0'

  // Próxima ação (Ideia #4)
  const nextAction = health.bottleneck
    ? `Resolver: ${health.bottleneck}`
    : 'Sistema saudável — pode executar missões normalmente.'

  return {
    diagnosis_id: '',  // gerado com ulid() no caller
    level_leigo: leigo,
    level_operacional: operacional,
    level_tecnico: { services: health.services, climate: health.climate, score: health.score },
    hypothesis: worst ?? null,
    evidence: broken.map((s) => `${s.name}: ${s.status}${s.detail ? ` (${s.detail})` : ''}`),
    probable_cause: broken.length ? broken[0].detail ?? `${broken[0].name} indisponível` : null,
    next_action: nextAction,
    severity,
    created_at: new Date().toISOString(),
  }
}

// ─── Forecast de Problema (Ideia #23) ───────────────────────────────────────

// Avalia se uma ação vai falhar dado o estado atual do sistema
export function forecastAction(
  action: string,
  requiredServices: string[],
  health: SystemHealth
): OperationalForecast {
  const brokenRequired = health.services.filter(
    (s) => requiredServices.includes(s.name) && s.status !== 'ok'
  )

  let probability = 0
  const based: string[] = []

  for (const s of brokenRequired) {
    if (s.status === 'down') {
      probability += 0.6
      based.push(`${s.name} offline (dependência necessária)`)
    } else if (s.status === 'degraded') {
      probability += 0.35
      based.push(`${s.name} degradado`)
    } else if (s.status === 'slow') {
      probability += 0.15
      based.push(`${s.name} lento`)
    }
  }
  probability = Math.min(probability, 0.95)

  const recommendation = brokenRequired.length
    ? `Corrigir ${brokenRequired.map((s) => s.name).join(', ')} antes de executar.`
    : 'Pode executar — todas as dependências estão saudáveis.'

  return {
    forecast_id: '',  // ulid() no caller
    action,
    failure_probability: Number(probability.toFixed(2)),
    reason: brokenRequired.length
      ? `${brokenRequired.length} dependência(s) com problema`
      : 'Todas as dependências OK',
    recommendation,
    based_on: based,
  }
}

// ─── Mapa de dependências em linguagem natural (Ideia #26) ──────────────────

export function explainDependencies(serviceName: string): string {
  const deps = DEPENDENCY_MAP[serviceName.toLowerCase()]
  if (!deps) return `Não tenho mapa de dependências para "${serviceName}".`
  return `Dependem diretamente de ${serviceName}: ${deps.join(', ')}. Se ${serviceName} cair, essas funções param.`
}
