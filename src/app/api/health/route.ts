import { NextResponse } from 'next/server'

export interface ServiceHealth {
  name: string
  status: 'ok' | 'slow' | 'offline'
  latencyMs: number
  port: number
}

export interface HealthResponse {
  services: ServiceHealth[]
  score: number
  timestamp: string
}

function computeScore(services: ServiceHealth[]): number {
  if (!services.length) return 0
  const weights: Record<string, number> = {
    'OMNIS Core': 40,
    'AKASHA': 30,
    'LiteLLM': 20,
    'Redis': 10,
  }
  let score = 0
  for (const s of services) {
    const w = weights[s.name] ?? 10
    if (s.status === 'ok') score += w
    else if (s.status === 'slow') score += Math.round(w * 0.5)
    // offline = 0
  }
  return Math.min(100, score)
}

const FALLBACK: HealthResponse = {
  services: [
    { name: 'OMNIS Core', status: 'offline', latencyMs: 0, port: 8765 },
    { name: 'AKASHA',     status: 'offline', latencyMs: 0, port: 5432 },
    { name: 'LiteLLM',   status: 'offline', latencyMs: 0, port: 4001 },
    { name: 'Redis',      status: 'offline', latencyMs: 0, port: 6379 },
  ],
  score: 0,
  timestamp: new Date().toISOString(),
}

function classify(ms: number): ServiceHealth['status'] {
  if (ms <= 0) return 'offline'
  if (ms < 100) return 'ok'
  if (ms < 500) return 'slow'
  return 'offline'
}

function mapRedisStatus(s: string): ServiceHealth['status'] {
  if (s === 'ok') return 'ok'
  if (s === 'degraded') return 'slow'
  return 'offline' // 'down', 'unknown', missing, etc.
}

export async function GET() {
  const start = Date.now()
  try {
    const [coreResult, controlResult] = await Promise.allSettled([
      fetch('http://localhost:8765/health', {
        signal: AbortSignal.timeout(3000),
        headers: { Accept: 'application/json' },
      }),
      fetch('http://localhost:8766/health', {
        signal: AbortSignal.timeout(3000),
        headers: { Accept: 'application/json' },
      }),
    ])

    const latencyMs = Date.now() - start

    // Redis (8766) — parse regardless of core status
    const controlData = controlResult.status === 'fulfilled' && controlResult.value.ok
      ? await controlResult.value.json().catch(() => null)
      : null
    const redisRaw = controlData?.checks?.redis?.status ?? 'unknown'
    const redisLatency: number = controlData?.checks?.redis?.latency_ms ?? 0

    // Core (8765)
    const coreRes = coreResult.status === 'fulfilled' && coreResult.value.ok ? coreResult.value : null
    if (!coreRes) {
      const fallbackWithRedis = {
        ...FALLBACK,
        services: FALLBACK.services.map(s =>
          s.name === 'Redis'
            ? { ...s, status: mapRedisStatus(redisRaw), latencyMs: redisLatency }
            : s
        ),
      }
      return NextResponse.json({ ...fallbackWithRedis, score: computeScore(fallbackWithRedis.services) })
    }

    const coreStatus = classify(latencyMs)
    const data = await coreRes.json()

    // Map OMNIS health checks to subsystem statuses
    const checks = data.checks ?? {}
    const akashaOk = checks.memory?.status === 'ok' || checks.memory?.status === 'healthy'
    const litellmOk = checks.docker?.status === 'ok' || checks.docker?.status === 'healthy'

    const services: ServiceHealth[] = [
      { name: 'OMNIS Core', status: coreStatus, latencyMs, port: 8765 },
      { name: 'AKASHA',     status: akashaOk ? 'ok' : 'offline', latencyMs: akashaOk ? 12 : 0,  port: 5432 },
      { name: 'LiteLLM',   status: litellmOk ? 'ok' : 'offline', latencyMs: litellmOk ? 78 : 0, port: 4001 },
      { name: 'Redis',      status: mapRedisStatus(redisRaw), latencyMs: redisLatency, port: 6379 },
    ]

    return NextResponse.json({ services, score: computeScore(services), timestamp: new Date().toISOString() } satisfies HealthResponse)
  } catch {
    return NextResponse.json({ ...FALLBACK, score: 0 })
  }
}
