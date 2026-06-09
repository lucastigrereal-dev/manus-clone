"use client";

import React from "react";

export interface TaskStatsData {
  credits: number;
  timeWorked: string;
  pagesViewed: number;
  commandsExecuted: number;
  apiCalls: number;
  filesCreated: number;
}

interface TaskStatsProps {
  isOpen: boolean;
  onClose: () => void;
  stats: TaskStatsData;
}

export default function TaskStats({ isOpen, onClose, stats }: TaskStatsProps) {
  if (!isOpen) return null;

  const items = [
    { icon: "✦", label: "Créditos utilizados", value: stats.credits.toLocaleString("pt-BR") },
    { icon: "⏱️", label: "Tempo trabalhado", value: stats.timeWorked },
    { icon: "📄", label: "Páginas visualizadas", value: stats.pagesViewed.toLocaleString("pt-BR") },
    { icon: "⌨️", label: "Comandos executados", value: stats.commandsExecuted.toLocaleString("pt-BR") },
    { icon: "🔌", label: "API chamada", value: stats.apiCalls.toLocaleString("pt-BR") },
    { icon: "📁", label: "Arquivos criados", value: stats.filesCreated.toLocaleString("pt-BR") },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-lg rounded-2xl shadow-2xl"
          style={{
            backgroundColor: "var(--background-menu-white)",
            border: "1px solid var(--border-main)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: "var(--border-main)" }}
          >
            <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              Estatísticas da tarefa
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
              style={{ color: "var(--text-tertiary)" }}
              aria-label="Fechar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Metrics grid */}
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {items.map((item) => (
                <div
                  key={item.label}
                  className="p-4 rounded-xl border"
                  style={{
                    backgroundColor: "var(--background-gray-main)",
                    borderColor: "var(--border-light)",
                  }}
                >
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div className="text-xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                    {item.value}
                  </div>
                  <div className="text-[11px] leading-tight" style={{ color: "var(--text-tertiary)" }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
