"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface BlockerSignal {
  signal: "idle" | "loop";
  nextBestAction: string;
  detail: string;
}

interface UseBlockerDetectionProps {
  messages: Array<{ content: string }>;
  inputValue: string;
}

interface UseBlockerDetectionReturn {
  signal: BlockerSignal | null;
  dismiss: () => void;
}

const IDLE_MS = 7 * 60 * 1000; // 7 minutes
const DISMISS_COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes
const LOOP_WINDOW = 3;
const LOOP_PREFIX_LEN = 30;
const LOOP_THRESHOLD = 0.7; // fraction of prefix matches for "same"

function computeLoopSignal(messages: Array<{ content: string }>): boolean {
  const userMessages = messages
    .filter((m) => "role" in (m as unknown as { role: string })
      ? (m as unknown as { role: string }).role === "user"
      : true)
    .slice(-LOOP_WINDOW);

  if (userMessages.length < LOOP_WINDOW) return false;

  const prefixes = userMessages.map((m) =>
    m.content.trim().slice(0, LOOP_PREFIX_LEN).toLowerCase()
  );

  // Count how many unique prefixes there are relative to LOOP_WINDOW
  const unique = new Set(prefixes).size;
  const similarity = 1 - (unique - 1) / (LOOP_WINDOW - 1);
  return similarity >= LOOP_THRESHOLD;
}

export function useBlockerDetection({
  messages,
  inputValue,
}: UseBlockerDetectionProps): UseBlockerDetectionReturn {
  const [signal, setSignal] = useState<BlockerSignal | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const dismissedAtRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update activity on inputValue change
  useEffect(() => {
    lastActivityRef.current = Date.now();
  }, [inputValue]);

  // Update activity on new messages
  const prevMsgCount = useRef(messages.length);
  useEffect(() => {
    if (messages.length !== prevMsgCount.current) {
      lastActivityRef.current = Date.now();
      prevMsgCount.current = messages.length;
    }
  }, [messages.length]);

  const isDismissed = useCallback(() => {
    if (dismissedAtRef.current === null) return false;
    return Date.now() - dismissedAtRef.current < DISMISS_COOLDOWN_MS;
  }, []);

  const dismiss = useCallback(() => {
    dismissedAtRef.current = Date.now();
    setSignal(null);
  }, []);

  // Idle detection via interval
  useEffect(() => {
    const check = () => {
      if (isDismissed()) return;

      const idleMs = Date.now() - lastActivityRef.current;
      if (idleMs >= IDLE_MS) {
        setSignal({
          signal: "idle",
          nextBestAction: "Retome sua última missão ou comece uma nova",
          detail: `Sem atividade há ${Math.round(idleMs / 60000)} minutos.`,
        });
        return;
      }

      // Loop detection
      if (computeLoopSignal(messages)) {
        setSignal({
          signal: "loop",
          nextBestAction: "Tente decompor sua missão em subtarefas menores",
          detail: "Suas últimas mensagens parecem repetitivas.",
        });
        return;
      }

      // Clear signal if conditions no longer hold
      setSignal((prev) => (prev ? null : prev));
    };

    const interval = setInterval(check, 30_000); // check every 30s
    return () => clearInterval(interval);
  }, [messages, isDismissed]);

  // Also run loop check immediately when messages change
  useEffect(() => {
    if (isDismissed()) return;
    if (computeLoopSignal(messages)) {
      setSignal({
        signal: "loop",
        nextBestAction: "Tente decompor sua missão em subtarefas menores",
        detail: "Suas últimas mensagens parecem repetitivas.",
      });
    }
  }, [messages, isDismissed]);

  return { signal, dismiss };
}
