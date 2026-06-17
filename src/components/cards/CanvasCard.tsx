'use client'

// src/components/cards/CanvasCard.tsx
// Renderiza um CanvasArtifact com @xyflow/react (já instalado)
// Aciona: "faz mapa mental", "mostra as conexões", "mostra arquitetura"

import React, { useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { CanvasArtifact, CanvasNode, CanvasEdge } from '@/types/calm-expansion'

const STATUS_COLOR: Record<string, string> = {
  ok: '#10b981',
  degraded: '#f59e0b',
  down: '#ef4444',
  not_configured: '#6b7280',
}

function toFlowNode(n: CanvasNode): Node {
  const color = n.status ? STATUS_COLOR[n.status] ?? '#6366f1' : '#6366f1'
  return {
    id: n.node_id,
    position: { x: n.x, y: n.y },
    data: {
      label: (
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-xs font-medium">{n.label}</span>
          {n.meta?.port && (
            <span className="text-[10px] opacity-60">:{String(n.meta.port)}</span>
          )}
        </div>
      ),
    },
    style: {
      border: `2px solid ${color}`,
      borderRadius: 10,
      background: `${color}15`,
      padding: '6px 12px',
      fontSize: 12,
      minWidth: 90,
    },
  }
}

function toFlowEdge(e: CanvasEdge): Edge {
  const color = e.status ? STATUS_COLOR[e.status] ?? '#94a3b8' : '#94a3b8'
  return {
    id: e.edge_id,
    source: e.source,
    target: e.target,
    label: e.label ?? undefined,
    style: { stroke: color, strokeWidth: 2 },
    labelStyle: { fontSize: 10, fill: color },
  }
}

interface CanvasCardProps {
  canvas: CanvasArtifact
  height?: number
}

const CANVAS_TITLE: Record<string, string> = {
  mindmap: '🧠 Mapa Mental',
  system_map: '🗺️ Arquitetura Viva',
  integration_map: '🔗 Mapa de Integrações',
  kanban: '📋 Quadro Kanban',
  mission_flow: '🚀 Linha da Missão',
  calendar: '📅 Calendário',
  doc: '📄 Documento',
  automation_flow: '⚡ Fluxo de Automação',
  artifact_board: '📦 Artifacts',
}

export default function CanvasCard({ canvas, height = 340 }: CanvasCardProps) {
  const [nodes, , onNodesChange] = useNodesState(canvas.nodes.map(toFlowNode))
  const [edges, , onEdgesChange] = useEdgesState(canvas.edges.map(toFlowEdge))

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    // integration_map: clicar na edge testa a conexão (feedback visual imediato)
    if (canvas.type === 'integration_map') {
      console.log('[CALM] Testing connection:', edge.id)
    }
  }, [canvas.type])

  return (
    <div
      className="rounded-2xl overflow-hidden my-2"
      style={{ border: '1px solid var(--border-main)', height }}
    >
      <div
        className="px-3 py-2 flex items-center gap-2"
        style={{ borderBottom: '1px solid var(--border-main)', backgroundColor: 'var(--background-menu-white)' }}
      >
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {CANVAS_TITLE[canvas.type] ?? canvas.type}
        </span>
        <span className="text-xs ml-auto" style={{ color: 'var(--text-tertiary)' }}>
          {canvas.nodes.length} nós · {canvas.edges.length} conexões
        </span>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeClick={onEdgeClick}
        fitView
        minZoom={0.4}
        maxZoom={2}
        style={{ height: height - 40 }}
      >
        <Background gap={16} size={1} color="var(--border-main)" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}
