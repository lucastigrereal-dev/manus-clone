// src/app/api/canvas/create/route.ts
// Cria um CanvasArtifact a partir de tipo + comando
// Comando que aciona: "faz mapa mental", "transforma em quadro", "mostra conexões"

import { NextRequest, NextResponse } from 'next/server'
import { createCanvas } from '@/lib/calm/canvas-factory'
import type { CanvasType } from '@/types/calm-expansion'

export async function POST(req: NextRequest) {
  try {
    const { type, title, mission_id } = await req.json()
    const canvas = createCanvas(
      (type ?? 'mindmap') as CanvasType,
      title ?? 'Canvas',
      { missionId: mission_id ?? undefined }
    )
    return NextResponse.json(canvas)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Falha ao criar canvas' },
      { status: 500 }
    )
  }
}
