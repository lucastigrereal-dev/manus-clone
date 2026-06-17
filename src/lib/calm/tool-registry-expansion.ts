// src/lib/calm/tool-registry-expansion.ts
// Ferramentas do pacote de expansão. PLUGA no tool-registry.ts da Wave 1.
// Adicione estas entradas ao objeto TOOL_REGISTRY.

import type { ToolDefinition } from '@/types/calm'

export const EXPANSION_TOOLS: Record<string, ToolDefinition> = {
  'doctor.checkup': {
    key: 'doctor.checkup',
    endpoint: '/api/doctor/checkup',
    method: 'GET',
    risk_level: 'R0',
    needs_approval: false,
    produces_stream: false,
    produces_artifact: false,
    result_card: 'DiagnosisCard',
    description: 'Check-up completo do OMNIS com diagnóstico de 3 níveis',
  },
  'doctor.dependencies': {
    key: 'doctor.dependencies',
    endpoint: '/api/doctor/dependencies',
    method: 'GET',
    risk_level: 'R0',
    needs_approval: false,
    produces_stream: false,
    produces_artifact: false,
    result_card: 'text',
    description: 'Mapa de dependências em linguagem natural',
  },
  'doctor.whatchanged': {
    key: 'doctor.whatchanged',
    endpoint: '/api/doctor/whatchanged',
    method: 'GET',
    risk_level: 'R0',
    needs_approval: false,
    produces_stream: false,
    produces_artifact: false,
    result_card: 'text',
    description: 'Memória temporal — o que mudou desde ontem',
  },
  'canvas.create': {
    key: 'canvas.create',
    endpoint: '/api/canvas/create',
    method: 'POST',
    risk_level: 'R0',
    needs_approval: false,
    produces_stream: false,
    produces_artifact: true,
    result_card: 'CanvasCard',
    description: 'Cria um canvas (mindmap, kanban, system_map, integration_map…)',
  },
  'blackbox.replay': {
    key: 'blackbox.replay',
    endpoint: '/api/blackbox/replay',
    method: 'GET',
    risk_level: 'R0',
    needs_approval: false,
    produces_stream: false,
    produces_artifact: false,
    result_card: 'BlackBoxReplayCard',
    description: 'Replay de execução de uma missão para auditoria',
  },
  'decisions.inbox': {
    key: 'decisions.inbox',
    endpoint: '/api/decisions/inbox',
    method: 'GET',
    risk_level: 'R0',
    needs_approval: false,
    produces_stream: false,
    produces_artifact: false,
    result_card: 'DecisionInboxCard',
    description: 'Lista decisões pendentes que exigem a mão do humano',
  },
}
