"use client";

import React, { useState } from "react";

const files = [
  { name: "KRATOS — Fase 0: Síntese Pré-Implementação", type: "skill", date: "18/05/2026", project: "Skill Creation Request" },
  { name: "kratos-mission-control-frontend-architect.skill", type: "skill-file", date: "18/05/2026", project: "Skill Creation Request" },
  { name: "Monetização Turística — Águas de São Pedro", type: "doc", date: "18/05/2026", project: "Passeios turísticos" },
  { name: "MEGA_PLANO_OBSESSIVO_FEYNMAN.md", type: "markdown", date: "16/05/2026", project: "Plano de negócios" },
  { name: "gerador_dashboard_tigrao.py", type: "code", date: "15/05/2026", project: "Dashboard" },
  { name: "KRATOS_FINAL_PACKAGE.zip", type: "zip", date: "13/05/2026", project: "KRATOS" },
];

export default function LibraryView() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>Biblioteca</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-neutral-100" : "hover:bg-neutral-50"}`}
            style={{ color: "var(--text-secondary)" }}
          >
            ⊞
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-neutral-100" : "hover:bg-neutral-50"}`}
            style={{ color: "var(--text-secondary)" }}
          >
            ☰
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar arquivos"
          className="flex-1 max-w-md px-4 py-2.5 rounded-lg border text-sm outline-none focus:border-neutral-400"
          style={{ borderColor: "var(--border-main)", color: "var(--text-primary)", backgroundColor: "var(--background-menu-white)" }}
        />
        <button className="p-2.5 rounded-lg border transition-colors hover:bg-neutral-50" style={{ borderColor: "var(--border-main)", color: "var(--text-secondary)" }}>⚙</button>
        <button className="p-2.5 rounded-lg border transition-colors hover:bg-neutral-50" style={{ borderColor: "var(--border-main)", color: "var(--text-secondary)" }}>★</button>
      </div>

      <div className="space-y-1">
        {files.map((file) => (
          <button
            key={file.name}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors hover:bg-neutral-100"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--background-gray-main)" }}>
              {file.type === "skill" && "🧩"}
              {file.type === "skill-file" && "📄"}
              {file.type === "doc" && "📄"}
              {file.type === "markdown" && "📝"}
              {file.type === "code" && "💻"}
              {file.type === "zip" && "🗜"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{file.name}</div>
              <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{file.project} • {file.date}</div>
            </div>
            <button className="p-1.5 rounded-lg hover:bg-neutral-200 transition-colors" style={{ color: "var(--text-tertiary)" }}>⋯</button>
          </button>
        ))}
      </div>
    </div>
  );
}
