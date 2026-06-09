"use client";

import React, { useState } from "react";
import TaskStats from "../TaskStats";
import TaskShareModal from "../TaskShareModal";

interface TaskViewProps {
  taskId: string;
}

interface TaskStep {
  id: string;
  label: string;
  status: "pending" | "running" | "completed" | "error";
}

interface GeneratedFile {
  id: string;
  name: string;
  type: string;
}

const mockTask = {
  id: "task-1",
  title: "Criar apresentação sobre turismo em Águas de São Pedro",
  status: "completed" as const,
  steps: [
    { id: "s1", label: "Analisar requisitos", status: "completed" as const },
    { id: "s2", label: "Pesquisar dados", status: "completed" as const },
    { id: "s3", label: "Gerar slides", status: "completed" as const },
    { id: "s4", label: "Revisar conteúdo", status: "completed" as const },
    { id: "s5", label: "Exportar arquivos", status: "completed" as const },
  ] as TaskStep[],
  result:
    "Apresentação criada com sucesso. 12 slides gerados cobrindo pontos turísticos, gastronomia local, hospedagem e roteiros de 1 a 3 dias.",
  files: [
    { id: "f1", name: "turismo_aguas_sp.pptx", type: "pptx" },
    { id: "f2", name: "roteiro_3_dias.pdf", type: "pdf" },
    { id: "f3", name: "imagens_assets.zip", type: "zip" },
  ] as GeneratedFile[],
};

const mockStats = {
  credits: 1556,
  timeWorked: "52m 38s",
  pagesViewed: 24,
  commandsExecuted: 83,
  apiCalls: 15,
  filesCreated: 17,
};

export default function TaskView({ taskId }: TaskViewProps) {
  const [showStats, setShowStats] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const task = mockTask; // em produção buscaria por taskId

  const getStepIcon = (status: TaskStep["status"]) => {
    switch (status) {
      case "completed":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        );
      case "running":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-spin">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        );
      case "error":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        );
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
          </svg>
        );
    }
  };

  const getStepColor = (status: TaskStep["status"]) => {
    switch (status) {
      case "completed":
        return "var(--text-secondary)";
      case "running":
        return "var(--text-primary)";
      case "error":
        return "#ef4444";
      default:
        return "var(--text-disable)";
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pptx":
        return "🖼️";
      case "pdf":
        return "📄";
      case "zip":
        return "🗜️";
      default:
        return "📁";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-3 shrink-0"
        style={{ borderBottom: "1px solid var(--border-main)" }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors shrink-0"
            style={{ color: "var(--text-tertiary)" }}
            title="Voltar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h1 className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
            {task.title}
          </h1>
          {task.status === "completed" && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0"
              style={{ backgroundColor: "var(--background-gray-main)", color: "var(--text-secondary)" }}
            >
              Concluído
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setShowShare(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-neutral-100 transition-colors"
            style={{ color: "var(--text-primary)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            Compartilhar
          </button>

          <button
            onClick={() => setShowStats(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-neutral-100 transition-colors"
            style={{ color: "var(--text-primary)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            Estatísticas
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              style={{ color: "var(--text-tertiary)" }}
              title="Menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div
                  className="absolute right-0 z-50 mt-1 w-48 rounded-xl shadow-lg py-1"
                  style={{
                    backgroundColor: "var(--background-menu-white)",
                    border: "1px solid var(--border-main)",
                  }}
                >
                  {[
                    { label: "Renomear", icon: "✏️" },
                    { label: "Agendar", icon: "📅" },
                    { label: "Favoritar", icon: "⭐" },
                    { label: "Arquivar", icon: "🗄️" },
                    { label: "Mover", icon: "📂" },
                    { label: "Excluir", icon: "🗑️", danger: true },
                  ].map((item) => (
                    <button
                      key={item.label}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-neutral-50 transition-colors"
                      style={{ color: item.danger ? "#ef4444" : "var(--text-primary)" }}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar: steps */}
        <aside
          className="w-64 shrink-0 overflow-y-auto p-4 hidden md:block"
          style={{ borderRight: "1px solid var(--border-main)" }}
        >
          <div className="text-xs font-semibold uppercase tracking-wide mb-3 px-2" style={{ color: "var(--text-tertiary)" }}>
            Progresso
          </div>
          <div className="space-y-1">
            {task.steps.map((step, index) => (
              <div
                key={step.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm"
                style={{ color: getStepColor(step.status) }}
              >
                <span className="shrink-0">{getStepIcon(step.status)}</span>
                <span className="font-medium">{step.label}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {task.status === "completed" ? (
            <div className="max-w-3xl mx-auto space-y-6">
              <div
                className="p-5 rounded-2xl border"
                style={{ backgroundColor: "var(--background-menu-white)", borderColor: "var(--border-main)" }}
              >
                <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                  Resultado
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {task.result}
                </p>
              </div>

              {task.files.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                    Arquivos gerados
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {task.files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 p-3 rounded-xl border hover:bg-neutral-50 transition-colors cursor-pointer"
                        style={{ borderColor: "var(--border-main)", backgroundColor: "var(--background-menu-white)" }}
                      >
                        <span className="text-xl">{getFileIcon(file.type)}</span>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                            {file.name}
                          </div>
                          <div className="text-xs uppercase" style={{ color: "var(--text-tertiary)" }}>
                            {file.type}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 animate-spin"
                  style={{ border: "2px solid var(--border-main)", borderTopColor: "var(--text-primary)" }}
                />
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Executando tarefa...
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <TaskStats isOpen={showStats} onClose={() => setShowStats(false)} stats={mockStats} />
      <TaskShareModal isOpen={showShare} onClose={() => setShowShare(false)} />
    </div>
  );
}
