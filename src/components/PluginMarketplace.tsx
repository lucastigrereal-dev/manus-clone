"use client";

import React, { useState } from "react";
import { PLUGIN_CATALOG } from "@/data/pluginManifests";

const FACTORY_FILTERS = ["All", "Installed", "Research", "Content", "Commercial", "Report", "Automation"];

export default function PluginMarketplace() {
  const [installedIds, setInstalledIds] = useState<Set<string>>(
    () => new Set(PLUGIN_CATALOG.filter((p) => p.installed).map((p) => p.id))
  );
  const [search, setSearch] = useState("");
  const [activeFactory, setActiveFactory] = useState("All");

  const filtered = PLUGIN_CATALOG.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      p.manifest.name.toLowerCase().includes(q) ||
      p.manifest.description.toLowerCase().includes(q) ||
      p.manifest.factory.toLowerCase().includes(q);
    const matchesFactory =
      activeFactory === "All" ||
      (activeFactory === "Installed" && installedIds.has(p.id)) ||
      p.manifest.factory === activeFactory;
    return matchesSearch && matchesFactory;
  });

  const toggleInstall = (id: string) => {
    setInstalledIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div>
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar plugins..."
          className="w-full max-w-md px-4 py-2.5 rounded-lg border text-sm outline-none focus:border-neutral-400 transition-colors"
          style={{
            borderColor: "var(--border-main)",
            color: "var(--text-primary)",
            backgroundColor: "var(--background-menu-white)",
          }}
        />
      </div>

      {/* Factory filter tabs */}
      <div className="flex gap-1 flex-wrap mb-6">
        {FACTORY_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFactory(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              backgroundColor: activeFactory === f ? "var(--Button-black)" : "var(--background-gray-main)",
              color: activeFactory === f ? "white" : "var(--text-secondary)",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Plugin grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((plugin) => {
          const isInstalled = installedIds.has(plugin.id);
          return (
            <div
              key={plugin.id}
              className="p-4 rounded-xl border transition-colors"
              style={{
                borderColor: "var(--border-main)",
                backgroundColor: "var(--background-menu-white)",
              }}
            >
              {/* Header row */}
              <div className="flex items-start justify-between mb-2 gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {plugin.manifest.name}
                    </span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                      style={{
                        backgroundColor: "var(--background-gray-main)",
                        color: "var(--text-tertiary)",
                      }}
                    >
                      v{plugin.manifest.version}
                    </span>
                  </div>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full mt-1 inline-block"
                    style={{
                      backgroundColor: "var(--background-gray-main)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {plugin.manifest.factory}
                  </span>
                </div>

                {isInstalled ? (
                  <button
                    onClick={() => toggleInstall(plugin.id)}
                    className="rounded-lg px-3 py-1 text-xs flex-shrink-0"
                    style={{ border: "1px solid #ef4444", color: "#ef4444" }}
                  >
                    Remover
                  </button>
                ) : (
                  <button
                    onClick={() => toggleInstall(plugin.id)}
                    className="rounded-lg px-3 py-1 text-xs flex-shrink-0 text-white"
                    style={{ backgroundColor: "var(--Button-black)" }}
                  >
                    Instalar
                  </button>
                )}
              </div>

              {/* Description */}
              <p className="text-xs mb-3" style={{ color: "var(--text-tertiary)" }}>
                {plugin.manifest.description}
              </p>

              {/* Footer row */}
              <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-disable)" }}>
                <span>{plugin.manifest.author}</span>
                <div className="flex items-center gap-3">
                  <span>★{plugin.rating}</span>
                  <span>{plugin.downloads.toLocaleString()} downloads</span>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-2 py-12 text-center" style={{ color: "var(--text-tertiary)" }}>
            Nenhum plugin encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
