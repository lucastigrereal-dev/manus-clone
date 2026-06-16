"use client";

import React, { useState } from "react";

type ProposalStatus = "pending_review" | "approved" | "rejected";
type ProposalTarget = "system_prompt" | "skill";

interface Proposal {
  id: string;
  target: ProposalTarget;
  description: string;
  diff: string;
  source: string;
  status: ProposalStatus;
  confidence: number;
}

const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: "pp1",
    target: "system_prompt",
    description: "Adicionar instrução de brevidade para respostas de status",
    diff: "- Responda de forma completa e detalhada.\n+ Responda de forma concisa. Para status, use formato de lista.",
    source: "Langfuse session #4521",
    status: "pending_review",
    confidence: 0.87,
  },
  {
    id: "pp2",
    target: "skill",
    description: "Melhorar prompt de qualificação de leads no skill SDR",
    diff: "- Analise o lead e determine se é qualificado.\n+ Analise o lead usando critérios BANT: Budget, Authority, Need, Timeline.",
    source: "Langfuse session #4498",
    status: "approved",
    confidence: 0.92,
  },
  {
    id: "pp3",
    target: "system_prompt",
    description: "Corrigir referência a modelo desatualizado (GPT-3.5)",
    diff: "- Use o modelo GPT-3.5 para tarefas simples.\n+ Use o modelo Haiku para tarefas simples.",
    source: "Langfuse session #4512",
    status: "rejected",
    confidence: 0.76,
  },
];

const STATUS_STYLES: Record<ProposalStatus, { label: string; bg: string; color: string }> = {
  pending_review: { label: "Pendente", bg: "rgba(245,158,11,0.1)", color: "#b45309" },
  approved: { label: "Aprovado", bg: "rgba(16,185,129,0.1)", color: "#059669" },
  rejected: { label: "Rejeitado", bg: "rgba(239,68,68,0.1)", color: "#dc2626" },
};

const TARGET_STYLES: Record<ProposalTarget, { label: string; bg: string; color: string }> = {
  system_prompt: { label: "system_prompt", bg: "rgba(59,130,246,0.1)", color: "#2563eb" },
  skill: { label: "skill", bg: "rgba(139,92,246,0.1)", color: "#7c3aed" },
};

function DiffBlock({ diff }: { diff: string }) {
  const lines = diff.split("\n");
  return (
    <div
      className="rounded-lg p-3 font-mono text-xs overflow-x-auto"
      style={{ backgroundColor: "rgba(15,15,20,0.9)" }}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            color: line.startsWith("+")
              ? "rgba(74,222,128,1)"
              : line.startsWith("-")
              ? "rgba(248,113,113,1)"
              : "rgba(200,200,200,0.8)",
            backgroundColor: line.startsWith("+")
              ? "rgba(74,222,128,0.08)"
              : line.startsWith("-")
              ? "rgba(248,113,113,0.08)"
              : "transparent",
            padding: "1px 4px",
            borderRadius: "3px",
          }}
        >
          {line || " "}
        </div>
      ))}
    </div>
  );
}

export default function PromptPoliciesPanel() {
  const [proposals, setProposals] = useState<Proposal[]>(INITIAL_PROPOSALS);

  const updateStatus = (id: string, status: ProposalStatus) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  const counts = {
    pending: proposals.filter((p) => p.status === "pending_review").length,
    approved: proposals.filter((p) => p.status === "approved").length,
    rejected: proposals.filter((p) => p.status === "rejected").length,
  };

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-main)", backgroundColor: "var(--background-menu-white)" }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border-main)" }}>
        <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Políticas de Prompt Auto-Melhoráveis
        </div>
        <div className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
          Pipeline Langfuse → revisão humana → promoção
        </div>
        <div className="flex gap-3 mt-2">
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "rgba(245,158,11,0.1)", color: "#b45309" }}>
            {counts.pending} pendentes
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#059669" }}>
            {counts.approved} aprovados
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#dc2626" }}>
            {counts.rejected} rejeitados
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {proposals.map((p) => {
          const statusStyle = STATUS_STYLES[p.status];
          const targetStyle = TARGET_STYLES[p.target];
          return (
            <div
              key={p.id}
              className="rounded-xl p-4 space-y-3"
              style={{ border: "1px solid var(--border-light)", backgroundColor: "var(--background-gray-main)" }}
            >
              {/* Header badges + description */}
              <div className="flex items-start gap-2 flex-wrap">
                <span
                  className="text-[11px] px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                  style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                >
                  {statusStyle.label}
                </span>
                <span
                  className="text-[11px] px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                  style={{ backgroundColor: targetStyle.bg, color: targetStyle.color }}
                >
                  {targetStyle.label}
                </span>
                <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                  {p.description}
                </span>
              </div>

              {/* Diff */}
              <DiffBlock diff={p.diff} />

              {/* Confidence + source */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                    Confiança: {Math.round(p.confidence * 100)}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border-main)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${p.confidence * 100}%`, backgroundColor: "rgba(16,185,129,0.8)" }}
                  />
                </div>
                <div className="text-[11px]" style={{ color: "var(--text-disable)" }}>
                  {p.source}
                </div>
              </div>

              {/* Actions for pending */}
              {p.status === "pending_review" && (
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => updateStatus(p.id, "approved")}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    style={{
                      backgroundColor: "rgba(16,185,129,0.1)",
                      border: "1px solid rgba(16,185,129,0.4)",
                      color: "#059669",
                    }}
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={() => updateStatus(p.id, "rejected")}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    style={{
                      backgroundColor: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.4)",
                      color: "#dc2626",
                    }}
                  >
                    Rejeitar
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
