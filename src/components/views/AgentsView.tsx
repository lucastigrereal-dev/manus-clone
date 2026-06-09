"use client";

import React, { useState } from "react";

const platforms = [
  { name: "Telegram", status: "active", color: "#0088cc" },
  { name: "LINE", status: "active", color: "#06c755" },
  { name: "Slack", status: "active", color: "#4a154b" },
  { name: "WhatsApp", status: "soon", color: "#25d366" },
  { name: "Messenger", status: "soon", color: "#0084ff" },
];

const features = [
  { icon: "🪪", title: "Identidade de IA consistente com a marca", desc: "Treinado em seus fluxos de trabalho e integrado às suas ferramentas." },
  { icon: "🖥️", title: "Memória persistente e computador", desc: "Assistente na nuvem 24/7 que mantém todo o contexto e memória." },
  { icon: "🧩", title: "Habilidades personalizadas", desc: "Equipe seu assistente com conhecimento especializado em áreas específicas." },
  { icon: "💬", title: "Funciona no seu mensageiro", desc: "Disponível no Telegram, Line e Slack. Mais plataformas em breve." },
];

export default function AgentsView() {
  const [showStart, setShowStart] = useState(false);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
          Implante seu agente para{" "}
          <span className="italic font-serif">negócios</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {features.map((feature) => (
          <div key={feature.title} className="p-5 rounded-xl border" style={{ borderColor: "var(--border-main)", backgroundColor: "var(--background-menu-white)" }}>
            <div className="text-2xl mb-3">{feature.icon}</div>
            <div className="text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>{feature.title}</div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-tertiary)" }}>{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <div className="text-sm font-medium mb-3" style={{ color: "var(--text-primary)" }}>Plataformas</div>
        <div className="flex flex-wrap gap-3">
          {platforms.map((platform) => (
            <div
              key={platform.name}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border"
              style={{
                borderColor: platform.status === "soon" ? "var(--border-main)" : platform.color + "40",
                backgroundColor: platform.status === "soon" ? "var(--background-gray-main)" : platform.color + "10",
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: platform.color }} />
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{platform.name}</span>
              {platform.status === "soon" && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-500">Em breve</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => setShowStart(true)}
          className="px-8 py-3 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: "var(--Button-black)" }}
        >
          Começar
        </button>
      </div>

      {/* Start Modal */}
      {showStart && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowStart(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="w-full max-w-md rounded-2xl shadow-2xl p-6"
              style={{
                backgroundColor: "var(--background-menu-white)",
                border: "1px solid var(--border-main)",
              }}
            >
              <h3 className="text-lg font-semibold mb-4 text-center" style={{ color: "var(--text-primary)" }}>Escolha uma plataforma</h3>
              <div className="space-y-2">
                {platforms.filter((p) => p.status === "active").map((platform) => (
                  <button
                    key={platform.name}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors hover:bg-neutral-50 text-left"
                    style={{ borderColor: "var(--border-main)" }}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg" style={{ backgroundColor: platform.color }}>
                      {platform.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{platform.name}</div>
                      <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>Clique para conectar</div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowStart(false)}
                className="w-full mt-4 py-2.5 rounded-lg text-sm font-medium border transition-colors hover:bg-neutral-50"
                style={{ borderColor: "var(--border-main)", color: "var(--text-primary)" }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
