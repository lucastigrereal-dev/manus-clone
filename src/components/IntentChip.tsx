"use client";
import React from "react";
import type { IntentResult } from "@/types/calm";

interface Props {
  intent: IntentResult;
}

const INTENT_LABELS: Record<string, string> = {
  knowledge_search: "buscar na Caixa",
  mission_execute: "criar missão",
  mission_create: "criar missão",
  system_status: "checar status",
  gargalo_query: "analisar gargalo",
  next_action_query: "próxima ação",
  canvas_open: "abrir canvas",
  clarification: "esclarecer",
  chat_normal: "conversar",
};

export default function IntentChip({ intent }: Props) {
  const label = INTENT_LABELS[intent.intent] ?? intent.intent;
  const pct = Math.round(intent.confidence * 100);

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white/60 text-xs font-medium backdrop-blur-sm border border-white/10 animate-fade-in">
      <span>🧭</span>
      <span>entendi: {label}</span>
      <span className="text-white/40">· {pct}%</span>
    </div>
  );
}
