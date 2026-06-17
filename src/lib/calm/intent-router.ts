// src/lib/calm/intent-router.ts
// Classifica a intenção do usuário. Wave 1: regras keyword (rápido, zero custo LLM).
// Wave 3: upgrade para classificação via LLM quando ambíguo.
import type { IntentResult, IntentType, RiskLevel } from '@/types/calm'
import { EXPANSION_RULES } from './intent-rules-expansion'

interface Rule {
  intent: IntentType
  tool: string | null
  risk_level: RiskLevel
  needs_approval: boolean
  patterns: RegExp[]
}

// Ordem importa: regras mais específicas primeiro
const RULES: Rule[] = [
  ...EXPANSION_RULES,
  {
    intent: 'next_action_query',
    tool: null,
    risk_level: 'R0',
    needs_approval: false,
    patterns: [
      /o que (precisa|preciso) (de mim|fazer)/i,
      /qual.*pr[oó]xima a[cç][aã]o/i,
      /o que exige minha m[aã]o/i,
    ],
  },
  {
    intent: 'gargalo_query',
    tool: null,
    risk_level: 'R0',
    needs_approval: false,
    patterns: [
      /qual.*gargalo/i,
      /o que.*(travando|bloqueando|emperrado)/i,
      /fecha o caos/i,
    ],
  },
  {
    intent: 'system_status',
    tool: 'system.health',
    risk_level: 'R0',
    needs_approval: false,
    patterns: [
      /como (est[aá]|anda).*(sistema|omnis|kratos|core)/i,
      /check[\s-]?up/i,
      /clima.*operacional/i,
      /status.*(sistema|kratos|core|akasha)/i,
      /sa[uú]de.*(sistema|omnis)/i,
    ],
  },
  {
    intent: 'knowledge_search',
    tool: 'akasha.search',
    risk_level: 'R0',
    needs_approval: false,
    patterns: [
      /consulta.*(caixa|akasha)/i,
      /procura.*(no |na )?(akasha|caixa|obsidian)/i,
      /o que (sabemos|temos|j[aá] tem).*sobre/i,
      /busca.*(sobre|por)/i,
    ],
  },
  {
    intent: 'canvas_open',
    tool: null,  // Wave 2
    risk_level: 'R0',
    needs_approval: false,
    patterns: [
      /(abre|cria|faz).*(mapa mental|mindmap)/i,
      /transforma.*(em |num )?(quadro|kanban|trello)/i,
      /(monta|cria).*calend[aá]rio/i,
      /mostra.*(conex[oõ]es|integra[cç][oõ]es|arquitetura)/i,
      /organiza.*(como |numa )?p[aá]gina/i,
    ],
  },
  {
    intent: 'mission_execute',
    tool: 'missions.execute',
    risk_level: 'R1',
    needs_approval: true,
    patterns: [
      /^(cria|criar|faz|fazer|constr[oó]i|implementa|gera|gerar)\s/i,
      /transforma.*(em |num )?(app|aplicativo|m[oó]dulo|pacote)/i,
      /executa.*(miss[aã]o|isso|em modo seguro)/i,
      /roda.*(dry[\s-]?run|miss[aã]o)/i,
      /faz (um|uma) (app|automa[cç][aã]o|relat[oó]rio|pacote)/i,
    ],
  },
]

export function classifyIntent(message: string): IntentResult {
  const text = message.trim()

  for (const rule of RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(text)) {
        return {
          intent: rule.intent,
          tool: rule.tool,
          confidence: 0.85,  // keyword match = alta confiança
          risk_level: rule.risk_level,
          needs_approval: rule.needs_approval,
          extracted_query: extractQuery(text, rule.intent),
          reasoning: `keyword match: ${pattern.source.slice(0, 40)}`,
        }
      }
    }
  }

  // Nenhuma regra bateu → conversa normal
  return {
    intent: 'chat_normal',
    tool: 'aurora.chat',
    confidence: 0.6,
    risk_level: 'R0',
    needs_approval: false,
    extracted_query: text,
    reasoning: 'sem match de keyword — tratado como conversa',
  }
}

// Extrai o termo relevante (ex: "consulta a caixa sobre WAF-02" → "WAF-02")
function extractQuery(text: string, intent: IntentType): string {
  if (intent === 'knowledge_search') {
    const m = text.match(/sobre\s+(.+)$/i) || text.match(/(?:caixa|akasha|obsidian)\s+(.+)$/i)
    if (m) return m[1].trim()
  }
  return text
}
