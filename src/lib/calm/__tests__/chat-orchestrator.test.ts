import { describe, it, expect } from 'vitest'
import { orchestrate } from '../chat-orchestrator'

describe('Chat Orchestrator', () => {
  it('conversa normal → assistant_text', () => {
    const r = orchestrate({ message: 'oi tudo bem?' })
    expect(r.kind).toBe('assistant_text')
  })

  it('busca AKASHA → tool_result', () => {
    const r = orchestrate({ message: 'consulta a caixa sobre WAF-02' })
    expect(r.kind).toBe('tool_result')
    expect(r.intent.tool).toBe('akasha.search')
  })

  it('criação → mission_launch', () => {
    const r = orchestrate({ message: 'cria um app de leads' })
    expect(r.kind).toBe('mission_launch')
    expect(r.mission_text).toBe('cria um app de leads')
  })

  it('canvas → clarification (Wave 2)', () => {
    const r = orchestrate({ message: 'abre um mapa mental disso' })
    expect(r.kind).toBe('clarification')
    expect(r.clarification_options?.length).toBeGreaterThan(0)
  })

  it('status → tool_result com health', () => {
    const r = orchestrate({ message: 'como está o kratos?' })
    expect(r.kind).toBe('tool_result')
    expect(r.intent.tool).toBe('system.health')
  })
})
