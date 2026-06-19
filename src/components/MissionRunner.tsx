'use client'

import React, { useEffect, useRef, useState } from 'react'
import ApprovalCard, { ApprovalItem } from '@/components/ApprovalCard'

// ─── Tipos canônicos ──────────────────────────────────────────────────────────
// risk_level snake_case — nunca riskTier / riskLevel camelCase
// IDs: run_id / mission_id vindos do backend (ULID gerado pelo Core)

interface ExecuteResult {
  run_id: string
  mission_id: string
  status: 'needs_approval' | 'running' | 'done' | 'error'
  dry_run: boolean
  next_action?: string
  request_text?: string
}

interface StreamEvent {
  event_type?: string   // canônico novo stream
  type?: string         // legado [id]/stream
  run_id?: string
  data?: {
    step_id?: string
    label?: string
    agent?: string
    progress?: number
    summary?: string
    risk_level?: string
    [key: string]: unknown
  }
}

type StepState = 'pending' | 'running' | 'done'

interface Step {
  step_id: string
  label: string
  agent?: string
  state: StepState
  progress?: number
}

type RunPhase = 'loading' | 'needs_approval' | 'running' | 'done' | 'error'

interface MissionRunnerProps {
  text: string
  onDone?: (result: ExecuteResult) => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AGENT_COLOR: Record<string, string> = {
  aurora: '#10b981',
  hermes: '#3b82f6',
  vulcano: '#8b5cf6',
  muse: '#f59e0b',
}

const agentColor = (agent?: string) => AGENT_COLOR[agent ?? ''] ?? '#6b7280'

const eventKind = (evt: StreamEvent) =>
  (evt.event_type ?? evt.type ?? '').toLowerCase()

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function StepCard({ step }: { step: Step }) {
  const color = agentColor(step.agent)
  const icon = step.state === 'done' ? '✓' : step.state === 'running' ? '◌' : '○'

  return (
    <div
      className="flex items-start gap-3 px-4 py-2.5 rounded-xl"
      style={{
        backgroundColor: 'var(--background-menu-white)',
        border: '1px solid var(--border-main)',
        opacity: step.state === 'pending' ? 0.5 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      <span
        className={`mt-0.5 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shrink-0 ${
          step.state === 'running' ? 'animate-spin' : ''
        }`}
        style={{
          backgroundColor: step.state === 'done' ? color : 'transparent',
          color: step.state === 'done' ? 'white' : color,
          border: step.state !== 'done' ? `1.5px solid ${color}` : 'none',
        }}
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {step.label}
        </p>
        {step.agent && (
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            {step.agent}
            {step.state === 'running' && step.progress != null && ` · ${step.progress}%`}
          </p>
        )}
        {step.state === 'running' && (
          <div
            className="mt-1.5 h-1 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--border-main)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${step.progress ?? 50}%`, backgroundColor: color }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function ResultCard({ summary, runId }: { summary: string; runId: string }) {
  return (
    <div
      className="rounded-2xl p-4 mt-2"
      style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac' }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: '#16a34a' }}
        >
          ✓ Missão concluída
        </span>
        <span
          className="text-[10px] px-1.5 py-0.5 rounded font-mono"
          style={{ backgroundColor: '#dcfce7', color: '#15803d' }}
        >
          dry_run
        </span>
      </div>
      <p className="text-sm" style={{ color: '#166534' }}>
        {summary}
      </p>
      <p className="text-[10px] mt-2 font-mono" style={{ color: '#4ade80' }}>
        {runId}
      </p>
    </div>
  )
}

function LoadingPulse({ label = 'Iniciando missão…' }: { label?: string }) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-3 rounded-xl"
      style={{ border: '1px solid var(--border-main)' }}
    >
      {[0, 0.1, 0.2].map((d, i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full animate-bounce"
          style={{ backgroundColor: 'var(--text-tertiary)', animationDelay: `${d}s` }}
        />
      ))}
      <span className="text-xs ml-1" style={{ color: 'var(--text-tertiary)' }}>
        {label}
      </span>
    </div>
  )
}

// ─── MissionRunner ────────────────────────────────────────────────────────────

export default function MissionRunner({ text, onDone }: MissionRunnerProps) {
  const [phase, setPhase] = useState<RunPhase>('loading')
  const [steps, setSteps] = useState<Step[]>([])
  const [doneSummary, setDoneSummary] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [approvalItem, setApprovalItem] = useState<ApprovalItem | null>(null)

  // Refs para evitar stale closures em callbacks assíncronos
  const runIdRef = useRef<string>('')
  const missionIdRef = useRef<string>('')
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null)

  // ── 1. Execute on mount ──
  useEffect(() => {
    let cancelled = false

    async function execute() {
      try {
        const res = await fetch('/api/missions/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ request_text: text }),
        })
        const data: ExecuteResult = await res.json()
        if (cancelled) return

        runIdRef.current = data.run_id
        missionIdRef.current = data.mission_id

        if (data.status === 'needs_approval') {
          setApprovalItem({
            approvalId: data.run_id,
            summary: data.next_action ?? `Executar: "${text.slice(0, 80)}${text.length > 80 ? '…' : ''}"`,
            risk_level: 'R1',
            mission_id: data.mission_id,
          })
          setPhase('needs_approval')
        } else if (data.status === 'running') {
          setPhase('running')
          openStream(data.run_id)
        } else if (data.status === 'done') {
          setDoneSummary(data.next_action ?? 'Concluído')
          setPhase('done')
          onDoneRef.current?.(data)
        } else {
          setErrorMsg(data.next_action ?? 'Erro ao iniciar missão')
          setPhase('error')
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setErrorMsg(err instanceof Error ? err.message : 'Falha na comunicação com o Core')
          setPhase('error')
        }
      }
    }

    execute()
    return () => {
      cancelled = true
      readerRef.current?.cancel()
    }
  }, [text]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── 2. SSE stream ──
  function openStream(run_id: string) {
    const decoder = new TextDecoder()
    let buffer = ''

    fetch(`/api/missions/stream?run_id=${encodeURIComponent(run_id)}`)
      .then((res) => {
        if (!res.body) throw new Error('Sem corpo de stream')
        const reader = res.body.getReader()
        readerRef.current = reader

        const pump = (): Promise<void> =>
          reader.read().then(({ done, value }) => {
            if (done) return

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() ?? ''

            for (const line of lines) {
              if (!line.startsWith('data:')) continue
              const raw = line.slice(5).trim()
              if (!raw) continue
              try {
                applyEvent(JSON.parse(raw) as StreamEvent, run_id)
              } catch {
                // JSON malformado — ignora
              }
            }

            return pump()
          })

        return pump()
      })
      .catch((err: unknown) => {
        setErrorMsg(err instanceof Error ? err.message : 'Erro no stream')
        setPhase('error')
      })
  }

  // ── 3. Aplicar evento ──
  function applyEvent(evt: StreamEvent, run_id: string) {
    const kind = eventKind(evt)
    const d = evt.data ?? {}

    switch (kind) {
      case 'step_start': {
        const step_id = (d.step_id as string) ?? `s_${Date.now()}`
        setSteps((prev) => {
          if (prev.find((s) => s.step_id === step_id)) {
            return prev.map((s) =>
              s.step_id === step_id
                ? { ...s, state: 'running', label: (d.label as string) ?? s.label, agent: (d.agent as string) ?? s.agent }
                : s
            )
          }
          return [
            ...prev,
            { step_id, label: (d.label as string) ?? step_id, agent: d.agent as string | undefined, state: 'running' },
          ]
        })
        break
      }

      case 'step_progress': {
        const step_id = d.step_id as string
        setSteps((prev) =>
          prev.map((s) =>
            s.step_id === step_id ? { ...s, progress: d.progress as number } : s
          )
        )
        break
      }

      case 'step_done': {
        const step_id = d.step_id as string
        setSteps((prev) =>
          prev.map((s) =>
            s.step_id === step_id ? { ...s, state: 'done', progress: undefined } : s
          )
        )
        break
      }

      case 'mission_done': {
        setDoneSummary((d.summary as string) ?? 'Missão concluída')
        setPhase('done')
        readerRef.current?.cancel()
        onDoneRef.current?.({
          run_id,
          mission_id: missionIdRef.current,
          status: 'done',
          dry_run: true,
        })
        break
      }
    }
  }

  // ── 4. Decisão de aprovação ──
  function handleDecision(approvalId: string, decision: 'approve' | 'reject' | 'modify') {
    if (decision === 'reject') {
      setErrorMsg('Missão rejeitada pelo operador')
      setPhase('error')
      return
    }
    if (decision === 'modify') {
      setErrorMsg('Modificação solicitada — edite a mensagem e tente novamente')
      setPhase('error')
      return
    }
    // approve → registra a decisão no backend, depois abre stream
    const run_id = runIdRef.current
    const actionId = approvalItem?.action_id

    const endpoint = actionId
      ? `/api/factory/publish/${actionId}/decide`
      : `/api/approvals/${approvalId}/decide`

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision: 'approve' }),
    }).catch(() => {
      // decide call is best-effort; stream proceeds regardless
    })

    if (run_id) openStream(run_id)
  }

  // ── Render ──
  const run_id = runIdRef.current

  return (
    <div className="my-2 space-y-2">
      {/* Badge de missão */}
      <div className="flex items-center gap-2">
        <span
          className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: 'var(--background-nav)',
            color: 'var(--text-tertiary)',
            border: '1px solid var(--border-main)',
          }}
        >
          Missão · dry_run
        </span>
        {run_id && (
          <span className="text-[10px] font-mono" style={{ color: 'var(--text-disable)' }}>
            {run_id}
          </span>
        )}
      </div>

      {/* Loading */}
      {phase === 'loading' && <LoadingPulse />}

      {/* Needs approval */}
      {phase === 'needs_approval' && approvalItem && (
        <ApprovalCard approval={approvalItem} onDecision={handleDecision} />
      )}

      {/* StepCards — visíveis enquanto running e quando done (histórico) */}
      {(phase === 'running' || phase === 'done') && steps.length > 0 && (
        <div className="space-y-1.5">
          {steps.map((step) => (
            <StepCard key={step.step_id} step={step} />
          ))}
        </div>
      )}

      {/* Running sem steps ainda */}
      {phase === 'running' && steps.length === 0 && (
        <LoadingPulse label="Executando missão…" />
      )}

      {/* Result */}
      {phase === 'done' && <ResultCard summary={doneSummary} runId={run_id} />}

      {/* Error */}
      {phase === 'error' && (
        <div
          className="rounded-xl p-3 text-sm"
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
          }}
        >
          ⚠️ {errorMsg}
        </div>
      )}
    </div>
  )
}
