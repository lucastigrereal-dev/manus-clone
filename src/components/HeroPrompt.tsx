"use client";

import React, { useState } from "react";

const pills = [
  { label: "Create slides", icon: "📝" },
  { label: "Build website", icon: "🌐" },
  { label: "Develop desktop apps", icon: "💻" },
  { label: "Design", icon: "🎨" },
  { label: "More", icon: "✨" },
];

export default function HeroPrompt() {
  const [inputValue, setInputValue] = useState("");

  return (
    <section
      className="w-full flex flex-col items-center"
      style={{
        backgroundColor: "var(--background-gray-main)",
        marginTop: "20vh",
      }}
    >
      <div
        className="w-full px-6 flex flex-col items-center gap-[40px]"
        style={{ maxWidth: "1080px" }}
      >
        {/* H1 */}
        <h1
          className="text-start font-serif w-full"
          style={{
            color: "var(--text-primary)",
            fontSize: "36px",
            marginBottom: "34px",
            lineHeight: 1.2,
          }}
        >
          What can I do for you?
        </h1>

        {/* Prompt Input */}
        <div
          className="w-full flex flex-col gap-3 rounded-[22px] relative py-3 transition-all"
          style={{
            backgroundColor: "var(--background-menu-white)",
            boxShadow: "0px 12px 32px 0px rgba(0,0,0,0.02)",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div className="px-4">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Manus to research, create, or build anything..."
              className="w-full min-h-[46px] resize-none outline-none bg-transparent text-[15px] leading-[24px]"
              style={{ color: "var(--text-primary)" }}
              rows={1}
            />
          </div>
          <div className="flex items-center justify-between px-4">
            <div className="flex gap-2">
              <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors" title="Attach file">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-tertiary)" }}>
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
              <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors" title="Add tool">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-tertiary)" }}>
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </button>
            </div>
            <button
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
              style={{
                backgroundColor: "var(--Button-black)",
                color: "var(--text-white)",
              }}
            >
              Start
            </button>
          </div>
        </div>

        {/* Pills */}
        <div className="flex flex-wrap justify-center items-center gap-2">
          {pills.map((pill) => (
            <button
              key={pill.label}
              className="h-10 flex items-center gap-2 px-[14px] py-[7px] rounded-full border transition-colors flex-shrink-0"
              style={{
                borderColor: "var(--border-main)",
                color: "var(--text-secondary)",
                fontSize: "14px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--fill-tsp-white-light)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <span className="text-base">{pill.icon}</span>
              <span className="font-medium">{pill.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
