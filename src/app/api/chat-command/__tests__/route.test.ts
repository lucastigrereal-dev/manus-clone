import { describe, it, expect } from 'vitest'
import { orchestrate } from '@/lib/calm/chat-orchestrator'

// Teste o contrato de decisão (a chamada HTTP real é testada no E2E manual)
describe('chat-command contract', () => {
  it('mission_launch carrega mission_text', () => {
    const r = orchestrate({ message: 'cria um relatório de vendas' })
    expect(r.kind).toBe('mission_launch')
    expect(r.mission_text).toBeTruthy()
  })

  it('clarification para canvas', () => {
    const r = orchestrate({ message: 'mostra as conexões do sistema' })
    expect(['clarification', 'tool_result']).toContain(r.kind)
  })
})
