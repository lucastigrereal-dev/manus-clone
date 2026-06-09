"use client";

import React from "react";

interface CloudComputerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CloudComputerModal({ isOpen, onClose }: CloudComputerModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 z-50"
        onClick={onClose}
      />
      <div
        className="fixed top-16 right-8 z-50 w-80 rounded-xl shadow-lg p-5"
        style={{
          backgroundColor: "var(--background-menu-white)",
          border: "1px solid var(--border-main)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            Computador na nuvem
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-neutral-100 transition-colors"
            style={{ color: "var(--text-tertiary)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Description */}
        <p className="text-sm mb-5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Um espaço de trabalho 24/7 para o seu agente.
        </p>

        {/* CTA */}
        <button
          type="button"
          className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90 mb-3"
          style={{ backgroundColor: "var(--Button-black)" }}
        >
          Criar
        </button>

        {/* Link placeholder */}
        <button
          type="button"
          disabled
          className="w-full py-2 text-sm text-center transition-colors cursor-not-allowed"
          style={{ color: "var(--text-disable)" }}
        >
          + Adicionar pasta local
        </button>
      </div>
    </>
  );
}
