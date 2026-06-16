"use client";

import React, { useState, useRef, useEffect } from "react";

interface CLIEntry {
  cmd: string;
  output: string;
  ts: string;
}

const CLI_HISTORY: CLIEntry[] = [
  {
    cmd: "omnis mission list --limit 5",
    output:
      "mis_01JX001  benchmark-hoteis    done    Research\nmis_01JX002  app-factory-sprint  running App\nmis_01JX003  instagram-karina    failed  Content",
    ts: "10:01:23",
  },
  {
    cmd: "omnis status",
    output:
      "OMNIS Core     ● ok    45ms\nAKASHA         ● ok    12ms\nLiteLLM        ● ok    78ms\nRedis          ● ok    3ms",
    ts: "10:01:45",
  },
];

const MOCK_RESPONSES: Record<string, string> = {
  "omnis status":
    "OMNIS Core     ● ok    45ms\nAKASHA         ● ok    12ms\nLiteLLM        ● ok    78ms\nRedis          ● ok    3ms",
  "omnis mission list":
    "mis_01JX001  benchmark-hoteis    done    Research\nmis_01JX002  app-factory-sprint  running App\nmis_01JX003  instagram-karina    failed  Content",
  "omnis help":
    "Comandos disponíveis:\n  omnis status              — status do sistema\n  omnis mission list        — listar missões\n  omnis mission list --limit N\n  omnis akasha search <q>   — busca semântica\n  omnis help                — esta ajuda",
};

function getTime(): string {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function resolveCmd(raw: string): string {
  const trimmed = raw.trim().toLowerCase();
  if (MOCK_RESPONSES[trimmed]) return MOCK_RESPONSES[trimmed];
  // partial matches
  if (trimmed === "omnis mission list --limit 5" || trimmed === "omnis mission list --limit 5") {
    return MOCK_RESPONSES["omnis mission list"];
  }
  if (trimmed.startsWith("omnis mission list")) return MOCK_RESPONSES["omnis mission list"];
  if (trimmed.startsWith("omnis status")) return MOCK_RESPONSES["omnis status"];
  if (trimmed === "omnis help" || trimmed === "help") return MOCK_RESPONSES["omnis help"];
  return `Command not found: '${raw.trim()}'. Run 'omnis help' for usage.`;
}

const MAX_HISTORY = 20;

export default function CLIView() {
  const [history, setHistory] = useState<CLIEntry[]>(CLI_HISTORY);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const cmd = input.trim();
    if (!cmd) return;
    const output = resolveCmd(cmd);
    const ts = getTime();
    setHistory((prev) => {
      const next = [...prev, { cmd, output, ts }];
      return next.length > MAX_HISTORY ? next.slice(next.length - MAX_HISTORY) : next;
    });
    setInput("");
  };

  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{
        backgroundColor: "var(--background-menu-white)",
        border: "1px solid var(--border-main)",
      }}
    >
      {/* Header */}
      <div>
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          OMNIS CLI
        </h3>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
          Ink TypeScript — espelhado em tempo real
        </p>
      </div>

      {/* Terminal */}
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.85)",
          color: "#e5e7eb",
          fontFamily: "monospace",
          borderRadius: "12px",
          padding: "16px",
          minHeight: "200px",
          maxHeight: "320px",
          overflowY: "auto",
          fontSize: "12px",
          lineHeight: "1.6",
        }}
      >
        {/* History */}
        {history.map((entry, i) => (
          <div key={i} className="mb-2">
            <div style={{ color: "#9ca3af", fontSize: "10px", marginBottom: "2px" }}>
              [{entry.ts}]
            </div>
            <div>
              <span style={{ color: "#86efac" }}>$ </span>
              <span style={{ color: "#86efac" }}>{entry.cmd}</span>
            </div>
            <pre
              style={{
                color: "#d1d5db",
                margin: "2px 0 0 0",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontFamily: "monospace",
                fontSize: "12px",
              }}
            >
              {entry.output}
            </pre>
          </div>
        ))}

        {/* Input line */}
        <div className="flex items-center gap-1 mt-1">
          <span style={{ color: "#86efac" }}>$ </span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="omnis help"
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#e5e7eb",
              fontFamily: "monospace",
              fontSize: "12px",
              flex: 1,
              caretColor: "#86efac",
            }}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div ref={bottomRef} />
      </div>

      <p className="text-[11px]" style={{ color: "var(--text-disable)" }}>
        Digite um comando e pressione Enter. Tente: <span className="font-mono">omnis help</span>
      </p>
    </div>
  );
}
