"use client";

import React, { useState } from "react";
import { useUiStore } from "@/stores/uiStore";

interface QuickActionsProps {
  onSelect: (mode: string) => void;
  selectedMode: string | null;
}

const actions = [
  { id: "content", label: "Criar conteúdo", icon: "✍️" },
  { id: "instagram", label: "Analisar Instagram", icon: "📸" },
  { id: "dev", label: "Desenvolver app", icon: "💻" },
  { id: "automation", label: "Criar automação", icon: "⚡" },
];

const moreActions = [
  { id: "research", label: "Pesquisar mercado", icon: "🔍" },
  { id: "report", label: "Gerar relatório", icon: "📊" },
  { id: "scheduled", label: "Automações agendadas", icon: "📅" },
  { id: "chat", label: "Modo chat puro", icon: "💬" },
];

export default function QuickActions({ onSelect, selectedMode }: QuickActionsProps) {
  const [showMore, setShowMore] = useState(false);
  const quickActionUsage = useUiStore((s) => s.quickActionUsage);
  const trackQuickAction = useUiStore((s) => s.trackQuickAction);

  // Sort primary actions by usage count descending, preserving original order for ties
  const sortedActions = [...actions].sort(
    (a, b) => (quickActionUsage[b.id] ?? 0) - (quickActionUsage[a.id] ?? 0)
  );

  const handleSelect = (id: string) => {
    trackQuickAction(id);
    onSelect(id);
  };

  return (
    <div className="mt-4 flex flex-wrap justify-center items-center gap-2">
      {sortedActions.map((action) => {
        const count = quickActionUsage[action.id] ?? 0;
        return (
          <div key={action.id} className="relative">
            <button
              onClick={() => handleSelect(action.id)}
              className={`h-10 flex items-center gap-2 px-[14px] py-[7px] rounded-full border transition-all flex-shrink-0 ${
                selectedMode === action.id
                  ? "bg-neutral-100 border-neutral-300"
                  : "hover:bg-neutral-50"
              }`}
              style={{
                borderColor: "var(--border-main)",
                color: "var(--text-secondary)",
                fontSize: "14px",
              }}
            >
              <span>{action.icon}</span>
              <span className="font-medium">{action.label}</span>
            </button>
            {count > 0 && (
              <span
                className="absolute -top-1 -right-1 text-[9px] w-4 h-4 rounded-full flex items-center justify-center pointer-events-none"
                style={{
                  backgroundColor: "rgba(0,0,0,0.1)",
                  color: "var(--text-secondary)",
                }}
              >
                {count > 99 ? "99" : count}
              </span>
            )}
          </div>
        );
      })}

      {/* More Button */}
      <div className="relative">
        <button
          onClick={() => setShowMore(!showMore)}
          className="h-10 flex items-center gap-2 px-[14px] py-[7px] rounded-full border transition-all hover:bg-neutral-50"
          style={{
            borderColor: "var(--border-main)",
            color: "var(--text-secondary)",
            fontSize: "14px",
          }}
        >
          <span className="font-medium">Mais</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {showMore && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowMore(false)} />
            <div
              className="absolute z-50 mt-2 w-64 rounded-xl shadow-lg py-2"
              style={{
                backgroundColor: "var(--background-menu-white)",
                border: "1px solid var(--border-main)",
                bottom: "100%",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              {moreActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => {
                    handleSelect(action.id);
                    setShowMore(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-neutral-50 transition-colors"
                  style={{ color: "var(--text-primary)" }}
                >
                  <span className="text-lg">{action.icon}</span>
                  <span>{action.label}</span>
                  {(quickActionUsage[action.id] ?? 0) > 0 && (
                    <span
                      className="ml-auto text-[9px] w-4 h-4 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: "rgba(0,0,0,0.08)",
                        color: "var(--text-tertiary)",
                      }}
                    >
                      {quickActionUsage[action.id]}
                    </span>
                  )}
                </button>
              ))}
              <div className="h-px mx-4 my-1" style={{ backgroundColor: "var(--border-main)" }} />
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-neutral-50 transition-colors"
                style={{ color: "var(--text-primary)" }}
              >
                <span>📖</span>
                <span>Playbook</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-auto">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
