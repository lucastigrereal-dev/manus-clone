import { describe, it, expect } from 'vitest'
import { getTool, TOOL_REGISTRY } from '../tool-registry'

describe('Wave 3 — factory.decide tool registration', () => {
  it('factory.decide está registrado no TOOL_REGISTRY', () => {
    expect(TOOL_REGISTRY['factory.decide']).toBeDefined()
  })

  it('factory.decide tem risk_level R2 e needs_approval true', () => {
    const tool = getTool('factory.decide')
    expect(tool).not.toBeNull()
    expect(tool!.risk_level).toBe('R2')
    expect(tool!.needs_approval).toBe(true)
  })

  it('factory.decide aponta para /api/factory/publish', () => {
    const tool = getTool('factory.decide')
    expect(tool!.endpoint).toBe('/api/factory/publish')
    expect(tool!.method).toBe('POST')
  })
})
