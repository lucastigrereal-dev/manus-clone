'use client'

import React from 'react'

export interface ApprovalItem {
  approvalId: string
  summary: string
  risk_level: string
  mission_id?: string | null
  created_at?: string
  /** Present when this approval is for a factory publish action (Wave 3). */
  action_id?: string
}

interface ApprovalCardProps {
  approval: ApprovalItem
  onDecision: (approvalId: string, decision: 'approve' | 'reject' | 'modify') => void
}

const RISK_COLORS: Record<string, string> = {
  R0: '#10b981', R1: '#3b82f6', R2: '#f59e0b', R3: '#ef4444', R4: '#dc2626',
}

export default function ApprovalCard({ approval, onDecision }: ApprovalCardProps) {
  const riskColor = RISK_COLORS[approval.risk_level] ?? '#f59e0b'

  return (
    <div
      className="rounded-2xl p-4 my-2"
      style={{ border: `1px solid ${riskColor}40`, backgroundColor: `${riskColor}08` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: riskColor }}>
          ⚡ Aprovação necessária
        </span>
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded"
          style={{ border: `1px solid ${riskColor}`, color: riskColor, backgroundColor: `${riskColor}14` }}
        >
          {approval.risk_level}
        </span>
      </div>
      <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
        {approval.summary}
      </h4>
      {approval.mission_id && (
        <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>
          Missão: {approval.mission_id}
        </p>
      )}
      <div className="flex gap-2 flex-wrap mt-3">
        <button
          onClick={() => onDecision(approval.approvalId, 'approve')}
          className="px-3 py-1.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
          style={{ backgroundColor: '#10b981', color: 'white' }}
        >
          ✓ Aprovar
        </button>
        <button
          onClick={() => onDecision(approval.approvalId, 'reject')}
          className="px-3 py-1.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
          style={{ backgroundColor: '#ef4444', color: 'white' }}
        >
          ✗ Rejeitar
        </button>
        <button
          onClick={() => onDecision(approval.approvalId, 'modify')}
          className="px-3 py-1.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
          style={{ backgroundColor: 'var(--background-nav)', color: 'var(--text-primary)', border: '1px solid var(--border-main)' }}
        >
          ✎ Modificar
        </button>
      </div>
    </div>
  )
}
