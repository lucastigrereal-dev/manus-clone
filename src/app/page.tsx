"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
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
import { useContextPack } from "@/hooks/useContextPack";
import ContextPackBadge from "@/components/ContextPackBadge";
import MissionLauncher from "@/components/MissionLauncher";
import MissionStreamView from "@/components/MissionStreamView";
import ExecutionSidecar from "@/components/ExecutionSidecar"
import ArtifactPane from "@/components/ArtifactPane";
import { useUiStore } from "@/stores/uiStore";
import { useMissionStream } from "@/hooks/useMissionStream";
import { useSessionStore, type StoredMessage } from "@/stores/sessionStore";
import MissionTabs from "@/components/MissionTabs";
import CanvasView from "@/app/views/CanvasView";
import FactoryOSView from "@/app/views/FactoryOSView";
import KnowledgeGraphView from "@/app/views/KnowledgeGraphView";
import BlockerBanner from "@/components/BlockerBanner";
import MissionRunner from "@/components/MissionRunner";
import IntentChip from "@/components/IntentChip";
import type { ChatCommandResponse } from "@/types/calm";

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
  { id: "canvas", label: "Canvas", view: "canvas" },
  { id: "factory-os", label: "Factory OS", view: "factory-os" },
  { id: "knowledge", label: "Conhecimento", view: "knowledge" },
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
  const [missionLauncherOpen, setMissionLauncherOpen] = useState(false);
  const [lastLaunchedMissionId, setLastLaunchedMissionId] = useState<string | null>(null);
  const [streamingMissionId, setStreamingMissionId] = useState<string | null>(null);
  const [showArtifacts, setShowArtifacts] = useState(false);
  const [missionEntry, setMissionEntry] = useState<{ text: string; key: number } | null>(null);
  const [intentChip, setIntentChip] = useState<ChatCommandResponse | null>(null);
  const addToast = useUiStore((s) => s.addToast);

  // Sidecar: separate stream hook (MissionStreamView keeps its own connection)
  const { events: missionEvents } = useMissionStream(streamingMissionId);

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

  // Session persistence (Wave 2)
  const { createSession, getActive, appendMessage, activeSessionId } = useSessionStore()
  const syncedCountRef = useRef(0)
  const isHydratingRef = useRef(false)

  // Mount: hydrate messages from active session, or create a new one
  useEffect(() => {
    const session = getActive()
    if (session && session.messages.length > 0) {
      isHydratingRef.current = true
      const hydrated = session.messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }))
      setMessages(hydrated)
      syncedCountRef.current = hydrated.length
      isHydratingRef.current = false
    } else if (!session) {
      createSession()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync new messages to the active session store (runs after each messages change)
  useEffect(() => {
    if (isHydratingRef.current || !activeSessionId) return
    const newMsgs = messages.slice(syncedCountRef.current)
    newMsgs.forEach((msg) => {
      appendMessage(activeSessionId, { ...msg, timestamp: msg.timestamp.toISOString() })
    })
    syncedCountRef.current = messages.length
  }, [messages]) // eslint-disable-line react-hooks/exhaustive-deps

  // Switch to a stored session selected from the sidebar
  const handleSessionSelect = useCallback((storedMessages: StoredMessage[]) => {
    const hydrated = storedMessages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }))
    setMessages(hydrated)
    syncedCountRef.current = hydrated.length
  }, [])

  const contextPack = useContextPack({ messages, conversationId: "global" });
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
      // CALM: classify intent before executing
      const cmdRes = await fetch("/api/chat-command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, agent: currentAgent }),
      });

      if (!cmdRes.ok) throw new Error(`chat-command HTTP ${cmdRes.status}`);
      const cmd = (await cmdRes.json()) as ChatCommandResponse;

      // Show intent chip for 1.5s
      setIntentChip(cmd);
      setTimeout(() => setIntentChip(null), 1500);

      // Route by kind
      if (cmd.kind === "mission_launch" && cmd.mission_text) {
        setMissionEntry({ text: cmd.mission_text, key: Date.now() });
        clearDraft();
        return;
      }

      if (cmd.kind === "clarification" && cmd.text) {
        const assistantMsg: Message = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          role: "assistant",
          content: cmd.text + (cmd.clarification_options ? "\n\n" + cmd.clarification_options.map((o) => `• ${o}`).join("\n") : ""),
          agent: "aurora",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        clearDraft();
        return;
      }

      if (cmd.kind === "tool_result" && cmd.tool_result != null) {
        const assistantMsg: Message = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          role: "assistant",
          content: typeof cmd.tool_result === "string"
            ? cmd.tool_result
            : JSON.stringify(cmd.tool_result, null, 2),
          agent: currentAgent,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        clearDraft();
        return;
      }

      // Fallback: assistant_text or unhandled → existing /api/chat streaming flow
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          agent: currentAgent,
          history: contextPack.recentTurns.length > 0
            ? contextPack.recentTurns
            : messages.map((m) => ({ role: m.role, content: m.content })),
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
  }, [currentAgent, messages, contextPack, clearDraft]);

  const launchMission = useCallback((text: string) => {
    const userMsg: Message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setMissionEntry({ text, key: Date.now() });
    clearDraft();
  }, [clearDraft]);

  const sendMessage = useCallback(() => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    doSendMessage(text);
  }, [inputValue, isLoading]);

  const hasMessages = messages.length > 0 || isLoading || streamingContent.length > 0;

  return (
    <div className="h-screen flex overflow-hidden relative" style={{ backgroundColor: "var(--background-gray-main)" }}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeView={activeView}
        onNavChange={handleNavChange}
        onProfileClick={() => setProfileOpen(true)}
        onSettingsClick={() => setSettingsOpen(true)}
        onSessionSelect={handleSessionSelect}
      />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          onSparkleClick={() => setProfileOpen(true)}
        />

        {/* EVO-033 — Parallel mission tabs */}
        <MissionTabs />

        <div className="flex-1 overflow-y-auto">
          {activeView === "home" && (
            <>
              {hasMessages ? (
                <div className="flex flex-col h-full">
                  {/* Artifacts toggle pill — visible when a mission is streaming */}
                  {streamingMissionId !== null && (
                    <div className="flex justify-end px-4 pt-2 shrink-0">
                      <button
                        onClick={() => setShowArtifacts(true)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors"
                        style={{
                          border: "1px solid var(--border-main)",
                          color: "var(--text-secondary)",
                          backgroundColor: "var(--background-menu-white)",
                        }}
                      >
                        📦 Artifacts
                      </button>
                    </div>
                  )}
                  <ChatArea
                    messages={messages}
                    isLoading={isLoading}
                    streamingContent={streamingContent}
                    currentAgent={currentAgent}
                  />
                  {intentChip && (
                    <div className="px-4 pb-1">
                      <div className="max-w-3xl mx-auto">
                        <IntentChip intent={intentChip.intent} />
                      </div>
                    </div>
                  )}
                  {chatError && (
                    <div className="px-4 pb-2">
                      <div className="max-w-3xl mx-auto p-3 rounded-xl text-sm" style={{ backgroundColor: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" }}>
                        ⚠️ {chatError}
                      </div>
                    </div>
                  )}
                  {/* Onda B: MissionRunner inline no chat */}
                  {missionEntry && (
                    <div className="px-4 pb-2">
                      <div className="max-w-3xl mx-auto">
                        <MissionRunner
                          key={missionEntry.key}
                          text={missionEntry.text}
                          onDone={() => setMissionEntry(null)}
                        />
                      </div>
                    </div>
                  )}
                  <div className="px-4 pb-4">
                    <div className="max-w-3xl mx-auto mb-2 flex">
                      <ContextPackBadge pack={contextPack} />
                    </div>
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
                    <button
                      onClick={() => setMissionLauncherOpen(true)}
                      className="mb-4 flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors"
                      style={{
                        backgroundColor: "var(--background-nav)",
                        border: "1px solid var(--border-main)",
                        color: "var(--text-primary)",
                      }}
                    >
                      🚀 Nova Missão
                    </button>
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
          {activeView === "canvas" && <CanvasView />}
          {activeView === "factory-os" && <FactoryOSView />}
          {activeView === "knowledge" && <KnowledgeGraphView />}
        </div>
      </main>

      {/* EVO-038: Artifacts full overlay */}
      {showArtifacts && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto p-4"
          style={{ backgroundColor: "var(--background-menu-white)" }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-end mb-3">
              <button
                onClick={() => setShowArtifacts(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  border: "1px solid var(--border-main)",
                  color: "var(--text-secondary)",
                  backgroundColor: "transparent",
                }}
              >
                Fechar
              </button>
            </div>
            <ArtifactPane />
          </div>
        </div>
      )}

      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <CommandPalette />
      <InlineToast />
      <BlockerBanner messages={messages} inputValue={inputValue} />

      {preflightPending !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <PreflightPanel
            message={preflightPending}
            onConfirm={() => {
              const text = preflightPending;
              setPreflightPending(null);
              launchMission(text);
            }}
            onCancel={() => {
              setInputValue(preflightPending);
              setPreflightPending(null);
            }}
          />
        </div>
      )}

      {missionLauncherOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setMissionLauncherOpen(false);
          }}
        >
          <MissionLauncher
            onLaunched={(missionId) => {
              setLastLaunchedMissionId(missionId);
              setMissionLauncherOpen(false);
              setStreamingMissionId(missionId);
              addToast({ kind: "success", message: `Missão lançada: ${missionId}` });
            }}
          />
        </div>
      )}
      {streamingMissionId !== null && (
        <div
          className="fixed right-0 top-0 h-full z-40 shadow-xl flex flex-col overflow-hidden"
          style={{ width: "20rem" }}
        >
          <MissionStreamView
            missionId={streamingMissionId}
            onClose={() => setStreamingMissionId(null)}
          />
        </div>
      )}
      {streamingMissionId !== null && (
        <ExecutionSidecar
          missionId={streamingMissionId}
          events={missionEvents}
        />
      )}
    </div>
  );
}
