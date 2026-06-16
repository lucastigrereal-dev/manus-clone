"use client";

import React, { useState } from "react";
import { useUiStore, MissionTab } from "@/stores/uiStore";

function StatusDot({ status }: { status: MissionTab["status"] }) {
  if (status === "idle") return null;

  const base = "w-2 h-2 rounded-full flex-shrink-0";

  if (status === "running") {
    return (
      <span
        className={`${base} animate-pulse`}
        style={{ backgroundColor: "#f59e0b" }}
        aria-label="em execução"
      />
    );
  }
  if (status === "done") {
    return (
      <span
        className={base}
        style={{ backgroundColor: "#10b981" }}
        aria-label="concluída"
      />
    );
  }
  if (status === "error") {
    return (
      <span
        className={base}
        style={{ backgroundColor: "#ef4444" }}
        aria-label="erro"
      />
    );
  }
  return null;
}

export default function MissionTabs() {
  const missionTabs = useUiStore((s) => s.missionTabs);
  const activeTabId = useUiStore((s) => s.activeTabId);
  const addTab = useUiStore((s) => s.addTab);
  const removeTab = useUiStore((s) => s.removeTab);
  const setActiveTab = useUiStore((s) => s.setActiveTab);

  const [hoveredTabId, setHoveredTabId] = useState<string | null>(null);

  const canClose = missionTabs.length >= 2;

  return (
    <div
      className="flex items-center"
      style={{
        borderBottom: "1px solid var(--border-main)",
        backgroundColor: "var(--background-menu-white)",
        overflowX: "auto",
      }}
    >
      {missionTabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const isHovered = hoveredTabId === tab.id;

        return (
          <div
            key={tab.id}
            className="relative flex items-center gap-1.5 px-4 py-2 text-sm cursor-pointer select-none flex-shrink-0 transition-colors"
            style={{
              color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
              fontWeight: isActive ? 500 : 400,
              borderBottom: isActive
                ? "2px solid var(--Button-black)"
                : "2px solid transparent",
              marginBottom: "-1px",
            }}
            onClick={() => setActiveTab(tab.id)}
            onMouseEnter={() => setHoveredTabId(tab.id)}
            onMouseLeave={() => setHoveredTabId(null)}
          >
            <StatusDot status={tab.status} />
            <span className="max-w-[120px] truncate">{tab.title}</span>

            {/* Close button — only on hover and only if 2+ tabs */}
            {canClose && isHovered && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeTab(tab.id);
                }}
                className="ml-1 flex-shrink-0 flex items-center justify-center w-4 h-4 rounded transition-colors hover:bg-neutral-200"
                style={{ color: "var(--text-tertiary)" }}
                aria-label={`Fechar aba ${tab.title}`}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <line x1="1" y1="1" x2="9" y2="9" />
                  <line x1="9" y1="1" x2="1" y2="9" />
                </svg>
              </button>
            )}
            {/* Placeholder to maintain width when close button is hidden */}
            {canClose && !isHovered && <span className="ml-1 w-4 h-4 flex-shrink-0" />}
          </div>
        );
      })}

      {/* Add tab button */}
      <button
        onClick={addTab}
        className="flex-shrink-0 px-3 py-2 text-sm transition-colors hover:bg-neutral-100"
        style={{ color: "var(--text-tertiary)" }}
        aria-label="Nova aba de missão"
        title="Nova aba"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <line x1="7" y1="1" x2="7" y2="13" />
          <line x1="1" y1="7" x2="13" y2="7" />
        </svg>
      </button>
    </div>
  );
}
