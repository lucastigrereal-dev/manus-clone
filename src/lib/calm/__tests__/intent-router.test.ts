import { describe, it, expect } from 'vitest'
import { classifyIntent } from '../intent-router'

describe('Intent Router', () => {
  it('classifica busca AKASHA', () => {
    const r = classifyIntent('consulta a Caixa sobre WAF-02')
    expect(r.intent).toBe('knowledge_search')
    expect(r.tool).toBe('akasha.search')
    expect(r.extracted_query).toBe('WAF-02')
    expect(r.needs_approval).toBe(false)
  })

  it('classifica status do sistema', () => {
    const r = classifyIntent('como está o KRATOS?')
    expect(r.intent).toBe('system_status')
    expect(r.tool).toBe('system.health')
  })

  it('classifica criação de missão com approval', () => {
    const r = classifyIntent('cria um app para organizar leads do Instagram')
    expect(r.intent).toBe('mission_execute')
    expect(r.needs_approval).toBe(true)
    expect(r.risk_level).toBe('R1')
  })

  it('classifica "o que precisa de mim"', () => {
    const r = classifyIntent('Aurora, o que precisa de mim?')
    expect(r.intent).toBe('next_action_query')
  })

  it('classifica gargalo', () => {
    const r = classifyIntent('qual o gargalo do OMNIS hoje?')
    expect(r.intent).toBe('gargalo_query')
  })

  it('classifica canvas', () => {
    const r = classifyIntent('faz um mapa mental do OMNIS')
    expect(r.intent).toBe('canvas_open')
  })

  it('cai pra conversa normal quando não bate regra', () => {
    const r = classifyIntent('qual a capital da França?')
    expect(r.intent).toBe('chat_normal')
    expect(r.tool).toBe('aurora.chat')
  })

  it('não confunde pergunta sobre algo com criação', () => {
    const r = classifyIntent('o que sabemos sobre criação de apps?')
    expect(r.intent).toBe('knowledge_search')  // "o que sabemos sobre" vence
  })
})
