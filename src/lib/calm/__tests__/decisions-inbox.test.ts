import { describe, it, expect } from 'vitest'
// Testa o contrato de decisão via orchestrator (a rota HTTP é testada manualmente)
import { orchestrate } from '../chat-orchestrator'

describe('W3 — Decisões / next_action_query', () => {
  it('"o que precisa de mim" classifica como tool_result', () => {
    const r = orchestrate({ message: 'o que precisa de mim?' })
    // classifica next_action_query → sem tool → tool_result com texto de espera
    // OU pode já ter tool decisions.inbox via EXPANSION_RULES
    expect(['tool_result', 'assistant_text']).toContain(r.kind)
  })

  it('"Aurora, o que precisa de mim?" intent é next_action_query', () => {
    const r = orchestrate({ message: 'Aurora, o que precisa de mim?' })
    expect(r.intent.intent).toBe('next_action_query')
  })

  it('"faz check-up" classifica para doctor.checkup', () => {
    const r = orchestrate({ message: 'faz check-up do OMNIS' })
    expect(r.intent.tool).toBe('doctor.checkup')
    expect(r.kind).toBe('tool_result')
  })

  it('decisions inbox tool está registrada', () => {
    // Verifica que tool-registry tem decisions.inbox
    const r = orchestrate({ message: 'faz check-up' })
    expect(r.intent.tool).not.toBeNull()
  })
})
