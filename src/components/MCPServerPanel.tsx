"use client";

import React, { useState } from "react";

const MCP_TOOLS = [
  { name: "omnis.launch_mission", description: "Launch a new OMNIS mission", params: "{ objective, factory, risk_level }", status: "active" },
  { name: "omnis.search_akasha", description: "Semantic search in AKASHA memory", params: "{ query, limit }", status: "active" },
  { name: "omnis.get_status", description: "Get OMNIS system status", params: "{}", status: "active" },
  { name: "omnis.approve_mission", description: "Approve a pending mission gate", params: "{ mission_id, decision }", status: "active" },
  { name: "omnis.list_missions", description: "List recent missions", params: "{ limit, status }", status: "active" },
];

const MCP_CONFIG = {
  serverName: "omnis-core-mcp",
  version: "1.0.0",
  transport: "stdio",
  port: null,
  clients: ["Claude Desktop", "Cursor", "OMNIS CLI"],
};

const MCP_JSON_SNIPPET = JSON.stringify(
  { mcpServers: { omnis: { command: "npx", args: ["omnis-mcp-server"] } } },
  null,
  2
);

export default function MCPServerPanel() {
  const [copied, setCopied] = useState(false);
  const isOnline = true;

  const handleCopy = () => {
    navigator.clipboard.writeText(MCP_JSON_SNIPPET).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="rounded-xl p-4 space-y-4"
      style={{
        backgroundColor: "var(--background-menu-white)",
        border: "1px solid var(--border-main)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            OMNIS MCP Server
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
            Tools expostas para clientes externos (Claude, Cursor, CLI)
          </p>
        </div>
        <span
          className="text-xs px-2 py-1 rounded-full font-medium"
          style={
            isOnline
              ? { backgroundColor: "#d1fae5", color: "#065f46" }
              : { backgroundColor: "#fee2e2", color: "#991b1b" }
          }
        >
          {isOnline ? "● Ativo" : "○ Offline"}
        </span>
      </div>

      {/* Config block */}
      <div
        className="rounded-lg p-3 space-y-2"
        style={{ backgroundColor: "var(--background-gray-main)" }}
      >
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <span style={{ color: "var(--text-tertiary)" }}>Servidor</span>
          <span className="font-mono" style={{ color: "var(--text-primary)" }}>{MCP_CONFIG.serverName}</span>
          <span style={{ color: "var(--text-tertiary)" }}>Versão</span>
          <span className="font-mono" style={{ color: "var(--text-primary)" }}>{MCP_CONFIG.version}</span>
          <span style={{ color: "var(--text-tertiary)" }}>Transporte</span>
          <span className="font-mono" style={{ color: "var(--text-primary)" }}>{MCP_CONFIG.transport}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Clientes:</span>
          {MCP_CONFIG.clients.map((client) => (
            <span
              key={client}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: "var(--background-menu-white)",
                border: "1px solid var(--border-light)",
                color: "var(--text-secondary)",
              }}
            >
              {client}
            </span>
          ))}
        </div>
      </div>

      {/* Tools table */}
      <div>
        <h4 className="text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
          Tools registradas ({MCP_TOOLS.length})
        </h4>
        <div
          className="rounded-lg overflow-hidden"
          style={{ border: "1px solid var(--border-main)" }}
        >
          {MCP_TOOLS.map((tool, i) => (
            <div
              key={tool.name}
              className="flex items-start gap-3 px-3 py-2.5 border-b last:border-b-0"
              style={{ borderColor: "var(--border-main)" }}
            >
              <span
                className="mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: tool.status === "active" ? "#10b981" : "#6b7280", marginTop: "5px" }}
              />
              <div className="flex-1 min-w-0">
                <div
                  className="text-xs font-mono font-medium truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {tool.name}
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
                  {tool.description}
                </div>
              </div>
              <div
                className="text-[10px] font-mono flex-shrink-0 max-w-[140px] truncate hidden sm:block"
                style={{ color: "var(--text-tertiary)" }}
                title={tool.params}
              >
                {tool.params}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="w-full text-xs px-3 py-2 rounded-xl font-medium transition-colors"
        style={{
          backgroundColor: copied ? "#d1fae5" : "var(--Button-black)",
          color: copied ? "#065f46" : "var(--Button-white)",
        }}
      >
        {copied ? "✓ Copiado!" : "Copiar configuração MCP"}
      </button>
    </div>
  );
}
