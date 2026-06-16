"use client";

import React from "react";
import FactoryOSComposer from "@/components/FactoryOSComposer";

export default function FactoryOSView() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
          Factory OS
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Compose and orchestrate factory pipelines visually. Drag to connect nodes and execute the flow.
        </p>
      </div>
      <div
        className="rounded-xl overflow-hidden border"
        style={{
          borderColor: "var(--border-main)",
          backgroundColor: "var(--background-menu-white)",
        }}
      >
        <FactoryOSComposer />
      </div>
    </div>
  );
}
