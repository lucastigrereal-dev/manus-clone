'use client'

import React from 'react'
import useSWR from 'swr'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import type { CostSummary } from '@/app/api/cost/route'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const BAR_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4']

function KPIChip({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex flex-col items-center px-4 py-2 rounded-xl"
      style={{ backgroundColor: 'var(--background-gray-main)', border: '1px solid var(--border-main)' }}
    >
      <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-disable)' }}>
        {label}
      </span>
      <span className="text-base font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>
        {value}
      </span>
    </div>
  )
}

export default function CostLedger() {
  const { data, isLoading } = useSWR<CostSummary>('/api/cost', fetcher, {
    refreshInterval: 30_000,
    revalidateOnFocus: false,
  })

  if (isLoading) {
    return (
      <div className="px-4 py-8 text-center text-sm" style={{ color: 'var(--text-tertiary)' }}>
        Carregando ledger de custos...
      </div>
    )
  }

  if (!data) return null

  const chartData = (data.operations ?? [])
    .filter((op) => op.market_value_brl > 0)
    .sort((a, b) => b.market_value_brl - a.market_value_brl)
    .slice(0, 8)
    .map((op) => ({
      name: op.operation.length > 14 ? op.operation.slice(0, 12) + '…' : op.operation,
      valor: Number(op.market_value_brl.toFixed(2)),
      count: op.count,
    }))

  return (
    <div className="p-4 space-y-4">
      {/* KPI chips */}
      <div className="flex gap-3 flex-wrap">
        <KPIChip
          label="Valor de mercado"
          value={`R$ ${data.total_market_value_brl.toFixed(2)}`}
        />
        <KPIChip
          label="Economia"
          value={`R$ ${data.savings_brl.toFixed(2)}`}
        />
        <KPIChip
          label="Operações"
          value={String(data.operations?.length ?? 0)}
        />
      </div>

      {/* Bar chart */}
      {chartData.length > 0 ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-disable)' }}>
            Valor por operação (R$)
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--background-menu-white)',
                  border: '1px solid var(--border-main)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Valor']}
              />
              <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-sm text-center py-6" style={{ color: 'var(--text-tertiary)' }}>
          Nenhuma operação registrada ainda.
        </p>
      )}

      {/* Warnings */}
      {data.warnings?.length > 0 && (
        <p className="text-xs" style={{ color: '#f59e0b' }}>
          ⚠️ {data.warnings[0]}
        </p>
      )}
    </div>
  )
}
