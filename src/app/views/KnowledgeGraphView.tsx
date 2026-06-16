"use client";

import React from "react";
import KnowledgeGraph from "@/components/KnowledgeGraph";

export default function KnowledgeGraphView() {
  return (
    <div className="h-full overflow-y-auto p-6" style={{ backgroundColor: "var(--background-gray-main)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Grafo de Conhecimento
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
            Entidades e relações temporais do AKASHA (Graphiti)
          </p>
        </div>
        <div
          className="p-4 rounded-xl"
          style={{
            backgroundColor: "var(--background-menu-white)",
            border: "1px solid var(--border-main)",
          }}
        >
          <KnowledgeGraph />
        </div>
      </div>
    </div>
  );
}
