import { describe, it, expect } from 'vitest'
import { classifyIntent } from '../intent-router'

describe('W5-02 — Foco Brutal', () => {
  it('"tô perdido" classifica para focus.brutal', () => {
    const r = classifyIntent('tô perdido')
    expect(r.tool).toBe('focus.brutal')
  })

  it('"muita coisa ao mesmo tempo" → foco', () => {
    const r = classifyIntent('muita coisa ao mesmo tempo na cabeça')
    expect(r.tool).toBe('focus.brutal')
  })

  it('"não sei por onde começar" → foco', () => {
    const r = classifyIntent('não sei por onde começar')
    expect(r.tool).toBe('focus.brutal')
  })
})
