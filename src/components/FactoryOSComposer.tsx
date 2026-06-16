"use client";

import React, { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useUiStore } from "@/stores/uiStore";

const INIT_NODES = [
  { id: "research", position: { x: 50, y: 150 }, data: { label: "🔬 Research" } },
  { id: "content", position: { x: 300, y: 80 }, data: { label: "✍️ Content" } },
  { id: "app", position: { x: 300, y: 220 }, data: { label: "💻 App Factory" } },
  { id: "commercial", position: { x: 550, y: 150 }, data: { label: "💰 Commercial" } },
];

const INIT_EDGES = [
  { id: "e1", source: "research", target: "content", label: "findings" },
  { id: "e2", source: "research", target: "app", label: "findings" },
  { id: "e3", source: "content", target: "commercial", label: "draft" },
  { id: "e4", source: "app", target: "commercial", label: "code" },
];

export default function FactoryOSComposer() {
  const [nodes, , onNodesChange] = useNodesState(INIT_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INIT_EDGES);
  const addToast = useUiStore((s) => s.addToast);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const handleExecute = () => {
    addToast({ kind: "success", message: "Pipeline enviado para execução (mock)" });
  };

  return (
    <div style={{ width: "100%", height: "480px", position: "relative" }}>
      <button
        onClick={handleExecute}
        className="rounded-xl text-sm font-medium transition-colors"
        style={{
          position: "absolute",
          top: "0.5rem",
          right: "0.5rem",
          zIndex: 10,
          backgroundColor: "var(--Button-black)",
          color: "white",
          padding: "0.375rem 0.75rem",
        }}
      >
        Executar Pipeline
      </button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
