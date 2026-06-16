"use client";

import React, { useEffect, useState } from "react";

export type PreflightResult = {
  estimatedCostUsd: number;
  decision: "GO" | "VETO";
  breakdown: Array<{ operation: string; costUsd: number }>;
};

interface PreflightPanelProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function PreflightPanel({ message, onConfirm, onCancel }: PreflightPanelProps) {
  const [result, setResult] = useState<PreflightResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchPreflight() {
      setLoading(true);
      try {
        const res = await fetch("/api/missions/preflight", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });
        if (!cancelled) {
          const data: PreflightResult = await res.json();
          setResult(data);
        }
      } catch {
        if (!cancelled) {
          // fallback on client error
          setResult({ estimatedCostUsd: 0.002, decision: "GO", breakdown: [] });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPreflight();
    return () => { cancelled = true; };
  }, [message]);

  const isVeto = result?.decision === "VETO";

  return (
    <div
      className="rounded-xl p-5 w-full max-w-md"
      style={{
        backgroundColor: "var(--background-menu-white)",
        border: "1px solid var(--border-main)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      }}
    >
      <h2
        className="text-sm font-semibold mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Estimativa de custo
      </h2>

      {loading ? (
        <div className="flex flex-col gap-2 mb-5">
          <div
            className="h-6 rounded-xl animate-pulse w-32"
            style={{ backgroundColor: "var(--background-gray-main)" }}
          />
          <div
            className="h-4 rounded-xl animate-pulse w-20"
            style={{ backgroundColor: "var(--background-gray-main)" }}
          />
        </div>
      ) : (
        <div className="mb-5">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-2xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              ${result!.estimatedCostUsd.toFixed(4)}
            </span>
            <span
              className="text-xs font-semibold px-2 py-1 rounded-xl"
              style={
                isVeto
                  ? { backgroundColor: "#fef2f2", color: "#991b1b" }
                  : { backgroundColor: "#f0fdf4", color: "#166534" }
              }
            >
              {result!.decision}
            </span>
          </div>

          {result!.breakdown.length > 0 && (
            <ul className="flex flex-col gap-1">
              {result!.breakdown.map((item, idx) => (
                <li
                  key={idx}
                  className="flex justify-between text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span>{item.operation}</span>
                  <span>${item.costUsd.toFixed(4)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

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
          onClick={!isVeto ? onConfirm : undefined}
          disabled={isVeto || loading}
          className="px-3 py-2 rounded-xl text-sm transition-colors"
          style={
            isVeto || loading
              ? {
                  backgroundColor: "var(--text-disable)",
                  color: "var(--Button-white)",
                  cursor: isVeto ? "not-allowed" : "default",
                  opacity: 0.6,
                }
              : {
                  backgroundColor: "var(--Button-black)",
                  color: "var(--Button-white)",
                  cursor: "pointer",
                }
          }
        >
          Executar
        </button>
      </div>
    </div>
  );
}
