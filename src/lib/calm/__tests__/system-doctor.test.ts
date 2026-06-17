import { describe, it, expect } from 'vitest'
import { computeClimate, computeScore, findBottleneck, diagnose, forecastAction } from '../system-doctor'

const ok = [
  { name: 'core', status: 'ok' as const, latency_ms: 20 },
  { name: 'akasha', status: 'ok' as const, latency_ms: 15 },
]
const deg = [
  { name: 'core', status: 'ok' as const, latency_ms: 20 },
  { name: 'kratos', status: 'degraded' as const, latency_ms: 0, detail: 'venv quebrada' },
]

describe('System Doctor', () => {
  it('clima sol quando tudo ok', () => expect(computeClimate(ok)).toBe('sol'))
  it('clima fogo quando core down', () =>
    expect(computeClimate([{ name: 'core', status: 'down', latency_ms: 0 }])).toBe('fogo'))
  it('score alto saudável', () => expect(computeScore(ok)).toBeGreaterThanOrEqual(90))
  it('acha gargalo', () => expect(findBottleneck(deg)).toContain('kratos'))
  it('diagnóstico 3 níveis', () => {
    const d = diagnose({
      health_id: 'x',
      score: 70,
      climate: 'nuvens',
      services: deg,
      bottleneck: 'kratos degradado',
      checked_at: '',
    })
    expect(d.level_leigo).toBeTruthy()
    expect(d.next_action).toBeTruthy()
  })
  it('forecast prevê falha', () => {
    const f = forecastAction('factory', ['kratos'], {
      health_id: 'x',
      score: 50,
      climate: 'chuva',
      services: [{ name: 'kratos', status: 'down', latency_ms: 0 }],
      bottleneck: null,
      checked_at: '',
    })
    expect(f.failure_probability).toBeGreaterThan(0.5)
  })
})
