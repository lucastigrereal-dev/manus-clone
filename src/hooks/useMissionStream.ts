'use client'

import { useState, useEffect, useRef } from 'react'
import type { MissionEvent } from '@/app/api/missions/[id]/stream/route'

export type { MissionEvent }

interface StreamState {
  events: MissionEvent[]
  status: 'idle' | 'connecting' | 'streaming' | 'done' | 'error'
  error: string | null
}

export function useMissionStream(missionId: string | null): StreamState {
  const [events, setEvents] = useState<MissionEvent[]>([])
  const [status, setStatus] = useState<StreamState['status']>('idle')
  const [error, setError] = useState<string | null>(null)
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    // Clean up previous connection
    if (esRef.current) {
      esRef.current.close()
      esRef.current = null
    }

    if (!missionId) {
      setEvents([])
      setStatus('idle')
      setError(null)
      return
    }

    setEvents([])
    setError(null)
    setStatus('connecting')

    const es = new EventSource(`/api/missions/${missionId}/stream`)
    esRef.current = es

    es.onopen = () => {
      setStatus('streaming')
    }

    es.onmessage = (e) => {
      try {
        const parsed: MissionEvent = JSON.parse(e.data)
        setEvents((prev) => [...prev, parsed])
        if (parsed.type === 'mission_done') {
          setStatus('done')
          es.close()
          esRef.current = null
        }
      } catch {
        // ignore malformed events
      }
    }

    es.onerror = () => {
      setStatus('error')
      setError('Falha na conexão com o stream de missão')
      es.close()
      esRef.current = null
    }

    return () => {
      es.close()
      esRef.current = null
    }
  }, [missionId])

  return { events, status, error }
}
