"use client";

import React from "react";

const MOCK_OPERATORS = [
  {
    id: "u1",
    name: "Lucas Tigre",
    email: "lucastigrereal@gmail.com",
    role: "owner",
    permissions: ["*"],
    lastSeen: "2 min ago",
    avatar: "L",
  },
  {
    id: "u2",
    name: "Aurora Agent",
    email: "aurora@omnis.ai",
    role: "operator",
    permissions: ["missions.read", "missions.write", "akasha.read"],
    lastSeen: "Agora",
    avatar: "A",
  },
  {
    id: "u3",
    name: "KRATOS Approver",
    email: "kratos@omnis.ai",
    role: "approver",
    permissions: ["approvals.*"],
    lastSeen: "5 min ago",
    avatar: "K",
  },
];

const ROLES = ["owner", "approver", "operator", "viewer"] as const;

const ROLE_COLORS: Record<string, string> = {
  owner: "#10b981",
  approver: "#f59e0b",
  operator: "#6366f1",
  viewer: "#6b7280",
};

const ROLE_PERMISSIONS: Record<string, string> = {
  owner: "Acesso total (*)",
  approver: "Aprovar/rejeitar missões e gates",
  operator: "Ler + escrever missões, akasha",
  viewer: "Somente leitura",
};

export default function OperatorsPanel() {
  return (
    <div
      className="rounded-xl p-4 space-y-4"
      style={{
        backgroundColor: "var(--background-menu-white)",
        border: "1px solid var(--border-main)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Operadores
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
            Gestão de acesso RBAC (Auth.js + Casbin — Em breve)
          </p>
        </div>
        <span
          className="text-xs px-2 py-1 rounded-full font-medium"
          style={{ backgroundColor: "#fef3c7", color: "#92400e" }}
        >
          Em breve
        </span>
      </div>

      {/* Operators list */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ border: "1px solid var(--border-main)" }}
      >
        {MOCK_OPERATORS.map((op) => (
          <div
            key={op.id}
            className="flex items-center gap-3 px-3 py-3 border-b last:border-b-0"
            style={{ borderColor: "var(--border-main)" }}
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
              style={{ backgroundColor: ROLE_COLORS[op.role] ?? "#6b7280" }}
            >
              {op.avatar}
            </div>

            {/* Name + email */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                {op.name}
              </div>
              <div className="text-[11px] truncate" style={{ color: "var(--text-tertiary)" }}>
                {op.email}
              </div>
            </div>

            {/* Role badge */}
            <span
              className="text-[11px] px-2 py-0.5 rounded-full font-medium flex-shrink-0"
              style={{
                backgroundColor: ROLE_COLORS[op.role] + "22",
                color: ROLE_COLORS[op.role],
                border: `1px solid ${ROLE_COLORS[op.role]}44`,
              }}
            >
              {op.role}
            </span>

            {/* Permissions count */}
            <span
              className="text-[11px] flex-shrink-0 hidden sm:block"
              style={{ color: "var(--text-tertiary)" }}
            >
              {op.permissions[0] === "*" ? "all" : `${op.permissions.length} perms`}
            </span>

            {/* Last seen */}
            <span
              className="text-[11px] flex-shrink-0 hidden md:block"
              style={{ color: "var(--text-disable)" }}
            >
              {op.lastSeen}
            </span>
          </div>
        ))}
      </div>

      {/* RBAC roles table */}
      <div>
        <h4 className="text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
          Papéis RBAC
        </h4>
        <div
          className="rounded-lg overflow-hidden"
          style={{ border: "1px solid var(--border-main)" }}
        >
          {ROLES.map((role) => (
            <div
              key={role}
              className="flex items-center gap-3 px-3 py-2 border-b last:border-b-0"
              style={{ borderColor: "var(--border-main)" }}
            >
              <span
                className="text-[11px] px-2 py-0.5 rounded-full font-medium w-20 text-center flex-shrink-0"
                style={{
                  backgroundColor: ROLE_COLORS[role] + "22",
                  color: ROLE_COLORS[role],
                }}
              >
                {role}
              </span>
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {ROLE_PERMISSIONS[role]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Invite button */}
      <div className="relative group">
        <button
          disabled
          className="w-full text-xs px-3 py-2 rounded-xl font-medium cursor-not-allowed"
          style={{
            backgroundColor: "var(--background-gray-main)",
            color: "var(--text-disable)",
            border: "1px solid var(--border-light)",
          }}
        >
          Convidar operador
        </button>
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 rounded text-[11px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            backgroundColor: "var(--Button-black)",
            color: "var(--Button-white)",
          }}
        >
          Disponível na Fase 5
        </div>
      </div>
    </div>
  );
}
