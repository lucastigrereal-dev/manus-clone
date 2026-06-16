"use client";

import React, { useState } from "react";
import EconomicDashboard from "@/components/EconomicDashboard";
import AutopilotAgenda from "@/components/AutopilotAgenda";
import MCPServerPanel from "@/components/MCPServerPanel";
import OperatorsPanel from "@/components/OperatorsPanel";
import CLIView from "@/components/CLIView";

const tabs = [
  { id: "agents", label: "Agentes & Modelos" },
  { id: "integrations", label: "Integrações" },
  { id: "executions", label: "Execuções & Filas" },
  { id: "logs", label: "Logs & Eventos" },
  { id: "costs", label: "Custos & Créditos" },
  { id: "security", label: "Permissões & Segurança" },
];

const agents = [
  { name: "Aurora", role: "Geral / Copiloto principal", model: "Claude 4.X", status: "ativo", mission: "Home / Shell", risk: "baixo" },
  { name: "Hermes", role: "Pesquisa / Lead Mining", model: "DeepSeek v4-pro", status: "ativo", mission: "Análise Instagram @agenteviaja", risk: "baixo" },
  { name: "Vulcano", role: "Dev / App Factory", model: "Qwen2.5-coder:7b", status: "ocioso", mission: "—", risk: "médio" },
  { name: "Muse", role: "Criativo / Conteúdo", model: "Gemini 2.5 Flash", status: "ativo", mission: "Carrossel Natal 10 slides", risk: "baixo" },
];

const integrations = [
  { name: "Notion", type: "Memória / Quadro", status: "conectado", lastSync: "2 min atrás" },
  { name: "Akasha / Caixa", type: "Knowledge base", status: "conectado", lastSync: "5 min atrás" },
  { name: "GitHub", type: "Repositórios", status: "conectado", lastSync: "1h atrás" },
  { name: "Instagram API", type: "Social / 6 contas", status: "conectado", lastSync: "15 min atrás" },
  { name: "n8n", type: "Automação", status: "conectado", lastSync: "30 min atrás" },
  { name: "Supabase Hotels", type: "Database", status: "conectado", lastSync: "10 min atrás" },
  { name: "Publisher OS", type: "Sistema legado", status: "conectado", lastSync: "1h atrás" },
  { name: "OMNIS Bus", type: "Event streaming", status: "conectado", lastSync: "agora" },
];

const executions = [
  { id: "run-8a9f", name: "Análise Instagram @agenteviaja", agent: "Hermes", status: "concluído", duration: "2m 14s", credits: 12 },
  { id: "run-7b2e", name: "Smoke tests App Factory Fase 3", agent: "Vulcano", status: "concluído", duration: "4m 31s", credits: 28 },
  { id: "run-6c1d", name: "Lead Mining — pousadas Natal", agent: "Hermes", status: "concluído", duration: "8m 07s", credits: 45 },
  { id: "run-5a0b", name: "Carrossel Natal 10 slides", agent: "Muse", status: "em andamento", duration: "1m 22s", credits: 8 },
];

const logs = [
  { time: "14:32:05", level: "info", message: "Missão #run-5a0b iniciada por Muse · Modelo: Gemini 2.5 Flash" },
  { time: "14:28:11", level: "success", message: "Missão #run-8a9f concluída · Artefato: relatório_instagram_28d.json" },
  { time: "14:15:33", level: "info", message: "Aprovação humana concedida · Arquivos: 3 editados, 0 deletados" },
  { time: "14:15:30", level: "warning", message: "Ação sensível detectada · Escrita em /src/app/page.tsx" },
  { time: "13:58:42", level: "info", message: "Integração Akasha sincronizada · 420 eventos processados" },
  { time: "13:45:10", level: "error", message: "Timeout KRATOS backend · Porta 5100 · Retry 2/3" },
];

const costData = [
  { model: "Claude 4.X", usage: "R$ 4,20", percent: 35, color: "#10b981" },
  { model: "DeepSeek v4-pro", usage: "R$ 3,15", percent: 26, color: "#3b82f6" },
  { model: "Gemini 2.5 Flash", usage: "R$ 2,80", percent: 23, color: "#f59e0b" },
  { model: "Qwen2.5-coder", usage: "R$ 1,90", percent: 16, color: "#8b5cf6" },
];

function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors mb-2"
        style={{
          backgroundColor: "var(--background-menu-white)",
          border: "1px solid var(--border-main)",
          color: "var(--text-primary)",
        }}
      >
        <span>{title}</span>
        <svg
          className="w-4 h-4 transition-transform"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            color: "var(--text-tertiary)",
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && children}
    </div>
  );
}

export default function EngineView() {
  const [activeTab, setActiveTab] = useState("agents");

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: "var(--background-gray-main)" }}>
      {/* Header */}
      <div className="px-6 py-4 border-b" style={{ borderColor: "var(--border-main)", backgroundColor: "var(--background-menu-white)" }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Painel Técnico</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>OMNIS Core · Runtime · Agentes · Custos · Logs</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: "#d1fae5", color: "#065f46" }}>● Online</span>
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>5 agentes · 8 integrações</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id ? "bg-neutral-100" : "hover:bg-neutral-50"
              }`}
              style={{ color: activeTab === tab.id ? "var(--text-primary)" : "var(--text-secondary)" }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* EVO-035 — Economic Dashboard */}
        <EconomicDashboard />

        {/* EVO-037 — Autopilot Agenda */}
        <AutopilotAgenda />

        {/* EVO-041 — OMNIS MCP Server UI */}
        <CollapsibleSection title="MCP Server — OMNIS Core">
          <MCPServerPanel />
        </CollapsibleSection>

        {/* EVO-043 — Multi-user Operators Shell */}
        <CollapsibleSection title="Operadores — RBAC Shell">
          <OperatorsPanel />
        </CollapsibleSection>

        {/* EVO-045 — OMNIS CLI Mirror View */}
        <CollapsibleSection title="CLI Mirror — OMNIS Terminal">
          <CLIView />
        </CollapsibleSection>

        {/* Agentes & Modelos */}
        {activeTab === "agents" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Agentes ativos", value: "3", sub: "de 4 disponíveis" },
                { label: "Modelos carregados", value: "4", sub: "Claude, DeepSeek, Gemini, Qwen" },
                { label: "Missões hoje", value: "5", sub: "4 concluídas · 1 em andamento" },
                { label: "Latência média", value: "1.2s", sub: "últimas 100 requisições" },
              ].map((stat) => (
                <div key={stat.label} className="p-4 rounded-xl" style={{ backgroundColor: "var(--background-menu-white)", border: "1px solid var(--border-main)" }}>
                  <div className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>{stat.value}</div>
                  <div className="text-xs font-medium mt-1" style={{ color: "var(--text-secondary)" }}>{stat.label}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{stat.sub}</div>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Agentes</h3>
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "var(--background-menu-white)", border: "1px solid var(--border-main)" }}>
              {agents.map((agent) => (
                <div key={agent.name} className="flex items-center gap-4 px-4 py-3 border-b last:border-b-0" style={{ borderColor: "var(--border-main)" }}>
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${agent.status === "ativo" ? "bg-green-500" : "bg-neutral-400"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{agent.name}</div>
                    <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{agent.role} · {agent.model}</div>
                  </div>
                  <div className="text-xs text-right hidden sm:block">
                    <div style={{ color: "var(--text-secondary)" }}>{agent.mission}</div>
                    <div className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>Risco: {agent.risk}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Integrações */}
        {activeTab === "integrations" && (
          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "var(--background-menu-white)", border: "1px solid var(--border-main)" }}>
            {integrations.map((intg) => (
              <div key={intg.name} className="flex items-center gap-4 px-4 py-3 border-b last:border-b-0" style={{ borderColor: "var(--border-main)" }}>
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${intg.status === "conectado" ? "bg-green-500" : "bg-red-500"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{intg.name}</div>
                  <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{intg.type}</div>
                </div>
                <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{intg.lastSync}</div>
              </div>
            ))}
          </div>
        )}

        {/* Execuções */}
        {activeTab === "executions" && (
          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "var(--background-menu-white)", border: "1px solid var(--border-main)" }}>
            {executions.map((exec) => (
              <div key={exec.id} className="flex items-center gap-4 px-4 py-3 border-b last:border-b-0" style={{ borderColor: "var(--border-main)" }}>
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${exec.status === "concluído" ? "bg-green-500" : "bg-amber-500 animate-pulse"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{exec.name}</div>
                  <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{exec.agent} · {exec.duration}</div>
                </div>
                <div className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "var(--background-gray-main)", color: "var(--text-secondary)" }}>
                  {exec.credits} créditos
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Logs */}
        {activeTab === "logs" && (
          <div className="space-y-1 font-mono text-xs">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-3 px-3 py-2 rounded-lg" style={{ backgroundColor: "var(--background-menu-white)" }}>
                <span className="flex-shrink-0 w-16" style={{ color: "var(--text-disable)" }}>{log.time}</span>
                <span className={`flex-shrink-0 w-16 font-semibold ${
                  log.level === "error" ? "text-red-600" :
                  log.level === "warning" ? "text-amber-600" :
                  log.level === "success" ? "text-green-600" :
                  "text-blue-600"
                }`}>{log.level.toUpperCase()}</span>
                <span style={{ color: "var(--text-primary)" }}>{log.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Custos */}
        {activeTab === "costs" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { label: "Créditos usados hoje", value: "93", sub: "de ~4000 disponíveis" },
                { label: "Custo estimado (R$)", value: "R$ 12,05", sub: "renovação: 13/06/2026" },
                { label: "Missão mais cara", value: "Lead Mining", sub: "45 créditos · 8m 07s" },
              ].map((stat) => (
                <div key={stat.label} className="p-4 rounded-xl" style={{ backgroundColor: "var(--background-menu-white)", border: "1px solid var(--border-main)" }}>
                  <div className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>{stat.value}</div>
                  <div className="text-xs font-medium mt-1" style={{ color: "var(--text-secondary)" }}>{stat.label}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{stat.sub}</div>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Uso por modelo</h3>
            <div className="space-y-2">
              {costData.map((c) => (
                <div key={c.model} className="flex items-center gap-3">
                  <span className="text-xs w-32 text-right" style={{ color: "var(--text-secondary)" }}>{c.model}</span>
                  <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ backgroundColor: "var(--background-gray-main)" }}>
                    <div className="h-full rounded-full flex items-center px-2 text-[10px] text-white font-medium" style={{ width: `${c.percent}%`, backgroundColor: c.color }}>
                      {c.percent}%
                    </div>
                  </div>
                  <span className="text-xs w-16" style={{ color: "var(--text-primary)" }}>{c.usage}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Segurança */}
        {activeTab === "security" && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl" style={{ backgroundColor: "#fef3c7", border: "1px solid #fcd34d" }}>
              <div className="text-sm font-semibold text-amber-800">Modo atual: Seguro (Leitura)</div>
              <p className="text-xs text-amber-700 mt-1">
                Nenhuma ação de escrita externa permitida sem aprovação humana explícita.
                Arquivos .env, secrets.* e tokens estão protegidos.
              </p>
            </div>

            <h3 className="text-sm font-semibold mt-4" style={{ color: "var(--text-primary)" }}>Permissões por conector</h3>
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "var(--background-menu-white)", border: "1px solid var(--border-main)" }}>
              {[
                { name: "Instagram API", read: true, write: false, delete: false },
                { name: "GitHub", read: true, write: true, delete: false },
                { name: "Notion", read: true, write: true, delete: false },
                { name: "Supabase", read: true, write: true, delete: false },
                { name: "n8n", read: true, write: false, delete: false },
              ].map((perm) => (
                <div key={perm.name} className="flex items-center gap-4 px-4 py-3 border-b last:border-b-0" style={{ borderColor: "var(--border-main)" }}>
                  <span className="text-sm font-medium flex-1" style={{ color: "var(--text-primary)" }}>{perm.name}</span>
                  <div className="flex gap-4 text-xs">
                    <span className={perm.read ? "text-green-600 font-medium" : "text-neutral-400"}>Ler</span>
                    <span className={perm.write ? "text-green-600 font-medium" : "text-neutral-400"}>Escrever</span>
                    <span className={perm.delete ? "text-red-600 font-medium" : "text-neutral-400"}>Deletar</span>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-semibold mt-4" style={{ color: "var(--text-primary)" }}>Arquivos protegidos</h3>
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "var(--background-menu-white)", border: "1px solid var(--border-main)" }}>
              {[".env", ".env.local", "secrets.yaml", "*_token*", "*_key*"].map((pattern) => (
                <div key={pattern} className="flex items-center gap-3 px-4 py-2 border-b last:border-b-0" style={{ borderColor: "var(--border-main)" }}>
                  <span className="text-red-500 text-xs">🔒</span>
                  <span className="text-sm font-mono" style={{ color: "var(--text-primary)" }}>{pattern}</span>
                  <span className="text-xs ml-auto" style={{ color: "var(--text-tertiary)" }}>Override requer confirmação dupla</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
