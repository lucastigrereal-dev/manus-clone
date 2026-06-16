"use client";

import React, { useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Composer from "@/components/Composer";
import ChatArea from "@/components/ChatArea";
import TaskList from "@/components/TaskList";
import QuickActions from "@/components/QuickActions";
import ProfileModal from "@/components/modals/ProfileModal";
import SettingsModal from "@/components/modals/SettingsModal";
import PluginsView from "@/components/views/PluginsView";
import ScheduledView from "@/components/views/ScheduledView";
import LibraryView from "@/components/views/LibraryView";
import AgentsView from "@/components/views/AgentsView";
import EngineView from "@/components/views/EngineView";
import CommandPalette from "@/components/CommandPalette";
import InlineToast from "@/components/InlineToast";
import PromptChips from "@/components/PromptChips";
import { useOmnisShortcuts } from "@/hooks/useOmnisShortcuts";
import { useDraftAutosave } from "@/hooks/useDraftAutosave";
import PreflightPanel from "@/components/PreflightPanel";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  agent?: string;
  timestamp: Date;
}

const navItems = [
  { id: "new-task", label: "Nova missão", view: "home" },
  { id: "agents", label: "Agentes", view: "agents" },
  { id: "skills", label: "Skills", view: "plugins" },
  { id: "automations", label: "Automações", view: "scheduled" },
  { id: "library", label: "Biblioteca", view: "library" },
  { id: "engine", label: "Motor", view: "engine" },
];

const modeToAgent: Record<string, string> = {
  content: "muse",
  instagram: "hermes",
  dev: "vulcano",
  automation: "vulcano",
  research: "hermes",
  report: "hermes",
};

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("home");
  const [inputValue, setInputValue] = useState("");
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentAgent, setCurrentAgent] = useState("aurora");
  const [preflightPending, setPreflightPending] = useState<string | null>(null);

  // Wire global keyboard shortcuts
  useOmnisShortcuts();

  // Autosave draft
  const { clear: clearDraft } = useDraftAutosave({
    key: 'draft:global',
    value: inputValue,
    onRestore: setInputValue,
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [chatError, setChatError] = useState<string | null>(null);

  const handleNavChange = useCallback((navId: string) => {
    const item = navItems.find((i) => i.id === navId);
    if (item) {
      setActiveView(item.view);
    }
  }, []);

  const handleModeSelect = useCallback((mode: string) => {
    setSelectedMode(mode);
    const agent = modeToAgent[mode];
    if (agent) setCurrentAgent(agent);
  }, []);

  const doSendMessage = useCallback(async (text: string) => {
    const userMsg: Message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);
    setStreamingContent("");
    setChatError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          agent: currentAgent,
          history: messages.map((m) => ({
            role: m.role,
            content: m.content,
            agent: m.agent,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      let fullText = "";
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setStreamingContent(fullText);
      }

      const assistantMsg: Message = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        role: "assistant",
        content: fullText,
        agent: currentAgent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      clearDraft();
    } catch (err: any) {
      setChatError(err.message || "Erro ao conectar com Ollama. Verifique se está rodando na porta 11434.");
    } finally {
      setIsLoading(false);
      setStreamingContent("");
    }
  }, [currentAgent, messages, clearDraft]);

  const sendMessage = useCallback(() => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    // EVO-012: intercept to show preflight cost estimate before sending
    setPreflightPending(text);
  }, [inputValue, isLoading]);

  const hasMessages = messages.length > 0 || isLoading || streamingContent.length > 0;

  return (
    <div className="h-screen flex overflow-hidden" style={{ backgroundColor: "var(--background-gray-main)" }}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeView={activeView}
        onNavChange={handleNavChange}
        onProfileClick={() => setProfileOpen(true)}
        onSettingsClick={() => setSettingsOpen(true)}
      />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          onSparkleClick={() => setProfileOpen(true)}
        />

        <div className="flex-1 overflow-y-auto">
          {activeView === "home" && (
            <>
              {hasMessages ? (
                <div className="flex flex-col h-full">
                  <ChatArea
                    messages={messages}
                    isLoading={isLoading}
                    streamingContent={streamingContent}
                    currentAgent={currentAgent}
                  />
                  {chatError && (
                    <div className="px-4 pb-2">
                      <div className="max-w-3xl mx-auto p-3 rounded-xl text-sm" style={{ backgroundColor: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" }}>
                        ⚠️ {chatError}
                      </div>
                    </div>
                  )}
                  <div className="px-4 pb-4">
                    <Composer
                      value={inputValue}
                      onChange={setInputValue}
                      selectedMode={selectedMode}
                      onModeChange={setSelectedMode}
                      onSubmit={sendMessage}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center justify-center px-4 py-8 min-h-[60vh]">
                    <h1 className="text-2xl md:text-3xl font-medium mb-8 text-center" style={{ color: "var(--text-primary)" }}>
                      O que posso fazer por você?
                    </h1>
                    <Composer
                      value={inputValue}
                      onChange={setInputValue}
                      selectedMode={selectedMode}
                      onModeChange={setSelectedMode}
                      onSubmit={sendMessage}
                      disabled={isLoading}
                    />
                    <QuickActions onSelect={handleModeSelect} selectedMode={selectedMode} />
                    <PromptChips onChipSelect={setInputValue} />
                  </div>
                  <TaskList />
                </>
              )}
            </>
          )}

          {activeView === "plugins" && <PluginsView />}
          {activeView === "scheduled" && <ScheduledView />}
          {activeView === "library" && <LibraryView />}
          {activeView === "agents" && <AgentsView />}
          {activeView === "engine" && <EngineView />}
        </div>
      </main>

      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <CommandPalette />
      <InlineToast />

      {preflightPending !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <PreflightPanel
            message={preflightPending}
            onConfirm={() => {
              const text = preflightPending;
              setPreflightPending(null);
              doSendMessage(text);
            }}
            onCancel={() => {
              setInputValue(preflightPending);
              setPreflightPending(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
