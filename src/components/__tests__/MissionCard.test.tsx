// @vitest-environment jsdom
import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MissionCard, { type MissionCardData } from '../MissionCard'

// ── mock addToast ──────────────────────────────────────────────────────────
const mockAddToast = vi.fn()

vi.mock('@/stores/uiStore', () => ({
  useUiStore: (selector: (s: { addToast: typeof mockAddToast }) => unknown) =>
    selector({ addToast: mockAddToast }),
}))

// ── base card fixture ──────────────────────────────────────────────────────
const baseCard: MissionCardData = {
  id: 'mis_01',
  title: 'Missão teste',
  status: 'running',
  risk_level: 'R1',
  ts: new Date('2026-06-19T10:00:00Z'),
  factory: 'Test',
}

// ── helpers ────────────────────────────────────────────────────────────────
function mockFetchOnce(status: number, body?: object) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValueOnce({
      status,
      ok: status >= 200 && status < 300,
      json: () => Promise.resolve(body ?? {}),
    }),
  )
}

beforeEach(() => {
  mockAddToast.mockClear()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

// ── tests ──────────────────────────────────────────────────────────────────
describe('MissionCard — botão Cancelar', () => {
  it('oculta botão Cancelar para status done', () => {
    render(<MissionCard {...baseCard} status="done" />)
    // The only button text that can match is "Cancelar" (the trigger button)
    // "Cancelar missão" is in the dialog which is closed
    expect(screen.queryByText('Cancelar')).toBeNull()
  })

  it('oculta botão Cancelar para status failed', () => {
    render(<MissionCard {...baseCard} status="failed" />)
    expect(screen.queryByText('Cancelar')).toBeNull()
  })

  it('oculta botão Cancelar para status cancelled', () => {
    render(<MissionCard {...baseCard} status="cancelled" />)
    expect(screen.queryByText('Cancelar')).toBeNull()
  })

  it('mostra botão Cancelar para status running', () => {
    render(<MissionCard {...baseCard} status="running" />)
    // Exact text "Cancelar" — the trigger button
    expect(screen.getByText('Cancelar')).toBeTruthy()
  })

  it('mostra botão Cancelar para status queued', () => {
    render(<MissionCard {...baseCard} status="queued" />)
    expect(screen.getByText('Cancelar')).toBeTruthy()
  })

  it('abre dialog ao clicar Cancelar', async () => {
    render(<MissionCard {...baseCard} status="running" />)
    const user = userEvent.setup()
    await user.click(screen.getByText('Cancelar'))
    expect(screen.getByText('Cancelar missão?')).toBeTruthy()
  })

  it('chama POST com body correto ao confirmar', async () => {
    mockFetchOnce(200)
    render(<MissionCard {...baseCard} status="running" />)
    const user = userEvent.setup()

    // open dialog
    await user.click(screen.getByText('Cancelar'))
    // confirm — button says "Cancelar missão"
    await user.click(screen.getByText('Cancelar missão'))

    expect(vi.mocked(fetch)).toHaveBeenCalledOnce()
    const [url, init] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit]
    expect(url).toBe('/api/missions/mis_01/cancel')
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body as string)).toEqual({
      reason: 'user_request',
      cancelled_by: 'lucas',
    })
  })

  it('chama onCancel e toast success em 200', async () => {
    mockFetchOnce(200)
    const onCancel = vi.fn()
    render(<MissionCard {...baseCard} status="running" onCancel={onCancel} />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Cancelar'))
    await user.click(screen.getByText('Cancelar missão'))

    await waitFor(() => {
      expect(onCancel).toHaveBeenCalledWith('mis_01')
    })
    expect(mockAddToast).toHaveBeenCalledWith(
      expect.objectContaining({ kind: 'success' }),
    )
  })

  it('toast warning em 409 e onCancel NÃO chamado', async () => {
    mockFetchOnce(409)
    const onCancel = vi.fn()
    render(<MissionCard {...baseCard} status="running" onCancel={onCancel} />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Cancelar'))
    await user.click(screen.getByText('Cancelar missão'))

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ kind: 'warning' }),
      )
    })
    expect(onCancel).not.toHaveBeenCalled()
  })
})
