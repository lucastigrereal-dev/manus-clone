"use client";

import React, { useEffect, useRef } from "react";
import { useVoiceInput } from "@/hooks/useVoiceInput";

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
}

export default function VoiceButton({ onTranscript }: VoiceButtonProps) {
  const { isListening, transcript, confidence, error, isSupported, start, stop } =
    useVoiceInput();

  const prevConfidenceRef = useRef(0);

  // Call onTranscript once we have a final result (confidence > 0)
  useEffect(() => {
    if (confidence > 0 && transcript && prevConfidenceRef.current === 0) {
      onTranscript(transcript);
      stop();
    }
    prevConfidenceRef.current = confidence;
  }, [confidence, transcript, onTranscript, stop]);

  if (!isSupported) {
    return (
      <div className="relative group">
        <button
          disabled
          className="p-2 rounded-lg transition-colors opacity-40 cursor-not-allowed"
          style={{ color: "var(--text-tertiary)" }}
          aria-label="Voz não suportada neste browser"
        >
          <MicIcon />
        </button>
        {/* Tooltip */}
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-lg text-xs whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-md"
          style={{
            backgroundColor: "var(--background-menu-white)",
            border: "1px solid var(--border-main)",
            color: "var(--text-secondary)",
          }}
        >
          Voz não suportada neste browser
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={isListening ? stop : start}
        className="p-2 rounded-lg transition-colors hover:bg-neutral-100"
        style={{ color: isListening ? "#ef4444" : "var(--text-tertiary)" }}
        aria-label={isListening ? "Parar gravação" : "Iniciar gravação de voz"}
        title={isListening ? "Parar" : "Voz"}
      >
        <span
          className={isListening ? "inline-flex animate-pulse" : "inline-flex"}
        >
          <MicIcon />
        </span>
      </button>

      {/* Live transcript bubble */}
      {isListening && transcript && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap max-w-[220px] truncate shadow-md z-50"
          style={{
            backgroundColor: "var(--background-menu-white)",
            border: "1px solid var(--border-main)",
            color: "var(--text-primary)",
          }}
        >
          {transcript}
        </div>
      )}

      {/* Error indicator */}
      {error && !isListening && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-lg text-xs whitespace-nowrap shadow-md z-50"
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

function MicIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}
