"use client";

import React, { useEffect, useState } from "react";

interface DryRunStep {
  id: string;
  label: string;
  estimated_cost: number;
}

interface DryRunResult {
  steps: DryRunStep[];
  estimatedCostUsd: number;
  riskTier: string; // canônico (era riskLevel)
}

interface DryRunPanelProps {
  objective: string;
  factory?: string;
  riskLevel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const RISK_BADGE_STYLE: Record<string, { bg: string; color: string }> = {
  R0: { bg: "rgba(16, 185, 129, 0.12)", color: "#065f46" },
  R1: { bg: "rgba(59, 130, 246, 0.12)", color: "#1e40af" },
  R2: { bg: "rgba(245, 158, 11, 0.12)", color: "#92400e" },
  R3: { bg: "rgba(239, 68, 68, 0.12)", color: "#991b1b" },
};

export default function DryRunPanel({
  objective,
  factory,
  riskLevel,
  onConfirm,
  onCancel,
}: DryRunPanelProps) {
  const [result, setResult] = useState<DryRunResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchDryRun() {
      setLoading(true);
      try {
        const res = await fetch("/api/missions/dry-run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ objective, factory, risk_level: riskLevel }),
        });
        if (!cancelled) {
          const data: DryRunResult = await res.json();
          setResult(data);
        }
      } catch {
        if (!cancelled) {
          setResult({
            steps: [
              { id: "s1", label: "Research fase inicial", estimated_cost: 0.002 },
              { id: "s2", label: "Content generation", estimated_cost: 0.003 },
            ],
            estimatedCostUsd: 0.005,
            riskTier: riskLevel ?? "R1",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDryRun();
    return () => {
      cancelled = true;
    };
  }, [objective, factory, riskLevel]);

  const effectiveRisk = result?.riskTier ?? riskLevel ?? "R1";
  const badgeStyle = RISK_BADGE_STYLE[effectiveRisk] ?? RISK_BADGE_STYLE.R1;
  const isHighRisk = effectiveRisk === "R2" || effectiveRisk === "R3";

  return (
    <div
      className="rounded-xl p-5 w-full max-w-md"
      style={{
        backgroundColor: "var(--background-menu-white)",
        border: "1px solid var(--border-main)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-sm font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Pré-visualização do Plano
        </h2>
        {!loading && result && (
          <span
            className="text-xs font-semibold px-2 py-1 rounded-xl"
            style={{ backgroundColor: badgeStyle.bg, color: badgeStyle.color }}
          >
            {effectiveRisk}
          </span>
        )}
      </div>

      {loading ? (
        /* Loading skeleton */
        <div className="flex flex-col gap-3 mb-5">
          {[80, 60, 72].map((w, i) => (
            <div
              key={i}
              className="flex justify-between items-center"
            >
              <div
                className="h-4 rounded-xl animate-pulse"
                style={{
                  backgroundColor: "var(--background-gray-main)",
                  width: `${w}%`,
                }}
              />
              <div
                className="h-4 w-14 rounded-xl animate-pulse ml-4"
                style={{ backgroundColor: "var(--background-gray-main)" }}
              />
            </div>
          ))}
          <div
            className="h-5 rounded-xl animate-pulse w-28 mt-2"
            style={{ backgroundColor: "var(--background-gray-main)" }}
          />
        </div>
      ) : (
        <div className="mb-5">
          {/* Steps list */}
          <ul className="flex flex-col gap-2 mb-4">
            {result!.steps.map((step) => (
              <li
                key={step.id}
                className="flex justify-between items-center text-sm"
              >
                <span style={{ color: "var(--text-secondary)" }}>{step.label}</span>
                <span
                  className="ml-4 text-xs tabular-nums"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  ${step.estimated_cost.toFixed(4)}
                </span>
              </li>
            ))}
          </ul>

          {/* Total */}
          <div
            className="flex justify-between items-center pt-3"
            style={{ borderTop: "1px solid var(--border-light)" }}
          >
            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Total estimado
            </span>
            <span className="text-sm font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>
              ${result!.estimatedCostUsd.toFixed(4)}
            </span>
          </div>

          {/* R2+ warning */}
          {isHighRisk && (
            <div
              className="mt-3 rounded-xl px-3 py-2 text-xs"
              style={{
                backgroundColor: "rgba(245, 158, 11, 0.08)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                color: "#92400e",
              }}
            >
              ⚠️ Ação externa irreversível — verifique antes de confirmar
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-2 rounded-xl text-sm transition-colors"
          style={{
            color: "var(--text-secondary)",
            border: "1px solid var(--border-main)",
            backgroundColor: "transparent",
          }}
        >
          Cancelar
        </button>
        <button
          onClick={!loading ? onConfirm : undefined}
          disabled={loading}
          className="px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
          style={
            loading
              ? {
                  backgroundColor: "var(--text-disable)",
                  color: "var(--Button-white)",
                  opacity: 0.6,
                  cursor: "default",
                }
              : {
                  backgroundColor: "var(--Button-black)",
                  color: "var(--Button-white)",
                  cursor: "pointer",
                }
          }
        >
          Executar agora
        </button>
      </div>
    </div>
  );
}
