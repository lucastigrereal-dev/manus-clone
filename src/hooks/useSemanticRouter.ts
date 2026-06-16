export interface SemanticRouterResult {
  needsMemory: boolean
  reason: string
  confidence: number  // 0-1
}

const MEMORY_TRIGGERS = [
  'lembre', 'lembrar', 'lembrança',
  'antes', 'ontem', 'semana passada', 'mês passado',
  'histórico', 'história', 'contexto anterior',
  'akasha', 'memória', 'memórias',
  'missão anterior', 'última missão', 'projeto anterior',
  'já fiz', 'já fizemos', 'já foi feito',
  'buscar', 'busque', 'procure no',
  'o que sabe sobre', 'me fala sobre',
]

const FACTORY_TRIGGERS = [
  'app factory', 'criar app', 'desenvolver',
  'instagram', 'legenda', 'conteúdo',
  'pesquisar', 'benchmark', 'mercado',
  'relatório', 'report',
]

export function routeMessage(message: string): SemanticRouterResult {
  const lower = message.toLowerCase()

  // Check memory triggers
  const memoryHit = MEMORY_TRIGGERS.find((t) => lower.includes(t))
  if (memoryHit) {
    return {
      needsMemory: true,
      reason: `Trigger detectado: "${memoryHit}"`,
      confidence: 0.85,
    }
  }

  // Long messages with question marks often need context
  const isQuestion = lower.includes('?') && message.length > 40
  const isLong = message.length > 200
  if (isQuestion || isLong) {
    return {
      needsMemory: true,
      reason: isLong ? 'Mensagem longa — possível necessidade de contexto' : 'Pergunta complexa',
      confidence: 0.45,
    }
  }

  return {
    needsMemory: false,
    reason: 'Nenhum trigger de memória detectado',
    confidence: 0.9,
  }
}

// Configurable threshold (default: 0.5)
export function useSemanticRouter(threshold = 0.5) {
  const route = (message: string): SemanticRouterResult => {
    const result = routeMessage(message)
    return {
      ...result,
      needsMemory: result.needsMemory && result.confidence >= threshold,
    }
  }
  return { route }
}
