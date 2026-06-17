// src/lib/calm/intent-rules-expansion.ts
// Regras de intenção do pacote de expansão.
// PLUGA no intent-router.ts da Wave 1 — adicione estas regras ao array RULES.
// Mantém o mesmo formato keyword da Wave 1 (zero custo LLM).

import type { IntentType, RiskLevel } from '@/types/calm'

interface ExpansionRule {
  intent: IntentType
  tool: string | null
  risk_level: RiskLevel
  needs_approval: boolean
  patterns: RegExp[]
  canvas_type?: string  // quando intent === 'canvas_open'
}

// ─── Estas regras entram ANTES da regra mission_execute (mais específicas) ──

export const EXPANSION_RULES: ExpansionRule[] = [
  // ── MÉDICO DO SISTEMA (Ideia #2, #16, #25) ──
  {
    intent: 'system_status',
    tool: 'doctor.checkup',
    risk_level: 'R0',
    needs_approval: false,
    patterns: [
      /faz.*check[\s-]?up/i,
      /diagn[oó]stico.*(sistema|omnis)/i,
      /investiga.*(causa|falha|erro)/i,   // perito criminal
      /por que.*(falhou|quebrou|n[aã]o funciona)/i,
    ],
  },

  // ── CANVAS: MINDMAP (Ideia #31) ──
  {
    intent: 'canvas_open',
    tool: 'canvas.create',
    risk_level: 'R0',
    needs_approval: false,
    canvas_type: 'mindmap',
    patterns: [
      /(abre|cria|faz|monta).*(mapa mental|mindmap)/i,
    ],
  },

  // ── CANVAS: KANBAN (Ideia #32) ──
  {
    intent: 'canvas_open',
    tool: 'canvas.create',
    risk_level: 'R0',
    needs_approval: false,
    canvas_type: 'kanban',
    patterns: [
      /transforma.*(em |num )?(quadro|kanban|trello)/i,
      /organiza.*(em |num )?(quadro|board)/i,
      /(cria|faz).*(quadro|kanban)/i,
    ],
  },

  // ── CANVAS: CALENDAR (Ideia #33) ──
  {
    intent: 'canvas_open',
    tool: 'canvas.create',
    risk_level: 'R0',
    needs_approval: false,
    canvas_type: 'calendar',
    patterns: [
      /(monta|cria|faz).*calend[aá]rio/i,
      /calend[aá]rio.*(editorial|conte[uú]do|miss[oõ]es)/i,
    ],
  },

  // ── CANVAS: DOC (Ideia #34 Notion-like) ──
  {
    intent: 'canvas_open',
    tool: 'canvas.create',
    risk_level: 'R0',
    needs_approval: false,
    canvas_type: 'doc',
    patterns: [
      /organiza.*(como |numa )?p[aá]gina/i,
      /transforma.*(em |numa )?p[aá]gina/i,
      /(cria|faz).*(doc|documento|p[aá]gina).*(projeto|plano)/i,
    ],
  },

  // ── CANVAS: INTEGRATION MAP (Ideia #35) ──
  {
    intent: 'canvas_open',
    tool: 'canvas.create',
    risk_level: 'R0',
    needs_approval: false,
    canvas_type: 'integration_map',
    patterns: [
      /mostra.*(conex[oõ]es|integra[cç][oõ]es)/i,
      /(abre|mostra).*canvas.*integra/i,
      /como.*(conectado|ligado|integrado)/i,
    ],
  },

  // ── CANVAS: SYSTEM MAP (Ideia #38) ──
  {
    intent: 'canvas_open',
    tool: 'canvas.create',
    risk_level: 'R0',
    needs_approval: false,
    canvas_type: 'system_map',
    patterns: [
      /mostra.*arquitetura/i,
      /mapa.*(sistema|omnis|arquitetura)/i,
      /(abre|mostra).*mapa.*vivo/i,
    ],
  },

  // ── CANVAS: AUTOMATION FLOW (Ideia #36) ──
  {
    intent: 'canvas_open',
    tool: 'canvas.create',
    risk_level: 'R1',
    needs_approval: true,  // automação real → approval
    canvas_type: 'automation_flow',
    patterns: [
      /cria.*automa[cç][aã]o.*(quando|se)/i,
      /(monta|faz).*fluxo.*automa/i,
    ],
  },

  // ── DEPENDÊNCIAS (Ideia #26) ──
  {
    intent: 'system_status',
    tool: 'doctor.dependencies',
    risk_level: 'R0',
    needs_approval: false,
    patterns: [
      /o que depende d[oae]/i,
      /quais.*depend[eê]ncias/i,
      /se.*(cair|falhar).*o que/i,
    ],
  },

  // ── MEMÓRIA TEMPORAL (Ideia #11) ──
  {
    intent: 'system_status',
    tool: 'doctor.whatchanged',
    risk_level: 'R0',
    needs_approval: false,
    patterns: [
      /o que mudou.*(desde|ontem|hoje)/i,
      /o que.*(aconteceu|rolou).*(ontem|hoje|sess[aã]o)/i,
    ],
  },

  // ── REPLAY (Ideia #13) ──
  {
    intent: 'system_status',
    tool: 'blackbox.replay',
    risk_level: 'R0',
    needs_approval: false,
    patterns: [
      /(mostra|me mostra).*o que aconteceu.*miss[aã]o/i,
      /replay.*(miss[aã]o|execu[cç][aã]o)/i,
      /quem mexeu.*miss[aã]o/i,   // delegation map #14
    ],
  },
]

// Helper para extrair o canvas_type quando intent é canvas_open
export function getCanvasType(message: string): string | null {
  for (const rule of EXPANSION_RULES) {
    if (rule.canvas_type) {
      for (const pattern of rule.patterns) {
        if (pattern.test(message)) return rule.canvas_type
      }
    }
  }
  return null
}
