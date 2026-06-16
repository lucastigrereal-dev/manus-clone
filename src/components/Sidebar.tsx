"use client";

import React, { useEffect, useState } from "react";
import MissionHistory from "@/components/MissionHistory";

interface Project {
  id: string
  name: string
  status: 'active' | 'done' | 'failed' | 'unknown'
  factory?: string
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: string;
  onNavChange: (nav: string) => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
}

const navItems = [
  { id: "new-task", label: "Nova missão", icon: "✏️", view: "home" },
  { id: "agents", label: "Agentes", icon: "🤖", view: "agents" },
  { id: "skills", label: "Skills", icon: "🧩", view: "plugins" },
  { id: "automations", label: "Automações", icon: "⚡", view: "scheduled" },
  { id: "library", label: "Biblioteca", icon: "📚", view: "library" },
  { id: "canvas", label: "Canvas", icon: "🔮", view: "canvas" },
  { id: "factory-os", label: "Factory OS", icon: "🏭", view: "factory-os" },
];

const engineNav = { id: "engine", label: "Motor", icon: "🔧", view: "engine" };

export default function Sidebar({ isOpen, onClose, activeView, onNavChange, onProfileClick, onSettingsClick }: SidebarProps) {
  const [projects, setProjects] = useState<Project[]>([
    { id: 'fam-tigre', name: 'Família Tigre Travel 2026', status: 'active' },
    { id: 'publisher-os', name: 'Publisher OS', status: 'active' },
    { id: 'app-factory', name: 'App Factory v3.1', status: 'active' },
    { id: 'lead-mining', name: 'Lead Mining Engine', status: 'active' },
    { id: 'omnisverso', name: 'OMNISVERSO Runtime', status: 'active' },
  ])
  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length) setProjects(data) })
      .catch(() => undefined)
  }, [])

  return (
    <aside
      className={`fixed md:relative z-50 h-full w-[260px] flex flex-col transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
      style={{
        backgroundColor: "var(--background-menu-white)",
        borderRight: "1px solid var(--border-main)",
      }}
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: "var(--Button-black)" }}>
          ◐
        </div>
        <div>
          <span className="font-semibold text-lg leading-tight" style={{ color: "var(--text-primary)" }}>Aurora</span>
          <span className="block text-[10px] -mt-0.5 font-medium tracking-wider uppercase" style={{ color: "var(--text-tertiary)" }}>OMNIS Calm Shell</span>
        </div>
      </div>

      <nav className="flex-1 px-2 py-2 overflow-y-auto">
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  onNavChange(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                  activeView === item.view ? "bg-neutral-100" : "hover:bg-neutral-50"
                }`}
                style={{ color: activeView === item.view ? "var(--text-primary)" : "var(--text-secondary)" }}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
          {/* Motor (Painel Técnico) */}
          <li className="mt-2 pt-2 border-t" style={{ borderColor: "var(--border-main)" }}>
            <button
              onClick={() => {
                onNavChange(engineNav.id);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                activeView === engineNav.view ? "bg-neutral-100" : "hover:bg-neutral-50"
              }`}
              style={{ color: activeView === engineNav.view ? "var(--text-primary)" : "var(--text-disable)" }}
              title="Painel Técnico OMNIS"
            >
              <span className="text-lg">{engineNav.icon}</span>
              <span className="text-xs tracking-wide uppercase">{engineNav.label}</span>
            </button>
          </li>
        </ul>

        <div className="mt-4 px-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-disable)" }}>Projetos</span>
            <button className="p-1 rounded hover:bg-neutral-100 transition-colors" style={{ color: "var(--text-tertiary)" }}>+</button>
          </div>
          <ul className="space-y-0.5">
            {projects.map((p) => (
              <li key={p.id}>
                <button className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors hover:bg-neutral-50 text-left" style={{ color: "var(--text-secondary)" }}>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${p.status === 'active' ? 'bg-emerald-400' : p.status === 'failed' ? 'bg-red-400' : 'bg-gray-400'}`} />
                  <span className="truncate">{p.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 px-3">
          <span className="text-xs font-semibold uppercase tracking-wider px-3 mb-1 block" style={{ color: "var(--text-disable)" }}>
            Missões Recentes
          </span>
          <MissionHistory />
        </div>
      </nav>

      <div className="p-3 border-t" style={{ borderColor: "var(--border-main)" }}>
        <div
          className="mb-3 p-3 rounded-xl text-sm cursor-pointer transition-colors hover:opacity-90"
          style={{ backgroundColor: "var(--background-gray-main)" }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span>⚡</span>
            <span className="font-medium" style={{ color: "var(--text-primary)" }}>Status OMNIS</span>
          </div>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>Runtime conectado · 5 agentes ativos</p>
        </div>

        <button
          onClick={onProfileClick}
          className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-neutral-50 transition-colors mb-1"
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{ backgroundColor: "#10b981" }}>
            L
          </div>
          <div className="text-left">
            <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Lucas Tigre</div>
            <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>OMNIS Pro · @lucastigrereal</div>
          </div>
        </button>

        <button
          onClick={onSettingsClick}
          className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-neutral-50 transition-colors text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          <span>⚙️</span>
          <span>Configurações</span>
        </button>
      </div>
    </aside>
  );
}
