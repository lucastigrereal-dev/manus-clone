import { describe, it, expect } from 'vitest'
import { getTool, TOOL_REGISTRY } from '../tool-registry'

describe('Tool Registry', () => {
  it('retorna ferramenta por chave', () => {
    const t = getTool('akasha.search')
    expect(t).not.toBeNull()
    expect(t?.endpoint).toBe('/api/akasha/search')
  })

  it('retorna null para chave inexistente', () => {
    expect(getTool('inexistente.xyz')).toBeNull()
  })

  it('missions.execute exige approval', () => {
    expect(getTool('missions.execute')?.needs_approval).toBe(true)
  })

  it('akasha.search não exige approval', () => {
    expect(getTool('akasha.search')?.needs_approval).toBe(false)
  })

  it('todas as ferramentas têm endpoint e result_card', () => {
    for (const tool of Object.values(TOOL_REGISTRY)) {
      expect(tool.endpoint).toBeTruthy()
      expect(tool.result_card).toBeTruthy()
    }
  })
})
