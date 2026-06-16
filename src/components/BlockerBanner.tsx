"use client";

import React from "react";
import { useBlockerDetection } from "@/hooks/useBlockerDetection";

interface BlockerBannerProps {
  messages: Array<{ content: string }>;
  inputValue: string;
}

export default function BlockerBanner({ messages, inputValue }: BlockerBannerProps) {
  const { signal, dismiss } = useBlockerDetection({ messages, inputValue });

  if (!signal) return null;

  const isIdle = signal.signal === "idle";

  return (
    <div
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-20 w-full max-w-xl px-4"
    >
      <div
        className="flex items-start gap-3 px-4 py-3 rounded-xl shadow-md"
        style={{
          backgroundColor: "#fffbeb",
          border: "1px solid #fcd34d",
        }}
      >
        {/* Icon */}
        <span className="text-lg flex-shrink-0 mt-0.5" aria-hidden>
          {isIdle ? "💤" : "🔄"}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-amber-900">
            {isIdle ? "Você parece inativo." : "Loop detectado."}{" "}
            <span className="font-normal">{signal.detail}</span>
          </p>
          <p className="text-xs mt-0.5 text-amber-800">
            {signal.nextBestAction}
          </p>
        </div>

        {/* Dismiss */}
        <button
          onClick={dismiss}
          className="flex-shrink-0 text-amber-600 hover:text-amber-900 transition-colors text-lg leading-none mt-0.5"
          aria-label="Fechar aviso"
        >
          ×
        </button>
      </div>
    </div>
  );
}
