"use client";

import React, { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import HealthHeader from "@/components/HealthHeader";
import { useUiStore } from "@/stores/uiStore";

interface HeaderProps {
  onMenuToggle: () => void;
  onSparkleClick?: () => void;
}

export default function Header({ onMenuToggle, onSparkleClick }: HeaderProps) {
  const [versionOpen, setVersionOpen] = useState(false);
  const setCommandPaletteOpen = useUiStore((s) => s.setCommandPaletteOpen);

  return (
    <header className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: "1px solid var(--border-main)" }}>
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg hover:bg-neutral-100 transition-colors md:hidden"
          style={{ color: "var(--text-primary)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <button
          onClick={() => setVersionOpen(!versionOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-neutral-100 transition-colors"
          style={{ color: "var(--text-primary)" }}
        >
          <span>Aurora ▾</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <HealthHeader />
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-colors hover:bg-neutral-100"
          style={{ color: "var(--text-tertiary)", border: "1px solid var(--border-main)" }}
          title="Abrir paleta de comandos (Ctrl+K)"
        >
          ⌘K
        </button>
        <ThemeToggle />
        <button
          onClick={onSparkleClick}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
          style={{ color: "var(--text-primary)" }}
          title="Créditos"
        >
          ✦
        </button>
      </div>

      {versionOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setVersionOpen(false)} />
          <div
            className="absolute z-50 mt-1 w-56 rounded-xl shadow-lg py-1"
            style={{
              backgroundColor: "var(--background-menu-white)",
              border: "1px solid var(--border-main)",
              top: "48px",
              left: "60px",
            }}
          >
            {[
              { label: "Aurora (Geral)", desc: "Copiloto principal · OMNIS Calm Shell", active: true },
              { label: "Hermes (Pesquisa)", desc: "Deep research · Lead mining · Mercado" },
              { label: "Vulcano (Dev)", desc: "App Factory · Automações · Código" },
              { label: "Muse (Criativo)", desc: "Conteúdo · Instagram · Copy · Design" },
            ].map((model) => (
              <button
                key={model.label}
                className="w-full px-4 py-3 text-left hover:bg-neutral-50 transition-colors"
                onClick={() => setVersionOpen(false)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{model.label}</span>
                  {model.active && <span className="text-green-500 text-xs">✓</span>}
                </div>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{model.desc}</p>
              </button>
            ))}
          </div>
        </>
      )}
    </header>
  );
}
