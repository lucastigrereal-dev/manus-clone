export interface Playbook {
  errorClass: string
  playbookId: string
  description: string
  suggestedAction: string
  severity: 'low' | 'medium' | 'high'
  autoRetry: boolean
}

export const FAILURE_PLAYBOOKS: Playbook[] = [
  { errorClass: 'RATELIMIT', playbookId: 'pb_ratelimit', description: 'Rate limit atingido no provider', suggestedAction: 'retry_with_backoff', severity: 'medium', autoRetry: true },
  { errorClass: 'TIMEOUT', playbookId: 'pb_timeout', description: 'Timeout na execução da wave', suggestedAction: 'decompose_mission', severity: 'medium', autoRetry: false },
  { errorClass: 'CONTEXT_OVERFLOW', playbookId: 'pb_context', description: 'Context window excedido', suggestedAction: 'summarize_and_retry', severity: 'high', autoRetry: false },
  { errorClass: 'AUTH_FAILED', playbookId: 'pb_auth', description: 'Falha de autenticação em serviço externo', suggestedAction: 'check_credentials', severity: 'high', autoRetry: false },
  { errorClass: 'NETWORK_ERROR', playbookId: 'pb_network', description: 'Erro de rede ou serviço indisponível', suggestedAction: 'retry_with_backoff', severity: 'low', autoRetry: true },
  { errorClass: 'CONTENT_POLICY', playbookId: 'pb_policy', description: 'Conteúdo bloqueado por política', suggestedAction: 'rephrase_and_retry', severity: 'medium', autoRetry: false },
  { errorClass: 'UNKNOWN', playbookId: 'pb_unknown', description: 'Erro não classificado', suggestedAction: 'escalate_to_human', severity: 'high', autoRetry: false },
]

export function getPlaybook(errorClass: string): Playbook {
  return FAILURE_PLAYBOOKS.find(p => p.errorClass === errorClass) ?? FAILURE_PLAYBOOKS[FAILURE_PLAYBOOKS.length - 1]
}
