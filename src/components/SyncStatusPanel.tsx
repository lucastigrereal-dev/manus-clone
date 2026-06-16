"use client";

import React, { useState } from "react";
import useSWR from "swr";

interface SyncClient {
  id: string;
  name: string;
  lastEventId: string;
  connected: boolean;
  lag: number | null;
}

interface SyncStatus {
  clients: SyncClient[];
  streamId: string;
  totalEvents: number;
  lastEventId: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function LagBadge({ lag }: { lag: number | null }) {
  if (lag === null) {
    return (
      <span
        className="text-[11px] px-2 py-0.5 rounded-full font-medium"
        style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#dc2626" }}
      >
        offline
      </span>
    );
  }
  if (lag === 0) {
    return (
      <span
        className="text-[11px] px-2 py-0.5 rounded-full font-medium"
        style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#059669" }}
      >
        synced
      </span>
    );
  }
  return (
    <span
      className="text-[11px] px-2 py-0.5 rounded-full font-medium"
      style={{ backgroundColor: "rgba(245,158,11,0.1)", color: "#b45309" }}
    >
      lag +{lag}
    </span>
  );
}

export default function SyncStatusPanel() {
  const { data, error, isLoading, mutate } = useSWR<SyncStatus>(
    "/api/sync",
    fetcher,
    { refreshInterval: 5000 }
  );
  const [forcing, setForcing] = useState(false);
  const [forceMsg, setForceMsg] = useState<string | null>(null);

  const handleForce = async () => {
    setForcing(true);
    setForceMsg(null);
    try {
      const res = await fetch("/api/sync", { method: "POST" });
      const body = await res.json();
      setForceMsg(body.message ?? "Sync disparado");
      mutate();
    } catch {
      setForceMsg("Erro ao forçar sync");
    } finally {
      setForcing(false);
    }
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid var(--border-main)", backgroundColor: "var(--background-menu-white)" }}
    >
      <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border-main)" }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Sincronização Cross-Client
            </div>
            <div className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
              Redis Streams XREAD — uma verdade operacional
            </div>
          </div>
          <button
            onClick={handleForce}
            disabled={forcing}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              backgroundColor: "var(--background-gray-main)",
              border: "1px solid var(--border-main)",
              color: "var(--text-secondary)",
              opacity: forcing ? 0.6 : 1,
            }}
          >
            {forcing ? "Forçando…" : "Forçar sincronização"}
          </button>
        </div>
        {forceMsg && (
          <div className="mt-2 text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#059669" }}>
            {forceMsg}
          </div>
        )}
      </div>

      <div className="p-4">
        {isLoading && (
          <div className="text-xs text-center py-4" style={{ color: "var(--text-tertiary)" }}>
            Carregando status…
          </div>
        )}
        {error && (
          <div className="text-xs text-center py-4" style={{ color: "#dc2626" }}>
            Erro ao carregar status
          </div>
        )}
        {data && (
          <>
            <div className="flex gap-4 mb-4 text-xs" style={{ color: "var(--text-secondary)" }}>
              <span>
                Stream: <span className="font-mono font-medium" style={{ color: "var(--text-primary)" }}>{data.streamId}</span>
              </span>
              <span>
                Total eventos: <span className="font-medium" style={{ color: "var(--text-primary)" }}>{data.totalEvents}</span>
              </span>
              <span>
                Último: <span className="font-mono font-medium" style={{ color: "var(--text-primary)" }}>{data.lastEventId}</span>
              </span>
            </div>

            <div className="space-y-2">
              {data.clients.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg"
                  style={{ backgroundColor: "var(--background-gray-main)", border: "1px solid var(--border-light)" }}
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: client.connected ? "#10b981" : "rgba(120,120,120,0.5)" }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                      {client.name}
                    </div>
                    <div className="text-[11px] font-mono" style={{ color: "var(--text-tertiary)" }}>
                      {client.lastEventId}
                    </div>
                  </div>
                  <LagBadge lag={client.lag} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
