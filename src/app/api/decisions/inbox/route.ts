// src/app/api/decisions/inbox/route.ts
// "O que precisa de mim?" — busca decisões blocking do Core e filtra só as pendentes.
import { NextRequest, NextResponse } from 'next/server'

const CORE_BASE = process.env.OMNIS_CORE_URL ?? 'http://localhost:8766'

export async function GET(_req: NextRequest) {
  try {
    const res = await fetch(`${CORE_BASE}/darwin/proposals/pending`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(3000),
    })

    if (!res.ok) {
      // Core offline ou rota ausente → retorna inbox vazia (não quebra o chat)
      return NextResponse.json({ decisions: [], source: 'offline' })
    }

    const data = await res.json()
    // Darwin proposals → normaliza para Decision[]
    const proposals: Array<{
      proposal_id?: string
      id?: string
      title?: string
      description?: string
      risk_tier?: string
      risk_level?: string
      status?: string
    }> = Array.isArray(data) ? data : (data.proposals ?? data.items ?? [])

    const decisions = proposals.map((p) => ({
      decision_id: p.proposal_id ?? p.id ?? 'unknown',
      title: p.title ?? p.description ?? 'Proposta pendente',
      kind: 'approval' as const,
      risk_level: (p.risk_tier ?? p.risk_level ?? 'R1') as 'R0' | 'R1' | 'R2' | 'R3' | 'R4',
      status: 'pending' as const,
      blocking: true,
      options: ['Aprovar', 'Rejeitar', 'Modificar'],
      created_at: new Date().toISOString(),
    }))

    return NextResponse.json({ decisions, source: 'core' })
  } catch {
    return NextResponse.json({ decisions: [], source: 'error' })
  }
}
