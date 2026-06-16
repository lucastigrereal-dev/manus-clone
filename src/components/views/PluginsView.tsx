"use client";

import React, { useState } from "react";
import PluginMarketplace from "@/components/PluginMarketplace";

const connectors = [
  { name: "Gmail", desc: "Redija respostas, pesquise e resuma e-mails", status: "connect" },
  { name: "Instagram", desc: "Gere e publique Posts, Stories ou Reels", status: "beta", badge: "Beta" },
  { name: "Google Drive", desc: "Acesse arquivos, pesquisa instantânea", status: "connect" },
  { name: "Meta Ads Manager", desc: "Insights e otimização de anúncios", status: "beta", badge: "Beta" },
  { name: "GitHub", desc: "Repositórios e código", status: "connected" },
  { name: "Meu Navegador", desc: "Execute tarefas complexas com segurança", status: "connected" },
];

const skills = [
  { name: "github-gem-seeker", desc: "Busca no GitHub por soluções open source", verified: true },
  { name: "internet-skill-finder", desc: "Pesquisa habilidades em repositórios", verified: true },
  { name: "html-video-production", desc: "Produção de vídeos HTML + GSAP", verified: true },
  { name: "manim-animator", desc: "Animações matemáticas com Manim", verified: true },
];

export default function PluginsView() {
  const [activeTab, setActiveTab] = useState("connectors");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>Plugins</h1>
        <button className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: "var(--Button-black)" }}>Criar ▼</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-lg w-fit" style={{ backgroundColor: "var(--background-gray-main)" }}>
        {[
          { id: "connectors", label: "Conectores" },
          { id: "skills", label: "Habilidades" },
          { id: "data", label: "Fontes de dados" },
          { id: "marketplace", label: "Marketplace" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id ? "bg-white shadow-sm" : "hover:bg-white/50"
            }`}
            style={{ color: activeTab === tab.id ? "var(--text-primary)" : "var(--text-secondary)" }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Pesquisar conectores, habilidades, fontes de dados..."
          className="w-full max-w-md px-4 py-2.5 rounded-lg border text-sm outline-none focus:border-neutral-400 transition-colors"
          style={{ borderColor: "var(--border-main)", color: "var(--text-primary)", backgroundColor: "var(--background-menu-white)" }}
        />
      </div>

      {/* Content */}
      {activeTab === "connectors" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {connectors.map((item) => (
            <div key={item.name} className="p-4 rounded-xl border transition-colors hover:border-neutral-300" style={{ borderColor: "var(--border-main)", backgroundColor: "var(--background-menu-white)" }}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: "var(--background-gray-main)" }}>
                    {item.name === "Gmail" && "📧"}
                    {item.name === "Instagram" && "📸"}
                    {item.name === "Google Drive" && "🟢"}
                    {item.name === "Meta Ads Manager" && "📊"}
                    {item.name === "GitHub" && "🐙"}
                    {item.name === "Meu Navegador" && "🌐"}
                  </div>
                  <div>
                    <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{item.name}</div>
                    {item.badge && <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-500">{item.badge}</span>}
                  </div>
                </div>
                <button
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    item.status === "connected"
                      ? "bg-green-100 text-green-700"
                      : "border hover:bg-neutral-50"
                  }`}
                  style={item.status !== "connected" ? { borderColor: "var(--border-main)", color: "var(--text-primary)" } : {}}
                >
                  {item.status === "connected" ? "✓ Conectado" : "+ Conectar"}
                </button>
              </div>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "skills" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {skills.map((item) => (
            <div key={item.name} className="p-4 rounded-xl border" style={{ borderColor: "var(--border-main)", backgroundColor: "var(--background-menu-white)" }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{item.name}</div>
                {item.verified && <span className="text-green-500 text-xs">✓</span>}
              </div>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "data" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { name: "DataBank", desc: "Indicadores de desenvolvimento global e macroeconomia" },
            { name: "Similarweb", desc: "Análise de tráfego, audiência e concorrentes" },
          ].map((item) => (
            <div key={item.name} className="p-4 rounded-xl border" style={{ borderColor: "var(--border-main)", backgroundColor: "var(--background-menu-white)" }}>
              <div className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>{item.name}</div>
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "marketplace" && <PluginMarketplace />}
    </div>
  );
}
