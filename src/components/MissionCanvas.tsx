"use client";

import React, { useCallback } from "react";
import "@xyflow/react/dist/style.css";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
} from "@xyflow/react";

const nodeStyle: React.CSSProperties = {
  backgroundColor: "var(--background-menu-white)",
  border: "1px solid var(--border-main)",
  borderRadius: "10px",
  padding: "8px 14px",
  fontSize: "12px",
  color: "var(--text-primary)",
  whiteSpace: "pre-line",
};

const initialNodes: Node[] = [
  {
    id: "n1",
    position: { x: 100, y: 100 },
    data: { label: "Research\n(Hermes)", style: nodeStyle },
    type: "default",
    style: nodeStyle,
  },
  {
    id: "n2",
    position: { x: 300, y: 100 },
    data: { label: "Content\n(Muse)", style: nodeStyle },
    type: "default",
    style: nodeStyle,
  },
  {
    id: "n3",
    position: { x: 300, y: 250 },
    data: { label: "Review\n(Aurora)", style: nodeStyle },
    type: "default",
    style: nodeStyle,
  },
  {
    id: "n4",
    position: { x: 500, y: 175 },
    data: { label: "Publish\n(Vulcano)", style: nodeStyle },
    type: "default",
    style: nodeStyle,
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "n1", target: "n2", animated: true },
  { id: "e2-3", source: "n2", target: "n3" },
  { id: "e3-4", source: "n3", target: "n4" },
  { id: "e2-4", source: "n2", target: "n4", style: { strokeDasharray: "5,5" } },
];

export default function MissionCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleEnviarPlano = () => {
    console.log("Plano da missão:", { nodes, edges });
  };

  return (
    <div style={{ width: "100%", height: "500px", position: "relative" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        style={{ backgroundColor: "var(--background-gray-main)" }}
      >
        <Background color="var(--border-main)" gap={16} />
        <Controls />
        <MiniMap
          style={{
            backgroundColor: "var(--background-menu-white)",
            border: "1px solid var(--border-main)",
          }}
        />
      </ReactFlow>

      {/* "Enviar plano" overlay button */}
      <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 10 }}>
        <button
          onClick={handleEnviarPlano}
          className="rounded-xl px-3 py-2 text-sm font-semibold transition-colors"
          style={{
            backgroundColor: "var(--Button-black)",
            color: "var(--Button-white)",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
          }}
        >
          Enviar plano
        </button>
      </div>
    </div>
  );
}
