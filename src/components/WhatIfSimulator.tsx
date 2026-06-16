"use client";

import React, { useEffect, useState } from "react";

interface Scenario {
  name: string;
  cost: number;
  time: string;
  risk: string;
  description: string;
}

interface WhatIfSimulatorProps {
  objective: string;
  onSelect: (scenario: { name: string; risk: string }) => void;
}

function SkeletonCard() {
  return (
    <div
      className="flex-1 rounded-xl px-3 py-3 animate-pulse"
      style={{
        border: "1px solid var(--border-main)",
        backgroundColor: "var(--background-gray-main)",
        minWidth: "130px",
      }}
    >
      <div className="h-3 rounded mb-2" style={{ backgroundColor: "var(--border-dark)", width: "60%" }} />
      <div className="h-2 rounded mb-1" style={{ backgroundColor: "var(--border-main)", width: "40%" }} />
      <div className="h-2 rounded" style={{ backgroundColor: "var(--border-main)", width: "80%" }} />
    </div>
  );
}

const RISK_COLORS: Record<string, { bg: string; text: string }> = {
  R0: { bg: "#f0fdf4", text: "#166534" },
  R1: { bg: "#eff6ff", text: "#1e40af" },
  R2: { bg: "#fffbeb", text: "#92400e" },
  R3: { bg: "#fef2f2", text: "#991b1b" },
};

export default function WhatIfSimulator({ objective, onSelect }: WhatIfSimulatorProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    setLoading(true);
    setSelected(null);
    setConfirmed(false);

    fetch("/api/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ objective }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.scenarios)) {
          setScenarios(data.scenarios);
        }
      })
      .catch(() => {
        // Silent fail — scenarios stay empty
      })
      .finally(() => setLoading(false));
  }, [objective]);

  const handleConfirm = () => {
    const scenario = scenarios.find((s) => s.name === selected);
    if (!scenario) return;
    setConfirmed(true);
    onSelect({ name: scenario.name, risk: scenario.risk });
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
          Cenários de execução
        </span>
        {confirmed && (
          <span className="text-xs font-medium" style={{ color: "#166534" }}>
            ✓ Cenário confirmado
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          scenarios.map((scenario) => {
            const isSelected = selected === scenario.name;
            const riskStyle = RISK_COLORS[scenario.risk] ?? { bg: "#f5f5f5", text: "#525252" };

            return (
              <button
                key={scenario.name}
                type="button"
                onClick={() => setSelected(scenario.name)}
                className="flex-1 rounded-xl px-3 py-3 text-left transition-colors"
                style={{
                  border: isSelected
                    ? "1.5px solid var(--Button-black)"
                    : "1px solid var(--border-main)",
                  backgroundColor: isSelected
                    ? "var(--background-nav)"
                    : "var(--background-gray-main)",
                  minWidth: "130px",
                  outline: "none",
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {scenario.name}
                  </span>
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: riskStyle.bg, color: riskStyle.text }}
                  >
                    {scenario.risk}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    ⏱ {scenario.time}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    · ${scenario.cost.toFixed(4)}
                  </span>
                </div>

                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {scenario.description}
                </p>
              </button>
            );
          })
        )}
      </div>

      <button
        type="button"
        onClick={handleConfirm}
        disabled={!selected || confirmed}
        className="rounded-xl px-3 py-2 text-sm font-semibold transition-colors self-end"
        style={
          !selected || confirmed
            ? {
                backgroundColor: "var(--text-disable)",
                color: "var(--Button-white)",
                opacity: 0.5,
                cursor: "default",
              }
            : {
                backgroundColor: "var(--Button-black)",
                color: "var(--Button-white)",
                cursor: "pointer",
              }
        }
      >
        Confirmar cenário
      </button>
    </div>
  );
}
