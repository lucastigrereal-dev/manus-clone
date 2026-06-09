"use client";

import React, { useState } from "react";
import Modal from "../Modal";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tabs = [
  { id: "account", label: "Conta" },
  { id: "general", label: "Geral" },
  { id: "usage", label: "Uso e Faturamento" },
  { id: "personalization", label: "Personalização" },
  { id: "mail", label: "Mail Manus" },
  { id: "data-controls", label: "Controles de Dados" },
  { id: "my-computer", label: "My Computer" },
  { id: "cloud-browser", label: "Navegador em Nuvem" },
  { id: "integrations", label: "Integrações" },
  { id: "contact", label: "Obter Ajuda" },
];

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="flex h-[60vh]">
        {/* Sidebar Tabs */}
        <div className="w-48 flex-shrink-0 border-r pr-4" style={{ borderColor: "var(--border-main)" }}>
          <nav className="space-y-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeTab === tab.id ? "font-medium" : "hover:bg-neutral-50"
                }`}
                style={{ color: activeTab === tab.id ? "var(--text-primary)" : "var(--text-secondary)" }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 pl-6 overflow-y-auto">
          {activeTab === "account" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Conta</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Nome completo</label>
                  <input
                    type="text"
                    defaultValue="Lucas Tigre"
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:border-neutral-400 transition-colors"
                    style={{ borderColor: "var(--border-main)", color: "var(--text-primary)", backgroundColor: "var(--background-menu-white)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Email</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      defaultValue="lucastigrereal@outlook.com"
                      disabled
                      className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none"
                      style={{ borderColor: "var(--border-main)", color: "var(--text-secondary)", backgroundColor: "var(--background-gray-main)" }}
                    />
                    <button className="px-3 py-2 rounded-lg text-sm border transition-colors hover:bg-neutral-50" style={{ borderColor: "var(--border-main)", color: "var(--text-primary)" }}>Alterar</button>
                  </div>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: "var(--background-gray-main)" }}>
                  <div className="text-xs font-medium mb-1" style={{ color: "var(--text-tertiary)" }}>ID do Usuário</div>
                  <div className="flex items-center gap-2">
                    <code className="text-sm" style={{ color: "var(--text-primary)" }}>31051966332915200</code>
                    <button className="text-xs px-2 py-1 rounded border transition-colors hover:bg-white" style={{ borderColor: "var(--border-main)", color: "var(--text-secondary)" }}>Copiar</button>
                  </div>
                </div>
                <div className="pt-4 border-t" style={{ borderColor: "var(--border-main)" }}>
                  <button className="text-sm text-red-600 hover:text-red-700 transition-colors">Excluir conta</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "general" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Geral</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Idioma</label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                    style={{ borderColor: "var(--border-main)", color: "var(--text-primary)", backgroundColor: "var(--background-menu-white)" }}
                  >
                    <option>Português (Brasil)</option>
                    <option>English</option>
                    <option>Español</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Tema</label>
                  <div className="flex gap-2">
                    {["☀️ Claro", "🌙 Escuro", "⊙ Automático"].map((theme) => (
                      <button
                        key={theme}
                        className={`flex-1 py-2.5 rounded-lg text-sm border transition-colors ${
                          theme.includes("Automático") ? "font-medium" : ""
                        }`}
                        style={{
                          borderColor: theme.includes("Automático") ? "var(--text-primary)" : "var(--border-main)",
                          color: "var(--text-primary)",
                          backgroundColor: theme.includes("Automático") ? "var(--background-gray-main)" : "transparent",
                        }}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Receba atualizações de produto</div>
                    <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>Notificações sobre novos recursos</div>
                  </div>
                  <button className="w-11 h-6 rounded-full relative transition-colors" style={{ backgroundColor: "var(--Button-black)" }}
                  >
                    <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
                  </button>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Email quando tarefa começar</div>
                    <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>Notificação por email</div>
                  </div>
                  <button className="w-11 h-6 rounded-full relative transition-colors" style={{ backgroundColor: "var(--Button-black)" }}>
                    <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "usage" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Uso e Faturamento</h2>
              <div className="space-y-2">
                {[
                  { task: "Skill Creation Request Based on Uploaded File", date: "18/05/2026", credits: "-1.224" },
                  { task: "Passeios e atrações turísticas em Águas de São Pedro", date: "18/05/2026", credits: "-1.556" },
                  { task: "Como criar um plano de negócios para ecossistema Instagram", date: "16/05/2026", credits: "-939" },
                  { task: "Como converter ícones em SVG perfeitos", date: "15/05/2026", credits: "-302" },
                  { task: "Finalizar Pacote KRATOS", date: "13/05/2026", credits: "-381" },
                  { task: "Manus Pro (recarga)", date: "13/05/2026", credits: "+4.000", positive: true },
                ].map((item) => (
                  <div key={item.task} className="flex items-center justify-between py-2.5 border-b" style={{ borderColor: "var(--border-main)" }}>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate" style={{ color: "var(--text-primary)" }}>{item.task}</div>
                      <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{item.date}</div>
                    </div>
                    <div className={`text-sm font-medium ${item.positive ? "text-green-600" : "text-red-500"}`}>
                      {item.credits}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "personalization" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Personalização</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Apelido</label>
                  <input
                    type="text"
                    placeholder="Como o agente deve te chamar"
                    defaultValue="Lucas"
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:border-neutral-400 transition-colors"
                    style={{ borderColor: "var(--border-main)", color: "var(--text-primary)", backgroundColor: "var(--background-menu-white)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Ocupação</label>
                  <input
                    type="text"
                    placeholder="Designer de produto"
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:border-neutral-400 transition-colors"
                    style={{ borderColor: "var(--border-main)", color: "var(--text-primary)", backgroundColor: "var(--background-menu-white)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Instruções Personalizadas</label>
                  <textarea
                    placeholder="Seja conciso, padrão Python, priorize ação..."
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:border-neutral-400 transition-colors resize-none"
                    style={{ borderColor: "var(--border-main)", color: "var(--text-primary)", backgroundColor: "var(--background-menu-white)" }}
                  />
                </div>
                <div className="p-4 rounded-xl border border-dashed" style={{ borderColor: "var(--border-main)", backgroundColor: "var(--background-gray-main)" }}>
                  <div className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>Importar memória</div>
                  <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>Importe contexto persistente de outras IAs</div>
                  <button className="mt-3 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white" style={{ borderColor: "var(--border-main)", color: "var(--text-primary)" }}>Importar</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "mail" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Mail Manus</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl" style={{ backgroundColor: "var(--background-gray-main)" }}>
                  <div className="text-xs font-medium mb-1" style={{ color: "var(--text-tertiary)" }}>Email do agente</div>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>lucastigrereal623-agent@manus.bot</code>
                    <button className="text-xs px-2 py-1 rounded border transition-colors hover:bg-white" style={{ borderColor: "var(--border-main)", color: "var(--text-secondary)" }}>Copiar</button>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Remetentes aprovados</div>
                  <div className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ backgroundColor: "var(--background-gray-main)" }}>
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>lucastigrereal@outlook.com</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Aprovado</span>
                  </div>
                </div>
                <button className="w-full py-2.5 rounded-lg text-sm font-medium border transition-colors hover:bg-neutral-50" style={{ borderColor: "var(--border-main)", color: "var(--text-primary)" }}>+ Adicionar remetente aprovado</button>
              </div>
            </div>
          )}

          {activeTab === "data-controls" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Controles de Dados</h2>
              <div className="space-y-2">
                {[
                  { title: "Aplicativos", desc: "Publisher Pro — autorizado" },
                  { title: "Domínios comprados", desc: "Nenhum domínio comprado ainda" },
                  { title: "Tarefas arquivadas", desc: "0 tarefas arquivadas" },
                  { title: "Tarefas compartilhadas", desc: "0 tarefas compartilhadas" },
                  { title: "Arquivos compartilhados", desc: "0 arquivos compartilhados" },
                  { title: "Sites", desc: "Nenhum site publicado" },
                ].map((item) => (
                  <div key={item.title} className="flex items-center justify-between py-3 border-b" style={{ borderColor: "var(--border-main)" }}>
                    <div>
                      <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{item.title}</div>
                      <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>{item.desc}</div>
                    </div>
                    <button className="text-xs px-2 py-1 rounded border transition-colors hover:bg-white" style={{ borderColor: "var(--border-main)", color: "var(--text-secondary)" }}>Gerenciar</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "my-computer" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>My Computer</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl border" style={{ borderColor: "var(--border-main)", backgroundColor: "var(--background-gray-main)" }}>
                  <div className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>Computador na nuvem</div>
                  <div className="text-xs mb-3" style={{ color: "var(--text-tertiary)" }}>Espaço de trabalho persistente 24/7</div>
                  <button className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors" style={{ backgroundColor: "var(--Button-black)" }}>Criar agora</button>
                </div>
                <div className="p-4 rounded-xl border" style={{ borderColor: "var(--border-main)", backgroundColor: "var(--background-gray-main)" }}>
                  <div className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>Computador local</div>
                  <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>Requer Manus Desktop App</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "cloud-browser" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Navegador em Nuvem</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Manter estado de login entre tarefas</div>
                    <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>Preservar cookies e sessões entre execuções</div>
                  </div>
                  <button className="w-11 h-6 rounded-full relative transition-colors" style={{ backgroundColor: "var(--border-main)" }}>
                    <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white" />
                  </button>
                </div>
                <div className="pt-4 border-t" style={{ borderColor: "var(--border-main)" }}>
                  <button className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-neutral-50" style={{ borderColor: "var(--border-main)", color: "var(--text-primary)" }}>Gerenciar cookies</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Integrações</h2>
              <div className="space-y-2">
                {[
                  { name: "API do Manus" },
                  { name: "Zapier" },
                  { name: "Slack" },
                  { name: "Telegram" },
                  { name: "LINE" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between py-3 border-b" style={{ borderColor: "var(--border-main)" }}>
                    <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{item.name}</div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Não conectado</span>
                      <button className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:bg-neutral-50" style={{ borderColor: "var(--border-main)", color: "var(--text-primary)" }}>Conectar</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t space-y-4" style={{ borderColor: "var(--border-main)" }}>
                <div>
                  <div className="text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>API Keys</div>
                  <div className="text-xs mb-3" style={{ color: "var(--text-tertiary)" }}>Ainda não há chaves API</div>
                  <button className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-neutral-50" style={{ borderColor: "var(--border-main)", color: "var(--text-primary)" }}>+ Criar novo</button>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Webhooks</div>
                  <div className="text-xs mb-3" style={{ color: "var(--text-tertiary)" }}>Nenhum webhook ainda</div>
                  <button className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-neutral-50" style={{ borderColor: "var(--border-main)", color: "var(--text-primary)" }}>+ Criar novo</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Obter Ajuda</h2>
              <div className="space-y-4">
                <a
                  href="https://manus.im/help"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:underline"
                  style={{ color: "var(--text-primary)" }}
                >
                  Entre em contato conosco ↗
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
