"use client";

import React, { useState } from "react";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tabs = [
  { id: "all", label: "Todos" },
  { id: "updates", label: "Atualizações" },
  { id: "messages", label: "Mensagens" },
];

const notifications = [
  {
    id: 1,
    type: "updates",
    title: "Novo recurso disponível",
    description: "A gravação de reuniões agora está disponível para todos os usuários Pro.",
    date: "Hoje, 10:30",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: 2,
    type: "messages",
    title: "Mensagem do suporte",
    description: "Sua solicitação de aumento de créditos foi analisada.",
    date: "Ontem, 14:15",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: 3,
    type: "updates",
    title: "Atualização de segurança",
    description: "Implementamos melhorias de segurança no sistema de autenticação.",
    date: "2 dias atrás",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

export default function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const [activeTab, setActiveTab] = useState("all");

  if (!isOpen) return null;

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.type === activeTab);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={onClose}
      />
      <div
        className="fixed top-0 right-0 h-full z-50 w-full max-w-sm shadow-2xl"
        style={{
          backgroundColor: "var(--background-menu-white)",
          borderLeft: "1px solid var(--border-main)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "var(--border-main)" }}
        >
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Notificações
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-neutral-100 transition-colors"
            style={{ color: "var(--text-tertiary)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex px-5 border-b"
          style={{ borderColor: "var(--border-main)" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative pb-3 pt-3 text-sm transition-colors"
              style={{
                color: activeTab === tab.id ? "var(--text-primary)" : "var(--text-tertiary)",
                marginRight: "1.25rem",
                fontWeight: activeTab === tab.id ? 500 : 400,
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: "var(--Button-black)" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto" style={{ maxHeight: "calc(100vh - 120px)" }}>
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3" style={{ color: "var(--text-disable)" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                Nenhuma notificação
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex gap-3 p-3 rounded-xl transition-colors hover:bg-neutral-50 cursor-pointer"
                >
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: "var(--background-gray-main)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {notification.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium mb-0.5" style={{ color: "var(--text-primary)" }}>
                      {notification.title}
                    </div>
                    <div className="text-xs mb-1 leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
                      {notification.description}
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-disable)" }}>
                      {notification.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
