"use client";

import React, { useState } from "react";
import Modal from "../Modal";

const templates = [
  {
    icon: "🔍",
    title: "Monitoração automatizada",
    desc: "Configure a monitoração automatizada para qualquer tópico, concorrente ou palavra-chave.",
  },
  {
    icon: "📧",
    title: "Resumo diário",
    desc: "Receba um resumo diário do que há na sua caixa de entrada e agenda antes de começar o dia.",
  },
  {
    icon: "⚡",
    title: "Pipeline automatizado",
    desc: "Transforme qualquer processo manual e com várias etapas em um pipeline automatizado que funciona em um cronograma.",
  },
];

export default function ScheduledView() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Agendado</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Manus trabalha de forma independente, sem que você precise solicitar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {templates.map((item) => (
          <button
            key={item.title}
            onClick={() => setShowCreate(true)}
            className="p-5 rounded-xl border text-left transition-all hover:border-neutral-300 hover:shadow-sm"
            style={{ borderColor: "var(--border-main)", backgroundColor: "var(--background-menu-white)" }}
          >
            <div className="text-2xl mb-3">{item.icon}</div>
            <div className="text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>{item.title}</div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-tertiary)" }}>{item.desc}</p>
            <div className="mt-3 text-xs font-medium" style={{ color: "var(--text-secondary)" }}>→</div>
          </button>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={() => setShowCreate(true)}
          className="px-6 py-3 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: "var(--Button-black)" }}
        >
          + Crie sua tarefa agendada
        </button>
      </div>

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Nova Tarefa Agendada" size="md">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Título</label>
            <input
              type="text"
              placeholder="Nome da tarefa"
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:border-neutral-400"
              style={{ borderColor: "var(--border-main)", color: "var(--text-primary)", backgroundColor: "var(--background-menu-white)" }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Agendamento</label>
            <select
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{ borderColor: "var(--border-main)", color: "var(--text-primary)", backgroundColor: "var(--background-menu-white)" }}
            >
              <option>Diariamente</option>
              <option>Semanalmente</option>
              <option>Mensal</option>
              <option>Sem Repetição</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Horário</label>
            <input
              type="time"
              defaultValue="08:00"
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{ borderColor: "var(--border-main)", color: "var(--text-primary)", backgroundColor: "var(--background-menu-white)" }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Prompt</label>
            <textarea
              rows={3}
              placeholder="Descreva o que Manus deve fazer..."
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none focus:border-neutral-400"
              style={{ borderColor: "var(--border-main)", color: "var(--text-primary)", backgroundColor: "var(--background-menu-white)" }}
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="skip-confirm" className="rounded" />
            <label htmlFor="skip-confirm" className="text-sm" style={{ color: "var(--text-secondary)" }}>Pular confirmações</label>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors hover:bg-neutral-50" style={{ borderColor: "var(--border-main)", color: "var(--text-primary)" }}>Cancelar</button>
            <button type="button" className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: "var(--Button-black)" }}>Criar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
