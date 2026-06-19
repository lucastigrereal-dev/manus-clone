import { describe, it, expect, vi, afterEach } from 'vitest'
import { GET } from '../route'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

// ── mock helper ────────────────────────────────────────────────────────────
function mockFetch(coreResponse: object | null, controlResponse: object | null, coreThrows = false, controlThrows = false) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation((url: string) => {
      if (url.includes('8765')) {
        if (coreThrows) return Promise.reject(new Error('core unreachable'))
        return Promise.resolve({
          ok: coreResponse !== null,
          json: () => Promise.resolve(coreResponse ?? {}),
        })
      }
      if (url.includes('8766')) {
        if (controlThrows) return Promise.reject(new Error('control unreachable'))
        return Promise.resolve({
          ok: controlResponse !== null,
          json: () => Promise.resolve(controlResponse ?? {}),
        })
      }
      return Promise.reject(new Error(`unexpected url: ${url}`))
    }),
  )
}

// ── helper: extract services JSON from NextResponse ────────────────────────
async function callGET() {
  const res = await GET()
  const body = await res.json()
  return body as { services: { name: string; status: string; latencyMs: number }[]; score: number }
}

function findRedis(services: { name: string; status: string; latencyMs: number }[]) {
  return services.find((s) => s.name === 'Redis')!
}

// A minimal valid core response so we hit the "core ok" branch
const coreOk = {
  checks: {
    memory: { status: 'ok' },
    docker: { status: 'ok' },
  },
}

describe('GET /api/health — Redis status via 8766', () => {
  it('Redis ok quando 8766 retorna status ok', async () => {
    const controlOk = { checks: { redis: { status: 'ok', latency_ms: 5 } } }
    mockFetch(null, controlOk, true) // core fails → fallback path, redis still parsed

    const { services } = await callGET()
    const redis = findRedis(services)
    expect(redis.status).toBe('ok')
    expect(redis.latencyMs).toBe(5)
  })

  it('Redis slow quando 8766 retorna degraded', async () => {
    const controlDegraded = { checks: { redis: { status: 'degraded', latency_ms: 120 } } }
    mockFetch(null, controlDegraded, true) // core fails → fallback

    const { services } = await callGET()
    const redis = findRedis(services)
    expect(redis.status).toBe('slow')
    expect(redis.latencyMs).toBe(120)
  })

  it('Redis offline quando 8766 retorna down', async () => {
    const controlDown = { checks: { redis: { status: 'down', latency_ms: 0 } } }
    mockFetch(null, controlDown, true)

    const { services } = await callGET()
    const redis = findRedis(services)
    expect(redis.status).toBe('offline')
  })

  it('Redis offline quando 8766 inalcançável', async () => {
    mockFetch(null, null, true, true) // both fail

    const { services } = await callGET()
    const redis = findRedis(services)
    expect(redis.status).toBe('offline')
  })

  it('score correto com Redis degraded (slow = 5 pts de 10)', async () => {
    // all-ok baseline: core ok + redis ok
    const controlOk = { checks: { redis: { status: 'ok', latency_ms: 5 } } }
    mockFetch(null, controlOk, true)
    const { score: baseScore } = await callGET()

    // now redis degraded → slow = 50% of weight 10 = 5 pts less
    const controlDegraded = { checks: { redis: { status: 'degraded', latency_ms: 120 } } }
    mockFetch(null, controlDegraded, true)
    const { score: degradedScore } = await callGET()

    expect(baseScore - degradedScore).toBe(5)
  })
})
