"use client";

import React from "react";
import useSWR from "swr";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const PIE_COLORS = ["#6366f1", "#f59e0b", "#10b981"];

const MODEL_MOCK = [
  { name: "GPT-4", value: 0.012 },
  { name: "Llama", value: 0.003 },
  { name: "Claude", value: 0.008 },
];

const FACTORY_MOCK = [
  { name: "App", cost: 0.025 },
  { name: "Research", cost: 0.015 },
  { name: "Content", cost: 0.008 },
  { name: "Instagram", cost: 0.006 },
];

function SkeletonBlock({ height = "h-24" }: { height?: string }) {
  return (
    <div
      className={`${height} rounded-xl animate-pulse`}
      style={{ backgroundColor: "var(--background-gray-main)" }}
    />
  );
}

export default function EconomicDashboard() {
  const { data, isLoading } = useSWR("/api/cost", fetcher, {
    dedupingInterval: 30000,
  });

  const totalCost: number = data?.total_cost ?? 0;
  const valueGenerated: number = data?.value_generated ?? 0;
  const totalMissions: number = data?.total_missions ?? 0;

  const roi =
    totalCost > 0 && valueGenerated > 0
      ? `${((valueGenerated / totalCost) * 100).toFixed(0)}%`
      : "N/D";

  const costPerMission =
    totalCost > 0 && totalMissions > 0
      ? `$${(totalCost / totalMissions).toFixed(4)}`
      : "$0.0080";

  return (
    <div
      className="rounded-xl p-4 mb-4"
      style={{
        backgroundColor: "var(--background-menu-white)",
        border: "1px solid var(--border-main)",
      }}
    >
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Dashboard Econômico
        </h2>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
          Análise de custo por missão, modelo e fábrica
        </p>
      </div>

      {/* 2×2 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* ROI Card */}
        <div
          className="rounded-xl p-4"
          style={{
            backgroundColor: "var(--background-gray-main)",
            border: "1px solid var(--border-light)",
          }}
        >
          <p className="text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
            ROI Estimado
          </p>
          {isLoading ? (
            <SkeletonBlock height="h-8" />
          ) : (
            <p className="text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>
              {roi}
            </p>
          )}
        </div>

        {/* Model Cost — PieChart */}
        <div
          className="rounded-xl p-4"
          style={{
            backgroundColor: "var(--background-gray-main)",
            border: "1px solid var(--border-light)",
          }}
        >
          <p className="text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
            Custo por Modelo
          </p>
          {isLoading ? (
            <SkeletonBlock height="h-24" />
          ) : (
            <div className="flex items-center gap-3">
              <ResponsiveContainer width={80} height={80}>
                <PieChart>
                  <Pie
                    data={MODEL_MOCK}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={38}
                    strokeWidth={1}
                  >
                    {MODEL_MOCK.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1">
                {MODEL_MOCK.map((m, i) => (
                  <div key={m.name} className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                    />
                    <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
                      {m.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cost / Mission */}
        <div
          className="rounded-xl p-4"
          style={{
            backgroundColor: "var(--background-gray-main)",
            border: "1px solid var(--border-light)",
          }}
        >
          <p className="text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
            Custo por Missão
          </p>
          {isLoading ? (
            <SkeletonBlock height="h-8" />
          ) : (
            <p className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
              {costPerMission}
            </p>
          )}
        </div>

        {/* Factory Drilldown — BarChart */}
        <div
          className="rounded-xl p-4"
          style={{
            backgroundColor: "var(--background-gray-main)",
            border: "1px solid var(--border-light)",
          }}
        >
          <p className="text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
            Custo por Fábrica
          </p>
          {isLoading ? (
            <SkeletonBlock height="h-24" />
          ) : (
            <ResponsiveContainer width="100%" height={90}>
              <BarChart
                data={FACTORY_MOCK}
                layout="vertical"
                margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "var(--text-secondary)" }}
                  width={58}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(v) => [`$${Number(v).toFixed(3)}`, "Custo"]}
                  contentStyle={{
                    fontSize: 11,
                    backgroundColor: "var(--background-menu-white)",
                    border: "1px solid var(--border-main)",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="cost" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
