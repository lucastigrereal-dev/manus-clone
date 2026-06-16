import { NextResponse } from 'next/server'

export interface Project {
  id: string
  name: string
  status: 'active' | 'done' | 'failed' | 'unknown'
  factory?: string
}

const FALLBACK_PROJECTS: Project[] = [
  { id: 'fam-tigre', name: 'Família Tigre Travel 2026', status: 'active', factory: 'Research' },
  { id: 'publisher-os', name: 'Publisher OS', status: 'active', factory: 'Content' },
  { id: 'app-factory', name: 'App Factory v3.1', status: 'active', factory: 'App' },
  { id: 'lead-mining', name: 'Lead Mining Engine', status: 'active', factory: 'SDR' },
  { id: 'omnisverso', name: 'OMNISVERSO Runtime', status: 'active', factory: 'Dev' },
]

function mapStatus(s: string): Project['status'] {
  if (!s) return 'unknown'
  const lower = s.toLowerCase()
  if (lower.includes('active') || lower.includes('running') || lower.includes('in_progress')) return 'active'
  if (lower.includes('done') || lower.includes('completed') || lower.includes('success')) return 'done'
  if (lower.includes('fail') || lower.includes('error')) return 'failed'
  return 'unknown'
}

export async function GET() {
  try {
    const res = await fetch('http://localhost:8765/missions?limit=20', {
      signal: AbortSignal.timeout(3000),
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return NextResponse.json(FALLBACK_PROJECTS)

    const data = await res.json()
    const missions: unknown[] = Array.isArray(data?.missions) ? data.missions : []

    if (!missions.length) return NextResponse.json(FALLBACK_PROJECTS)

    const projects: Project[] = missions.slice(0, 10).map((m: any, i: number) => ({
      id: String(m?.id ?? m?.mission_id ?? `proj_${i}`),
      name: String(m?.title ?? m?.objective ?? m?.name ?? `Missão ${i + 1}`).slice(0, 60),
      status: mapStatus(String(m?.status ?? '')),
      factory: m?.factory ?? m?.factory_type ?? undefined,
    }))

    return NextResponse.json(projects)
  } catch {
    return NextResponse.json(FALLBACK_PROJECTS)
  }
}
