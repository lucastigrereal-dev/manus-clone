'use client'

import React, { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

interface AkashaResult {
  id: string
  content: string
  score: number
  source: string | null
  collection: string | null
}

interface AkashaSearchResponse {
  results: AkashaResult[]
  query: string
  total: number
  latency_ms?: number
  error?: string
}

const fetcher = (q: string): Promise<AkashaSearchResponse> =>
  fetch(`/api/akasha/search?q=${encodeURIComponent(q)}&limit=5`).then((r) => r.json())

const qc = new QueryClient()

function AkashaSearchBarInner() {
  const [input, setInput] = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = useCallback((v: string) => {
    setInput(v)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setDebouncedQ(v.trim()), 400)
  }, [])

  const { data, isFetching } = useQuery({
    queryKey: ['akasha-search', debouncedQ],
    queryFn: () => fetcher(debouncedQ),
    enabled: debouncedQ.length >= 2,
    staleTime: 60_000,
  })

  return (
    <div className="w-full">
      {/* Search input */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-xl"
        style={{ border: '1px solid var(--border-main)', backgroundColor: 'var(--background-menu-white)' }}
      >
        <span style={{ color: 'var(--text-tertiary)' }}>🧠</span>
        <input
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Buscar no AKASHA..."
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: 'var(--text-primary)' }}
        />
        {isFetching && (
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>buscando...</span>
        )}
        {data?.latency_ms && (
          <span className="text-[10px]" style={{ color: 'var(--text-disable)' }}>
            {data.latency_ms}ms
          </span>
        )}
      </div>

      {/* Results */}
      {data?.results && data.results.length > 0 && (
        <div className="mt-2 space-y-1.5">
          {data.results.map((r) => (
            <div
              key={r.id}
              className="px-3 py-2.5 rounded-xl text-sm"
              style={{
                border: '1px solid var(--border-main)',
                backgroundColor: 'var(--background-gray-main)',
              }}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: 'var(--text-tertiary)' }}>
                  {r.collection ?? 'geral'} · {r.source ?? 'akasha'}
                </span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: r.score >= 0.8 ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                    color: r.score >= 0.8 ? '#10b981' : '#f59e0b',
                  }}
                >
                  {Math.round(r.score * 100)}%
                </span>
              </div>
              <p className="text-xs leading-relaxed line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                {r.content}
              </p>
            </div>
          ))}
          <p className="text-[10px] text-right" style={{ color: 'var(--text-disable)' }}>
            {data.total} resultado{data.total !== 1 ? 's' : ''} no AKASHA
          </p>
        </div>
      )}

      {data?.results?.length === 0 && debouncedQ.length >= 2 && !isFetching && (
        <p className="mt-2 text-xs text-center py-3" style={{ color: 'var(--text-tertiary)' }}>
          Nenhum resultado para "{debouncedQ}"
        </p>
      )}
    </div>
  )
}

export default function AkashaSearchBar() {
  return (
    <QueryClientProvider client={qc}>
      <AkashaSearchBarInner />
    </QueryClientProvider>
  )
}
