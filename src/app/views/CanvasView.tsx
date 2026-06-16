"use client";

import React from "react";
import MissionCanvas from "@/components/MissionCanvas";

export default function CanvasView() {
  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
          Mission Canvas
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Arraste agentes para planejar fluxos de missão
        </p>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{
          border: "1px solid var(--border-main)",
          backgroundColor: "var(--background-menu-white)",
        }}
      >
        <MissionCanvas />
      </div>
    </div>
  );
}
