// src/lib/calm/canvas-factory.ts
// Gera CanvasArtifact a partir de comando de chat (Ideias #31-38)
// Regra suprema: o chat abre o canvas, o usuário não navega até ele.
// Usa @xyflow/react (já instalado). Cada função retorna nodes+edges prontos.

import { ulid } from 'ulidx'
import type { CanvasArtifact, CanvasNode, CanvasEdge, CanvasType } from '@/types/calm-expansion'

// ─── SYSTEM MAP (Ideia #38) — arquitetura viva com portas e status ──────────

export function buildSystemMap(): Pick<CanvasArtifact, 'nodes' | 'edges'> {
  const nodes: CanvasNode[] = [
    { node_id: 'calm', label: 'CALM Shell', x: 100, y: 50, kind: 'service', status: 'ok', meta: { port: 3001 } },
    { node_id: 'core', label: 'OMNIS Core', x: 100, y: 200, kind: 'service', status: 'ok', meta: { port: 8766 } },
    { node_id: 'redis', label: 'Redis / Hermes', x: 350, y: 200, kind: 'service', status: 'ok', meta: { port: 6379 } },
    { node_id: 'akasha', label: 'AKASHA', x: 100, y: 350, kind: 'service', status: 'ok', meta: { port: 5432 } },
    { node_id: 'litellm', label: 'LiteLLM', x: 350, y: 350, kind: 'service', status: 'ok', meta: { port: 4001 } },
    { node_id: 'kratos', label: 'KRATOS', x: 600, y: 200, kind: 'service', status: 'degraded', meta: { port: 8080 } },
    { node_id: 'qdrant', label: 'Qdrant', x: 100, y: 500, kind: 'service', status: 'ok', meta: { port: 6333 } },
  ]
  const edges: CanvasEdge[] = [
    { edge_id: 'e1', source: 'calm', target: 'core', label: 'comanda', status: 'ok' },
    { edge_id: 'e2', source: 'core', target: 'redis', label: 'eventos', status: 'ok' },
    { edge_id: 'e3', source: 'core', target: 'akasha', label: 'memória', status: 'ok' },
    { edge_id: 'e4', source: 'core', target: 'litellm', label: 'LLM', status: 'ok' },
    { edge_id: 'e5', source: 'redis', target: 'kratos', label: 'stream', status: 'degraded' },
    { edge_id: 'e6', source: 'akasha', target: 'qdrant', label: 'vetores', status: 'ok' },
  ]
  return { nodes, edges }
}

// ─── INTEGRATION MAP (Ideia #35) — linhas mudam de cor por status ───────────

export function buildIntegrationMap(): Pick<CanvasArtifact, 'nodes' | 'edges'> {
  const nodes: CanvasNode[] = [
    { node_id: 'calm', label: 'CALM', x: 100, y: 200, kind: 'core', status: 'ok' },
    { node_id: 'github', label: 'GitHub', x: 400, y: 50, kind: 'integration', status: 'ok' },
    { node_id: 'drive', label: 'Google Drive', x: 400, y: 150, kind: 'integration', status: 'ok' },
    { node_id: 'notion', label: 'Notion', x: 400, y: 250, kind: 'integration', status: 'ok' },
    { node_id: 'obsidian', label: 'Obsidian', x: 400, y: 350, kind: 'integration', status: 'not_configured' },
    { node_id: 'instagram', label: 'Instagram', x: 400, y: 450, kind: 'integration', status: 'degraded' },
  ]
  const edges: CanvasEdge[] = [
    { edge_id: 'i1', source: 'calm', target: 'github', status: 'ok' },
    { edge_id: 'i2', source: 'calm', target: 'drive', status: 'ok' },
    { edge_id: 'i3', source: 'calm', target: 'notion', status: 'ok' },
    { edge_id: 'i4', source: 'calm', target: 'obsidian', status: 'not_configured' },
    { edge_id: 'i5', source: 'calm', target: 'instagram', status: 'degraded' },
  ]
  return { nodes, edges }
}

// ─── KANBAN (Ideia #32) — colunas como nodes posicionados ───────────────────

const KANBAN_COLUMNS = ['Backlog', 'A Fazer', 'Em Execução', 'Aguardando Aprovação', 'Concluído', 'Bloqueado']

export function buildKanban(cards: Array<{ title: string; column: string }>): Pick<CanvasArtifact, 'nodes' | 'edges'> {
  const nodes: CanvasNode[] = []
  KANBAN_COLUMNS.forEach((col, ci) => {
    nodes.push({ node_id: `col-${ci}`, label: col, x: ci * 220, y: 0, kind: 'column' })
    const colCards = cards.filter((c) => c.column === col)
    colCards.forEach((card, ri) => {
      nodes.push({
        node_id: `card-${ci}-${ri}`,
        label: card.title,
        x: ci * 220,
        y: 60 + ri * 70,
        kind: 'card',
        meta: { column: col },
      })
    })
  })
  return { nodes, edges: [] }
}

// ─── MISSION FLOW (Ideia #37) — linha de produção da missão ─────────────────

export function buildMissionFlow(missionTitle: string, currentPhase: string): Pick<CanvasArtifact, 'nodes' | 'edges'> {
  const phases = ['Brief', 'Plano', 'Approval', 'Execução', 'Testes', 'Artifact', 'Memória']
  const currentIdx = phases.indexOf(currentPhase)
  const nodes: CanvasNode[] = phases.map((p, i) => ({
    node_id: `phase-${i}`,
    label: p,
    x: i * 150,
    y: 100,
    kind: 'phase',
    status: i < currentIdx ? 'ok' : i === currentIdx ? 'degraded' : 'not_configured',
  }))
  const edges: CanvasEdge[] = phases.slice(0, -1).map((_, i) => ({
    edge_id: `f-${i}`,
    source: `phase-${i}`,
    target: `phase-${i + 1}`,
    status: i < currentIdx ? 'ok' : null,
  }))
  return { nodes, edges }
}

// ─── MINDMAP (Ideia #31) — nó central com ramos ─────────────────────────────

export function buildMindmap(central: string, branches: string[]): Pick<CanvasArtifact, 'nodes' | 'edges'> {
  const nodes: CanvasNode[] = [{ node_id: 'root', label: central, x: 400, y: 300, kind: 'root' }]
  const edges: CanvasEdge[] = []
  const radius = 250
  branches.forEach((b, i) => {
    const angle = (2 * Math.PI * i) / branches.length
    nodes.push({
      node_id: `branch-${i}`,
      label: b,
      x: 400 + radius * Math.cos(angle),
      y: 300 + radius * Math.sin(angle),
      kind: 'branch',
    })
    edges.push({ edge_id: `m-${i}`, source: 'root', target: `branch-${i}` })
  })
  return { nodes, edges }
}

// ─── Factory unificada ──────────────────────────────────────────────────────

export function createCanvas(
  type: CanvasType,
  title: string,
  opts: { missionId?: string; data?: unknown } = {}
): CanvasArtifact {
  let graph: Pick<CanvasArtifact, 'nodes' | 'edges'>

  switch (type) {
    case 'system_map':
      graph = buildSystemMap()
      break
    case 'integration_map':
      graph = buildIntegrationMap()
      break
    case 'mindmap':
      graph = buildMindmap('OMNIS', ['CALM', 'Core', 'KRATOS', 'AKASHA', 'Factory', 'Redis', 'LiteLLM', 'Darwin'])
      break
    case 'mission_flow':
      graph = buildMissionFlow(title, 'Approval')
      break
    case 'kanban':
      graph = buildKanban((opts.data as Array<{ title: string; column: string }>) ?? [])
      break
    default:
      graph = { nodes: [], edges: [] }  // calendar, doc, automation_flow — Wave futura
  }

  return {
    canvas_id: ulid(),
    type,
    title,
    mission_id: opts.missionId ?? null,
    project_id: null,
    nodes: graph.nodes,
    edges: graph.edges,
    created_from: 'chat',
    status: 'active',
    created_at: new Date().toISOString(),
  }
}
