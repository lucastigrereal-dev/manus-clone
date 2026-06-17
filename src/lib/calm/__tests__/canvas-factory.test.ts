import { describe, it, expect } from 'vitest'
import { createCanvas } from '../canvas-factory'

describe('Canvas Factory', () => {
  it('system_map tem 7 nodes', () =>
    expect(createCanvas('system_map', 'x').nodes.length).toBe(7))

  it('integration_map tem edges com status degraded', () => {
    const c = createCanvas('integration_map', 'x')
    expect(c.edges.some((e) => e.status === 'degraded')).toBe(true)
  })

  it('mindmap liga tudo ao root', () => {
    const c = createCanvas('mindmap', 'x')
    expect(c.edges.every((e) => e.source === 'root')).toBe(true)
  })

  it('created_from é chat', () =>
    expect(createCanvas('mindmap', 'x').created_from).toBe('chat'))
})
