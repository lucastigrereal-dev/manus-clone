"use client";

import "@xyflow/react/dist/style.css";
import React, { useState, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  NodeMouseHandler,
} from "@xyflow/react";

const MOCK_NODES: Node[] = [
  {
    id: "e1",
    position: { x: 200, y: 150 },
    data: { label: "Lucas Tigre\n[Person]" },
    style: {
      background: "rgba(99,102,241,0.15)",
      border: "1px solid rgba(99,102,241,0.4)",
      borderRadius: "8px",
      fontSize: "11px",
      whiteSpace: "pre-line",
    },
  },
  {
    id: "e2",
    position: { x: 450, y: 80 },
    data: { label: "Família Tigre Travel\n[Project]" },
    style: {
      background: "rgba(16,185,129,0.15)",
      border: "1px solid rgba(16,185,129,0.4)",
      borderRadius: "8px",
      fontSize: "11px",
      whiteSpace: "pre-line",
    },
  },
  {
    id: "e3",
    position: { x: 450, y: 220 },
    data: { label: "Publisher OS\n[Project]" },
    style: {
      background: "rgba(16,185,129,0.15)",
      border: "1px solid rgba(16,185,129,0.4)",
      borderRadius: "8px",
      fontSize: "11px",
      whiteSpace: "pre-line",
    },
  },
  {
    id: "e4",
    position: { x: 700, y: 150 },
    data: { label: "Instagram\n[Platform]" },
    style: {
      background: "rgba(245,158,11,0.15)",
      border: "1px solid rgba(245,158,11,0.4)",
      borderRadius: "8px",
      fontSize: "11px",
      whiteSpace: "pre-line",
    },
  },
  {
    id: "e5",
    position: { x: 200, y: 300 },
    data: { label: "OMNIS Core\n[System]" },
    style: {
      background: "rgba(239,68,68,0.15)",
      border: "1px solid rgba(239,68,68,0.4)",
      borderRadius: "8px",
      fontSize: "11px",
      whiteSpace: "pre-line",
    },
  },
  {
    id: "e6",
    position: { x: 450, y: 350 },
    data: { label: "AKASHA\n[Memory]" },
    style: {
      background: "rgba(139,92,246,0.15)",
      border: "1px solid rgba(139,92,246,0.4)",
      borderRadius: "8px",
      fontSize: "11px",
      whiteSpace: "pre-line",
    },
  },
];

const MOCK_EDGES: Edge[] = [
  { id: "r1", source: "e1", target: "e2", label: "owns", animated: true },
  { id: "r2", source: "e1", target: "e3", label: "manages" },
  { id: "r3", source: "e2", target: "e4", label: "uses" },
  { id: "r4", source: "e3", target: "e4", label: "publishes_to" },
  { id: "r5", source: "e5", target: "e6", label: "stores_in" },
  { id: "r6", source: "e1", target: "e5", label: "operates" },
];

const MOCK_TIMESTAMPS: Record<string, string> = {
  e1: "2026-06-16 14:32",
  e2: "2026-06-15 09:10",
  e3: "2026-06-14 18:45",
  e4: "2026-06-13 11:22",
  e5: "2026-06-16 08:05",
  e6: "2026-06-16 12:50",
};

interface SelectedNode {
  id: string;
  label: string;
  type: string;
  lastUpdated: string;
}

export default function KnowledgeGraph() {
  const [selected, setSelected] = useState<SelectedNode | null>(null);

  const onNodeClick: NodeMouseHandler = useCallback((_evt, node) => {
    const raw = String(node.data?.label ?? "");
    const parts = raw.split("\n");
    const name = parts[0] ?? raw;
    const type = parts[1]?.replace(/[\[\]]/g, "") ?? "Entity";
    setSelected({
      id: node.id,
      label: name,
      type,
      lastUpdated: MOCK_TIMESTAMPS[node.id] ?? "—",
    });
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <h3
        className="text-sm font-semibold mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        Knowledge Graph AKASHA
      </h3>
      <div style={{ width: "100%", height: "460px", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border-main)" }}>
        <ReactFlow
          nodes={MOCK_NODES}
          edges={MOCK_EDGES}
          onNodeClick={onNodeClick}
          fitView
        >
          <Background color="rgba(120,120,120,0.2)" gap={16} />
          <Controls />
          <MiniMap
            nodeColor={(n) => {
              const style = n.style as React.CSSProperties | undefined;
              const bg = style?.background as string | undefined;
              if (bg?.includes("99,102,241")) return "rgba(99,102,241,0.5)";
              if (bg?.includes("16,185,129")) return "rgba(16,185,129,0.5)";
              if (bg?.includes("245,158,11")) return "rgba(245,158,11,0.5)";
              if (bg?.includes("239,68,68")) return "rgba(239,68,68,0.5)";
              if (bg?.includes("139,92,246")) return "rgba(139,92,246,0.5)";
              return "rgba(120,120,120,0.3)";
            }}
          />
        </ReactFlow>
      </div>

      {selected && (
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "16px",
            padding: "12px 16px",
            borderRadius: "10px",
            backgroundColor: "var(--background-menu-white)",
            border: "1px solid var(--border-dark)",
            minWidth: "180px",
            zIndex: 10,
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div
                className="text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {selected.label}
              </div>
              <div
                className="text-xs mt-0.5"
                style={{ color: "var(--text-secondary)" }}
              >
                {selected.type}
              </div>
              <div
                className="text-[11px] mt-1"
                style={{ color: "var(--text-tertiary)" }}
              >
                Atualizado: {selected.lastUpdated}
              </div>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-xs"
              style={{ color: "var(--text-tertiary)" }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
