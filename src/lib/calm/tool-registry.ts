// src/lib/calm/tool-registry.ts
// Catálogo de ferramentas. O CALM sabe o que existe — o usuário não precisa saber.
import type { ToolDefinition } from '@/types/calm'
import { EXPANSION_TOOLS } from './tool-registry-expansion'

const BASE_TOOLS: Record<string, ToolDefinition> = {
  'aurora.chat': {
    key: 'aurora.chat',
    endpoint: '/api/chat',
    method: 'POST',
    risk_level: 'R0',
    needs_approval: false,
    produces_stream: false,
    produces_artifact: false,
    result_card: 'text',
    description: 'Conversa com a Aurora (Core :8766)',
  },
  'akasha.search': {
    key: 'akasha.search',
    endpoint: '/api/akasha/search',
    method: 'GET',
    risk_level: 'R0',
    needs_approval: false,
    produces_stream: false,
    produces_artifact: false,
    result_card: 'AkashaSearchCard',
    description: 'Busca na memória AKASHA / Caixa',
  },
  'missions.execute': {
    key: 'missions.execute',
    endpoint: '/api/missions/execute',
    method: 'POST',
    risk_level: 'R1',
    needs_approval: true,
    produces_stream: true,
    produces_artifact: true,
    result_card: 'MissionRunner',
    description: 'Cria e executa missão (dry_run por padrão)',
  },
  'system.health': {
    key: 'system.health',
    endpoint: '/api/health',
    method: 'GET',
    risk_level: 'R0',
    needs_approval: false,
    produces_stream: false,
    produces_artifact: false,
    result_card: 'HealthCard',
    description: 'Estado de saúde do sistema OMNIS',
  },
}

export const TOOL_REGISTRY: Record<string, ToolDefinition> = { ...BASE_TOOLS, ...EXPANSION_TOOLS }

export function getTool(key: string): ToolDefinition | null {
  return TOOL_REGISTRY[key] ?? null
}

// Lista só ferramentas cujo serviço está UP (consultado em runtime)
export function listAvailableTools(): ToolDefinition[] {
  return Object.values(TOOL_REGISTRY)
}
