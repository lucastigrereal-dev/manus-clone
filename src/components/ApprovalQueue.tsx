'use client'

import React, { useCallback } from 'react'
import useSWR from 'swr'
import ApprovalCard, { type ApprovalItem } from './ApprovalCard'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ApprovalQueue() {
  const { data, mutate } = useSWR<{ items: ApprovalItem[]; count: number }>(
    '/api/approvals',
    fetcher,
    { refreshInterval: 10_000, revalidateOnFocus: true }
  )

  const handleDecision = useCallback(
    (approvalId: string, decision: 'approve' | 'reject' | 'modify') => {
      console.info('[ApprovalQueue]', decision, approvalId)
      // Fase 3: POST /api/approvals/{id}/decide
      mutate(
        { items: (data?.items ?? []).filter((i) => i.approvalId !== approvalId), count: 0 },
        false
      )
    },
    [data, mutate]
  )

  const items = data?.items ?? []
  if (!items.length) return null

  return (
    <div className="px-4 pb-2">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-disable)' }}>
          {items.length} aprovação{items.length !== 1 ? 'ões' : ''} pendente{items.length !== 1 ? 's' : ''}
        </p>
        {items.slice(0, 3).map((item) => (
          <ApprovalCard key={item.approvalId} approval={item} onDecision={handleDecision} />
        ))}
      </div>
    </div>
  )
}
