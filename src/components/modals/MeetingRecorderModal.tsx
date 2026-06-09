"use client";

import React, { useState, useEffect } from "react";
import Modal from "../Modal";

interface MeetingRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MeetingRecorderModal({ isOpen, onClose }: MeetingRecorderModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const totalTime = "2:00:00";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gravar reunião" size="md">
      <div className="space-y-6">
        {/* Waveform */}
        <div className="flex items-center justify-center py-6">
          <div className="flex items-end gap-1 h-16">
            {Array.from({ length: 40 }).map((_, i) => {
              const height = 20 + ((i % 7) + (i % 3)) * 10;
              return (
                <div
                  key={i}
                  className="w-1 rounded-full"
                  style={{
                    height: `${height}%`,
                    backgroundColor: isRecording ? "var(--Button-black)" : "var(--text-disable)",
                    opacity: isRecording ? 0.6 + (i % 5) * 0.1 : 0.7,
                    transition: "all 0.3s ease",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Info */}
        <div className="text-center text-sm" style={{ color: "var(--text-tertiary)" }}>
          Um resumo é gerado automaticamente após a gravação.
        </div>

        {/* Timer */}
        <div className="text-center">
          <span className="text-3xl font-mono font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
            {formatTime(elapsedSeconds)}
          </span>
          <span className="text-lg font-mono" style={{ color: "var(--text-disable)" }}>
            {" "}/ {totalTime}
          </span>
        </div>

        {/* Disabled input */}
        <div>
          <input
            type="text"
            disabled
            placeholder="Gravação em andamento. Edite após o fim da gravação."
            className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
            style={{
              borderColor: "var(--border-main)",
              color: "var(--text-disable)",
              backgroundColor: "var(--background-gray-main)",
              cursor: "not-allowed",
            }}
          />
        </div>

        {/* LGPD Warning */}
        <div
          className="flex items-start gap-2.5 p-3 rounded-lg"
          style={{ backgroundColor: "var(--background-gray-main)" }}
        >
          <div className="flex-shrink-0 mt-0.5" style={{ color: "var(--text-tertiary)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
            Ao iniciar, você confirma que tem o consentimento de todos os participantes.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors hover:bg-red-50"
            style={{ borderColor: "var(--border-main)", color: "var(--text-secondary)" }}
            onClick={() => {
              setIsRecording(false);
              setElapsedSeconds(0);
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Excluir
          </button>

          <button
            type="button"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: "var(--Button-black)" }}
            onClick={() => setIsRecording((prev) => !prev)}
          >
            {isRecording ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
                Pausar
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Iniciar
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
