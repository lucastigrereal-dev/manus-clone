"use client";

import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export default function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4",
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`w-full ${sizeClasses[size]} rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto`}
          style={{
            backgroundColor: "var(--background-menu-white)",
            border: "1px solid var(--border-main)",
          }}
        >
          {title && (
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border-main)" }}>
              <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{title}</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-neutral-100 transition-colors"
                style={{ color: "var(--text-tertiary)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </>
  );
}
