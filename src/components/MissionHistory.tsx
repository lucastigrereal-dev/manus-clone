'use client'

import React from 'react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type MissionStatus = 'done' | 'running' | 'failed' | 'queued'

interface Mission {
  id: string
  title: string
  status: MissionStatus
  updatedAt: Date
  factory: string
}

const MOCK_MISSIONS: Mission[] = [
  { id: 'mis_01JX001', title: 'Benchmark hotéis Natal', status: 'done', updatedAt: new Date(Date.now() - 3600000), factory: 'Research' },
  { id: 'mis_01JX002', title: 'App Factory sprint 3', status: 'running', updatedAt: new Date(Date.now() - 300000), factory: 'App' },
  { id: 'mis_01JX003', title: 'Conteúdo Instagram Karina', status: 'failed', updatedAt: new Date(Date.now() - 7200000), factory: 'Content' },
]

const STATUS_CONFIG: Record<MissionStatus, { label: string; dotStyle: React.CSSProperties; pulse: boolean }> = {
  done:    { label: 'Concluída', dotStyle: { backgroundColor: '#10b981' }, pulse: false },
  running: { label: 'Rodando',   dotStyle: { backgroundColor: '#f59e0b' }, pulse: true  },
  failed:  { label: 'Falhou',    dotStyle: { backgroundColor: '#ef4444' }, pulse: false },
  queued:  { label: 'Na fila',   dotStyle: {},                             pulse: false  },
}

async function fetchMissions(): Promise<Mission[]> {
  // Phase 2: replace with GET /api/missions from OMNIS Core (port 8765)
  return MOCK_MISSIONS
}

const queryClient = new QueryClient()

function MissionHistoryInner() {
  const { data: missions = [], isLoading } = useQuery({
    queryKey: ['missions'],
    queryFn: fetchMissions,
    staleTime: 30_000,
  })

  if (isLoading) {
    return (
      <div className="px-3 py-2 text-xs" style={{ color: 'var(--text-disable)' }}>
        Carregando missões...
      </div>
    )
  }

  return (
    <div className="space-y-0.5">
      {missions.slice(0, 20).map((m) => {
        const cfg = STATUS_CONFIG[m.status]
        return (
          <button
            key={m.id}
            onClick={() => console.info('[MissionHistory] resume:', m.id)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors hover:opacity-80"
            style={{ color: 'var(--text-secondary)' }}
          >
            {/* Status dot */}
            <span
              className={`w-2 h-2 rounded-full flex-shrink-0${cfg.pulse ? ' pulse-dot' : ''}`}
              style={cfg.pulse
                ? { backgroundColor: '#f59e0b' }
                : m.status === 'queued'
                  ? { backgroundColor: 'var(--text-disable)' }
                  : cfg.dotStyle}
            />
            {/* Title + meta */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                {m.title}
              </p>
              <p className="text-[10px] truncate" style={{ color: 'var(--text-tertiary)' }}>
                {m.factory} · {formatDistanceToNow(m.updatedAt, { addSuffix: true, locale: ptBR })}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default function MissionHistory() {
  return (
    <QueryClientProvider client={queryClient}>
      <MissionHistoryInner />
    </QueryClientProvider>
  )
}
