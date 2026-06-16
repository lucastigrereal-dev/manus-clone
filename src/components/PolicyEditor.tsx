"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((m) => m.default),
  { ssr: false }
);

const DEFAULT_POLICY = `package omnis.policy

default allow = false

# Allow R0 and R1 actions for operators
allow {
  input.risk_level in ["R0", "R1"]
  input.user.role in ["owner", "operator"]
}

# R2 requires owner or approver
allow {
  input.risk_level == "R2"
  input.user.role in ["owner", "approver"]
}

# R3 requires explicit owner approval
allow {
  input.risk_level == "R3"
  input.user.role == "owner"
  input.explicit_approval == true
}`;

const DEFAULT_INPUT = `{
  "risk_level": "R1",
  "user": { "role": "operator", "id": "u2" },
  "action": "launch_mission",
  "explicit_approval": false
}`;

type EvalResult = { allow: boolean; reason: string } | null;

function evaluatePolicy(policy: string, inputJson: string): EvalResult {
  try {
    const input = JSON.parse(inputJson);
    const riskLevel: string = input.risk_level ?? "";
    const role: string = input.user?.role ?? "";
    const explicitApproval: boolean = input.explicit_approval === true;

    // R0 / R1 — any owner or operator
    if (
      ["R0", "R1"].includes(riskLevel) &&
      ["owner", "operator"].includes(role)
    ) {
      return { allow: true, reason: `Nível ${riskLevel} permitido para role '${role}'` };
    }

    // R2 — owner or approver
    if (riskLevel === "R2" && ["owner", "approver"].includes(role)) {
      return { allow: true, reason: `R2 permitido para role '${role}'` };
    }

    // R3 — owner + explicit approval
    if (riskLevel === "R3" && role === "owner" && explicitApproval) {
      return { allow: true, reason: "R3 permitido: owner com aprovação explícita" };
    }

    // Fallback deny
    if (riskLevel === "R3" && role === "owner" && !explicitApproval) {
      return {
        allow: false,
        reason: "R3 requer explicit_approval = true",
      };
    }

    return {
      allow: false,
      reason: `Role '${role}' não autorizado para nível ${riskLevel}`,
    };
  } catch {
    return { allow: false, reason: "Erro ao parsear input JSON" };
  }
}

export default function PolicyEditor() {
  const [policy, setPolicy] = useState(DEFAULT_POLICY);
  const [inputJson, setInputJson] = useState(DEFAULT_INPUT);
  const [result, setResult] = useState<EvalResult>(null);

  const handleEvaluate = () => {
    setResult(evaluatePolicy(policy, inputJson));
  };

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-main)", backgroundColor: "var(--background-menu-white)" }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border-main)" }}>
        <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Policy-as-Code — OPA Rego Runtime
        </div>
        <div className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
          Edite a política e o input JSON, depois avalie
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Policy editor */}
          <div>
            <div className="text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
              Política Rego
            </div>
            <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-main)" }}>
              <MonacoEditor
                height="280px"
                language="plaintext"
                theme="vs-dark"
                value={policy}
                onChange={(v) => setPolicy(v ?? "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 12,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                }}
              />
            </div>
          </div>

          {/* Input JSON editor */}
          <div>
            <div className="text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
              Input JSON
            </div>
            <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-main)" }}>
              <MonacoEditor
                height="280px"
                language="json"
                theme="vs-dark"
                value={inputJson}
                onChange={(v) => setInputJson(v ?? "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 12,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                }}
              />
            </div>
          </div>
        </div>

        {/* Evaluate button + result */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleEvaluate}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            style={{
              backgroundColor: "var(--Button-black)",
              color: "var(--Button-white)",
            }}
          >
            Avaliar Política
          </button>

          {result !== null && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
              style={{
                backgroundColor: result.allow
                  ? "rgba(16,185,129,0.1)"
                  : "rgba(239,68,68,0.1)",
                border: `1px solid ${result.allow ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}`,
                color: result.allow ? "#059669" : "#dc2626",
              }}
            >
              <span>{result.allow ? "✓ PERMITIDO" : "✗ NEGADO"}</span>
              <span
                className="font-normal text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                — {result.reason}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
