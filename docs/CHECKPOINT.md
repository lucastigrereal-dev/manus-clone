# CALM Wave 4 — Checkpoint

**Data:** 2026-06-19  
**Branch:** `feature/calm-shell-integration`  
**HEAD:** `4f63614`  
**Testes:** 56/56 pass

---

## O que foi feito (Wave 4)

### 1. Botão "Cancelar Missão" — MissionCard
- `src/components/MissionCard.tsx` — botão visível para `running`, `queued`, `waiting_approval`
- Dialog de confirmação inline
- POST `/api/missions/{id}/cancel` → proxy → `omnis-control :8766`
- Toast success (200) / warning (409) / error (outros)
- `onCancel(id)` callback chamado em sucesso

### 2. Proxy cancel em manus-clone
- `src/app/api/missions/[id]/cancel/route.ts` — repassa para `:8766/missions/{id}/cancel`
- Timeout 5s, tratamento de 404/409/503

### 3. Redis health badge
- `src/app/api/health/route.ts` — lê `checks.redis` do GET `:8766/health`
- `mapRedisStatus()` normaliza `ok/degraded/down/unknown`
- `HealthHeader.tsx` exibe o badge via `/api/health`

### 4. Testes (56 pass)
- `src/components/__tests__/MissionCard.test.tsx` — 10 casos cancel
- `src/app/api/health/__tests__/route.test.ts` — 6 casos Redis

---

## Pendências

### ⚠️ `src/app/api/chat/route.ts` — mudança unstaged
Arquivo tem diff local que migra do proxy Aurora `:8766` para SDK Anthropic direto.
**NÃO commitar** sem aprovação explícita — viola a rota LiteLLM `:4001` (V1 do audit).
Última versão commitada (07b2e3e) usa Aurora proxy, que é o estado correto.

### Push
```
git remote -v                         # verificar
git push private feature/calm-shell-integration
```
Nunca `git push` solto — remote "private", não "origin".

---

## Próximo passo exato

1. Lucas decide: restaurar `chat/route.ts` para Aurora proxy ou criar tarefa separada para migração LiteLLM
2. Quando pronto para push: `git push private feature/calm-shell-integration`
3. Wave 5 (se houver) ou merge em master com GO_MERGE

---

## Não tocar
- `.env` e secrets
- `exports/`
- `data/**/*.jsonl`
- Bare `git push` (sempre especificar remote + branch)
