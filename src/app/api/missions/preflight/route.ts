import { NextRequest, NextResponse } from 'next/server'

export interface PreflightResult {
  estimatedCostUsd: number
  decision: 'GO' | 'VETO'
  breakdown: Array<{ operation: string; costUsd: number }>
  reason?: string
  roiScore?: number
  source?: 'core' | 'mock'
}

const FALLBACK: PreflightResult = {
  estimatedCostUsd: 0.002,
  decision: 'GO',
  breakdown: [],
  source: 'mock',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message } = body as { message: string; agent?: string }

    // Endpoint REAL de decisão econômica: POST /economic-brain/evaluate
    // (src/economic_brain/router.py). Retorna go/no-go + custo + ROI reais.
    // É read-only (avalia, não executa) — seguro. O /cost/estimate antigo era 404.
    const complexity = Math.min(10, Math.max(0.5, (message?.length ?? 100) / 200))
    const res = await fetch('http://localhost:8765/economic-brain/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ mission_type: 'generic', complexity_multiplier: complexity }),
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) return NextResponse.json(FALLBACK)

    // Core: { go, roi_score, cost_estimate_usd, recommendation, reason, alternatives }
    const data = await res.json()
    const result: PreflightResult = {
      estimatedCostUsd: data.cost_estimate_usd ?? 0.002,
      decision: data.go ? 'GO' : 'VETO',
      breakdown: [
        { operation: data.recommendation ?? 'avaliação econômica', costUsd: data.cost_estimate_usd ?? 0 },
      ],
      reason: data.reason,
      roiScore: data.roi_score,
      source: 'core',
    }
    return NextResponse.json(result)
  } catch {
    return NextResponse.json(FALLBACK)
  }
}
