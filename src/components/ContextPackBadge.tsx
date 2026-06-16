"use client";

import React from "react";
import type { ContextPack } from "@/hooks/useContextPack";

interface ContextPackBadgeProps {
  pack: ContextPack;
}

export default function ContextPackBadge({ pack }: ContextPackBadgeProps) {
  const { recentTurns, summaryRef, memoryRefs, isLoading } = pack;
  const n = recentTurns.length;
  const m = memoryRefs.length;

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs"
      style={{
        border: "1px solid var(--border-main)",
        color: "var(--text-tertiary)",
        backgroundColor: "transparent",
        userSelect: "none",
      }}
      title={`Contexto: ${n} turnos recentes, ${m} referências de memória`}
    >
      {isLoading ? (
        <span
          className="inline-block w-3 h-3 rounded-full animate-spin"
          style={{
            border: "2px solid var(--border-main)",
            borderTopColor: "var(--text-tertiary)",
          }}
          aria-label="Carregando contexto"
        />
      ) : null}

      <span>
        {n} turnos | {m} refs
      </span>

      {summaryRef && !isLoading ? (
        <span title="Resumo disponível" aria-label="Resumo disponível">
          📝
        </span>
      ) : null}
    </div>
  );
}
