"use client";

import React from "react";
import Modal from "../Modal";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manus Pro" size="md">
      <div className="space-y-6">
        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-medium" style={{ backgroundColor: "#10b981" }}>
            L
          </div>
          <div>
            <div className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>Lucas Tigre</div>
            <div className="text-sm" style={{ color: "var(--text-tertiary)" }}>lucastigrereal@outlook.com</div>
          </div>
        </div>

        {/* Plan Info */}
        <div className="p-4 rounded-xl" style={{ backgroundColor: "var(--background-gray-main)" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Plano Manus Pro</span>
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "var(--Button-black)", color: "white" }}>Ativo</span>
          </div>
          <div className="text-xs mb-3" style={{ color: "var(--text-tertiary)" }}>Renovação: 13 jun 2026</div>
          <div className="flex gap-2">
            <button className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors" style={{ backgroundColor: "var(--Button-black)", color: "white" }}>Gerenciar</button>
            <button className="flex-1 py-2 rounded-lg text-sm font-medium border transition-colors" style={{ borderColor: "var(--border-main)", color: "var(--text-primary)" }}>Atualizar</button>
          </div>
        </div>

        {/* Credits */}
        <div>
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Créditos</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Totais", value: "0" },
              { label: "Gratuitos", value: "0" },
              { label: "Mensais", value: "0 / 4.000" },
              { label: "Diários renováveis", value: "300" },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-lg" style={{ backgroundColor: "var(--background-gray-main)" }}>
                <div className="text-xs mb-1" style={{ color: "var(--text-tertiary)" }}>{item.label}</div>
                <div className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{item.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs" style={{ color: "var(--text-tertiary)" }}>Renovam às 00:00</div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t" style={{ borderColor: "var(--border-main)" }}>
          <button className="flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors hover:bg-neutral-50" style={{ borderColor: "var(--border-main)", color: "var(--text-primary)" }}>Ver uso →</button>
          <button className="flex-1 py-2.5 rounded-lg text-sm font-medium text-red-600 border border-red-200 transition-colors hover:bg-red-50">Sair</button>
        </div>
      </div>
    </Modal>
  );
}
