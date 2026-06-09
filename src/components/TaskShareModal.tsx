"use client";

import React, { useState } from "react";

type ShareTab = "compartilhar" | "colaborar";

interface TaskShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskShareModal({ isOpen, onClose }: TaskShareModalProps) {
  const [activeTab, setActiveTab] = useState<ShareTab>("compartilhar");
  const [accessMode, setAccessMode] = useState<"private" | "public">("private");
  const [publicEnabled, setPublicEnabled] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const link = publicEnabled
    ? `https://manus.ai/share/${Math.random().toString(36).substring(2, 10)}`
    : "https://manus.ai/share/...";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const tabButtonBase =
    "flex-1 pb-3 text-sm font-medium text-center transition-colors relative";

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md rounded-2xl shadow-2xl"
          style={{
            backgroundColor: "var(--background-menu-white)",
            border: "1px solid var(--border-main)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: "var(--border-main)" }}
          >
            <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              Compartilhar tarefa
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
              style={{ color: "var(--text-tertiary)" }}
              aria-label="Fechar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="px-6 pt-4">
            <div
              className="flex border-b"
              style={{ borderColor: "var(--border-main)" }}
            >
              <button
                onClick={() => setActiveTab("compartilhar")}
                className={tabButtonBase}
                style={{
                  color: activeTab === "compartilhar" ? "var(--text-primary)" : "var(--text-tertiary)",
                }}
              >
                Compartilhar
                {activeTab === "compartilhar" && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t"
                    style={{ backgroundColor: "var(--Button-black)" }}
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("colaborar")}
                className={tabButtonBase}
                style={{
                  color: activeTab === "colaborar" ? "var(--text-primary)" : "var(--text-tertiary)",
                }}
              >
                Colaborar
                {activeTab === "colaborar" && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t"
                    style={{ backgroundColor: "var(--Button-black)" }}
                  />
                )}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {activeTab === "compartilhar" ? (
              <>
                {/* Access options */}
                <div
                  className="rounded-xl border p-1"
                  style={{ borderColor: "var(--border-main)" }}
                >
                  <button
                    onClick={() => {
                      setAccessMode("private");
                      setPublicEnabled(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors"
                    style={{
                      backgroundColor: accessMode === "private" ? "var(--background-gray-main)" : "transparent",
                    }}
                  >
                    <div>
                      <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        Somente eu
                      </div>
                      <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                        Ninguém mais pode ver esta tarefa
                      </div>
                    </div>
                    {accessMode === "private" && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: "var(--text-primary)" }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setAccessMode("public");
                      setPublicEnabled(true);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors"
                    style={{
                      backgroundColor: accessMode === "public" ? "var(--background-gray-main)" : "transparent",
                    }}
                  >
                    <div>
                      <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        Acesso público
                      </div>
                      <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                        Qualquer pessoa com o link pode visualizar
                      </div>
                    </div>
                    <div
                      className="w-10 h-6 rounded-full relative transition-colors"
                      style={{
                        backgroundColor: publicEnabled ? "var(--Button-black)" : "var(--border-dark)",
                      }}
                    >
                      <span
                        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform"
                        style={{
                          transform: publicEnabled ? "translateX(18px)" : "translateX(2px)",
                        }}
                      />
                    </div>
                  </button>
                </div>

                {/* Link & copy */}
                <div className="flex items-center gap-2">
                  <div
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm truncate"
                    style={{
                      backgroundColor: "var(--background-gray-main)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border-main)",
                    }}
                  >
                    {link}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2.5 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
                    style={{
                      backgroundColor: "var(--Button-black)",
                      color: "var(--text-white)",
                    }}
                  >
                    {copied ? "Copiado!" : "Copiar link"}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="text-3xl mb-3">👥</div>
                <div className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                  Colaboração em breve
                </div>
                <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  Em breve você poderá convidar membros da equipe para editar esta tarefa.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
