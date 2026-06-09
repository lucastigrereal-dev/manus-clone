"use client";

import React from "react";

const tasks = [
  {
    id: "1",
    title: "Análise Instagram @agenteviaja — últimos 28 dias",
    date: "08/06/2026",
    type: "instagram",
    status: "completed",
  },
  {
    id: "2",
    title: "Gerar carrossel 'O que fazer em Natal' — 10 slides",
    date: "08/06/2026",
    type: "content",
    status: "in-progress",
  },
  {
    id: "3",
    title: "Lead Mining: pousadas em Natal (teste real Playwright)",
    date: "07/06/2026",
    type: "research",
    status: "completed",
  },
  {
    id: "4",
    title: "App Factory v3.1 — Fase 3 DB+Auth+Fetch (smoke tests)",
    date: "07/06/2026",
    type: "dev",
    status: "completed",
  },
  {
    id: "5",
    title: "Relatório semanal OMNIS — Instagram + Leads + Dev",
    date: "06/06/2026",
    type: "report",
    status: "completed",
  },
];

export default function TaskList() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Missões recentes</h3>
        <button className="text-xs font-medium hover:underline" style={{ color: "var(--text-tertiary)" }}>Ver todas</button>
      </div>

      <div className="space-y-1">
        {tasks.map((task) => (
          <button
            key={task.id}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors hover:bg-neutral-100"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
              style={{ backgroundColor: "var(--background-gray-main)" }}
            >
              {task.type === "instagram" && "📸"}
              {task.type === "content" && "✍️"}
              {task.type === "research" && "🔍"}
              {task.type === "dev" && "💻"}
              {task.type === "report" && "📊"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{task.title}</div>
              <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{task.date}</div>
            </div>
            <div className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
              style={{
                backgroundColor: task.status === "in-progress" ? "#fef3c7" : "var(--background-gray-main)",
                color: task.status === "in-progress" ? "#92400e" : "var(--text-secondary)",
              }}
            >
              {task.status === "in-progress" ? "Em andamento" : "Concluído"}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
