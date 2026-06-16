"use client";

import React, { useState } from "react";

type RiskLevel = "R0" | "R1" | "R2" | "R3";
type Factory = "Research" | "Content" | "App" | "Instagram" | "Automation";

const RISK_DESCRIPTIONS: Record<RiskLevel, string> = {
  R0: "Somente leitura — sem efeitos externos",
  R1: "Escrita local segura — sem APIs externas",
  R2: "Ações externas reversíveis",
  R3: "Ações externas irreversíveis — alto impacto",
};

const FACTORIES: Factory[] = ["Research", "Content", "App", "Instagram", "Automation"];

interface MissionLauncherProps {
  onLaunched: (missionId: string) => void;
}

interface MissionResult {
  mission_id: string;
  status: string;
  objective: string;
  factory: string;
  risk_level: string;
  estimated_cost: number;
}

export default function MissionLauncher({ onLaunched }: MissionLauncherProps) {
  const [objective, setObjective] = useState("");
  const [factory, setFactory] = useState<Factory>("Research");
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("R1");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MissionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!objective.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objective: objective.trim(), factory, risk_level: riskLevel }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: MissionResult = await res.json();
      setResult(data);

      // Short delay so user sees the success badge, then notify parent
      setTimeout(() => {
        onLaunched(data.mission_id);
      }, 1800);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao lançar missão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded-xl p-5 w-full max-w-lg"
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
        Nova Missão
      </h2>

      {result ? (
        <div className="flex flex-col gap-3">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: "#f0fdf4", color: "#166534" }}
          >
            <span>✅</span>
            <span>{result.mission_id}</span>
            <span className="ml-auto font-normal" style={{ color: "#15803d" }}>
              ~${result.estimated_cost.toFixed(4)}
            </span>
          </div>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Status: <strong>{result.status}</strong> · Factory: <strong>{result.factory}</strong>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Objective */}
          <div className="flex flex-col gap-1">
            <label
              className="text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Objetivo
            </label>
            <textarea
              rows={3}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Descreva o objetivo da missão…"
              className="rounded-xl px-3 py-2 text-sm resize-none outline-none transition-colors"
              style={{
                backgroundColor: "var(--background-gray-main)",
                border: "1px solid var(--border-main)",
                color: "var(--text-primary)",
              }}
              disabled={loading}
            />
          </div>

          {/* Factory */}
          <div className="flex flex-col gap-1">
            <label
              className="text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Factory
            </label>
            <select
              value={factory}
              onChange={(e) => setFactory(e.target.value as Factory)}
              className="rounded-xl px-3 py-2 text-sm outline-none transition-colors"
              style={{
                backgroundColor: "var(--background-gray-main)",
                border: "1px solid var(--border-main)",
                color: "var(--text-primary)",
              }}
              disabled={loading}
            >
              {FACTORIES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Risk level */}
          <div className="flex flex-col gap-2">
            <label
              className="text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Nível de risco
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["R0", "R1", "R2", "R3"] as RiskLevel[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRiskLevel(r)}
                  disabled={loading}
                  className="rounded-xl px-3 py-2 text-xs text-left transition-colors"
                  style={{
                    border: riskLevel === r
                      ? "1px solid var(--Button-black)"
                      : "1px solid var(--border-main)",
                    backgroundColor: riskLevel === r
                      ? "var(--background-nav)"
                      : "var(--background-gray-main)",
                    color: riskLevel === r
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                  }}
                >
                  <span className="font-semibold block">{r}</span>
                  <span style={{ color: "var(--text-tertiary)", fontSize: "0.68rem", lineHeight: 1.3 }}>
                    {RISK_DESCRIPTIONS[r]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs" style={{ color: "#991b1b" }}>
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !objective.trim()}
            className="rounded-xl px-3 py-2 text-sm font-semibold transition-colors"
            style={
              loading || !objective.trim()
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
            {loading ? "Lançando…" : "Lançar Missão"}
          </button>
        </form>
      )}
    </div>
  );
}
