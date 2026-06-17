// src/app/api/doctor/checkup/route.ts
// Endpoint do Médico — busca /api/health e roda system-doctor.ts
// Comando que aciona: "faz check-up", "diagnóstico", "como está o sistema"

import { NextRequest, NextResponse } from 'next/server'
import { ulid } from 'ulidx'
import { computeClimate, computeScore, findBottleneck, diagnose } from '@/lib/calm/system-doctor'
import type { SystemHealth, ServiceStatus } from '@/types/calm-expansion'

export async function GET(req: NextRequest) {
  try {
    const base = req.nextUrl.origin
    const res = await fetch(`${base}/api/health`)
    const raw = await res.json()

    // Normaliza o formato do /api/health existente → ServiceStatus[]
    const services: ServiceStatus[] = (raw.services ?? []).map((s: { name: string; status: string; latencyMs?: number; port?: number; detail?: string }) => ({
      name: s.name,
      status: s.status === 'ok' ? 'ok' : s.status === 'slow' ? 'slow' : (s.latencyMs ?? 0) > 0 ? 'degraded' : 'down',
      latency_ms: s.latencyMs ?? 0,
      port: s.port ?? null,
      detail: s.detail ?? null,
    }))

    const health: SystemHealth = {
      health_id: ulid(),
      score: computeScore(services),
      climate: computeClimate(services),
      services,
      bottleneck: findBottleneck(services),
      checked_at: new Date().toISOString(),
    }

    const diagnosis = diagnose(health)
    diagnosis.diagnosis_id = ulid()

    return NextResponse.json({ health, diagnosis })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Falha no check-up' },
      { status: 502 }
    )
  }
}
