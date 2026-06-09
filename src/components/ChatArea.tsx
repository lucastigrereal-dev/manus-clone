"use client";

import React, { useRef, useEffect } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  agent?: string;
  timestamp: Date;
}

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  streamingContent: string;
  currentAgent: string;
}

const agentInfo: Record<string, { name: string; color: string; icon: string }> = {
  aurora: { name: "Aurora", color: "#10b981", icon: "◐" },
  hermes: { name: "Hermes", color: "#3b82f6", icon: "🔍" },
  vulcano: { name: "Vulcano", color: "#8b5cf6", icon: "🖥️" },
  muse: { name: "Muse", color: "#f59e0b", icon: "✨" },
};

export default function ChatArea({ messages, isLoading, streamingContent, currentAgent }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const agent = agentInfo[currentAgent] || agentInfo.aurora;

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.length === 0 && !streamingContent && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-4xl mb-4 opacity-30">◐</div>
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Aurora está pronta. Envie uma mensagem para começar.
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
              Modelo: {agent.name} · Streaming ativo
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            {/* Avatar */}
            <div className="flex-shrink-0">
              {msg.role === "user" ? (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: "#10b981" }}
                >
                  L
                </div>
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: agentInfo[msg.agent || "aurora"]?.color || "#10b981" }}
                >
                  {agentInfo[msg.agent || "aurora"]?.icon || "◐"}
                </div>
              )}
            </div>

            {/* Bubble */}
            <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className="px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed"
                style={{
                  backgroundColor: msg.role === "user" ? "var(--Button-black)" : "var(--background-menu-white)",
                  color: msg.role === "user" ? "white" : "var(--text-primary)",
                  border: msg.role === "user" ? "none" : "1px solid var(--border-main)",
                  borderBottomRightRadius: msg.role === "user" ? "4px" : undefined,
                  borderBottomLeftRadius: msg.role === "assistant" ? "4px" : undefined,
                }}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
              <div className="text-[10px] mt-1 px-1" style={{ color: "var(--text-disable)" }}>
                {msg.role === "assistant" ? (
                  <span>{agentInfo[msg.agent || "aurora"]?.name || "Aurora"} · {formatTime(msg.timestamp)}</span>
                ) : (
                  <span>Você · {formatTime(msg.timestamp)}</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Streaming message */}
        {streamingContent && (
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: agent.color }}
              >
                {agent.icon}
              </div>
            </div>
            <div className="max-w-[80%]">
              <div
                className="px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed"
                style={{
                  backgroundColor: "var(--background-menu-white)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-main)",
                  borderBottomLeftRadius: "4px",
                }}
              >
                <div className="whitespace-pre-wrap">{streamingContent}</div>
                <span className="inline-block w-1.5 h-4 bg-current ml-0.5 animate-pulse align-middle" style={{ color: "var(--text-tertiary)" }}></span>
              </div>
              <div className="text-[10px] mt-1 px-1" style={{ color: "var(--text-disable)" }}>
                {agent.name} · digitando...
              </div>
            </div>
          </div>
        )}

        {/* Loading spinner when waiting for first token */}
        {isLoading && !streamingContent && (
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: agent.color }}
              >
                {agent.icon}
              </div>
            </div>
            <div className="flex items-center gap-1 px-4 py-2.5 rounded-2xl" style={{ border: "1px solid var(--border-main)", borderBottomLeftRadius: "4px" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: "var(--text-tertiary)" }}></span>
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: "var(--text-tertiary)", animationDelay: "0.1s" }}></span>
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: "var(--text-tertiary)", animationDelay: "0.2s" }}></span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
