# CALM_AUDIT_REPORT.md
**Data:** 2026-06-16  
**Auditor:** Sonnet 4.6 (dry_run, read-only)  
**Repo:** `C:\Users\lucas\manus-clone`  
**Branch:** `feature/calm-shell-integration`

---

## GATE G1 — AGUARDANDO CONFIRMAÇÃO DO LUCAS ANTES DE QUALQUER AÇÃO

---

## 1. VIOLAÇÕES CRÍTICAS (corrigir antes de qualquer outra coisa)

### 🔴 V1 — SDK Anthropic chamado diretamente (PERMANENTEMENTE VIOLADO)

**Arquivo:** `src/app/api/chat/route.ts`  
**Linha:** `fetch("https://api.anthropic.com/v1/messages", ...)`  
**Modelo hard-coded:** `claude-sonnet-4-6`

**Regra violada:** "NUNCA chamar SDK Anthropic/OpenAI direto → sempre via LiteLLM :4001"  
**Impacto:** Toda conversa do chat bypass o roteamento OMNIS e chama Anthropic direto

**Fix necessário:** Redirecionar para `http://localhost:4001/v1/chat/completions` com model `ollama-fast`

---

### 🔴 V2 — IDs não são ULID

**Arquivo:** `src/stores/uiStore.ts` linhas addTab() e addToast()  
**Código atual:** `Math.random().toString(36).slice(2, 9)` / `Math.random().toString(36).slice(2)`  
**Regra violada:** "IDs sempre ULID — NUNCA UUID v4 (ou random)"  
**Fix necessário:** Instalar `ulidx` e substituir todos os IDs aleatórios

---

### 🟡 V3 — AKASHA route aponta para porta errada

**Arquivo:** `src/app/api/akasha/search/route.ts`  
**Atual:** `http://localhost:8765/akasha/search` (POST)  
**Correto:** `http://localhost:8000/api/akasha/search?q={query}` (GET, conforme PRD)  
**Fix necessário:** Atualizar endpoint e método HTTP

---

## 2. DEPENDÊNCIAS — STATUS

| Pacote | PRD | Instalado | Versão |
|--------|-----|-----------|--------|
| `cmdk` | ✅ | ✅ | ^1.1.1 |
| `react-hotkeys-hook` | ✅ | ✅ | ^5.3.2 |
| `@tanstack/react-query` | ✅ | ✅ | ^5.101.0 |
| `date-fns` | ✅ | ✅ | ^4.4.0 |
| `class-variance-authority` | ✅ | ✅ | ^0.7.1 |
| `swr` | ✅ | ✅ | ^2.4.1 |
| `idb-keyval` | ✅ | ✅ | ^6.2.5 |
| `framer-motion` | ✅ | ✅ | ^12.40.0 |
| `zustand` | ✅ | ✅ | ^5.0.14 |
| `recharts` | ✅ | ✅ | ^3.8.1 |
| `react-resizable-panels` | ✅ | ✅ | ^4.11.2 |
| `ulidx` | ❌ | ❌ | — |
| `@xyflow/react` | extra | ✅ | ^12.11.0 |
| `@monaco-editor/react` | extra | ✅ | ^4.7.0 |
| `react-markdown` | extra | ✅ | ^10.1.0 |

**Conclusão:** TODOS os pacotes PRD já estão instalados. Falta apenas `ulidx` para corrigir V2.

---

## 3. FEATURES — O QUE EXISTE VS O QUE FALTA

### Onda A — Frontend puro

| Feature | Nome | Status | Arquivo existente | Observação |
|---------|------|--------|-------------------|------------|
| F-01 | Projetos persistentes | ❌ FALTA | — | Nenhum projectStore.ts |
| F-02 | Seletor de modelo | ❌ FALTA | — | Nenhum ModelSelector.tsx |
| F-03 | Busca AKASHA inline | ⚠️ PARCIAL | `AkashaSearchBar.tsx` + route | Route aponta porta errada (V3) |
| F-05 | Deep Research mode | ❌ FALTA | — | Nenhum ResearchToggle.tsx |
| F-07 | Painel personalização | ⚠️ PARCIAL | `SettingsModal.tsx` (modal) | PRD pede page separada com 5 abas |
| F-08 | Seletor de foco | ❌ FALTA | — | Nenhum SearchFocusSelector.tsx |
| F-09 | Upload arquivo no chat | ❌ FALTA | — | Nenhum FileUploadChat.tsx |
| F-12 | Command Palette | ✅ EXISTS | `CommandPalette.tsx` | 7 comandos; PRD pede 8 — gap pequeno |

### Onda B — Integração OMNIS Core (pós WAF-01)

| Feature | Nome | Status | Arquivo existente | Observação |
|---------|------|--------|-------------------|------------|
| F-11 | Multi-missão tabs | ✅ EXISTS | `MissionTabs.tsx` + `uiStore.ts` | Implementação completa EVO-033 |
| F-13 | Conectores MCP | ✅ EXISTS | `MCPServerPanel.tsx` | Implementado, aguarda WAF-01 |
| F-19 | Design mode | ❌ FALTA | — | Nenhum DesignMode.tsx |
| F-24 | Criar skill pelo chat | ❌ FALTA | — | Nenhum SkillCreator.tsx |
| F-26 | Preflight custo | ✅ EXISTS | `PreflightPanel.tsx` | Já wired na page.tsx |
| F-27 | Cowork / pasta local | ❌ FALTA | — | Nenhum LocalFolderBridge.tsx |
| F-28 | Factory OS composer | ✅ EXISTS | `FactoryOSComposer.tsx` + view | Completo com React Flow |
| F-30 | Instalar plugin pelo chat | ✅ EXISTS | `PluginMarketplace.tsx` | Existe, aguarda WAF-01 |

### Componentes extras já existentes (além do PRD)

| Componente | Função |
|-----------|--------|
| `ApprovalCard.tsx` + `ApprovalQueue.tsx` | Fluxo de aprovação humana |
| `MissionStreamView.tsx` + `ExecutionSidecar.tsx` | SSE stream de missões |
| `MissionLauncher.tsx` | Lançar missão completa |
| `EconomicDashboard.tsx` + `OracleKPIs.tsx` | KPIs econômicos |
| `WhatIfSimulator.tsx` + `DryRunPanel.tsx` | Simulação e dry-run |
| `KnowledgeGraph.tsx` | Grafo de conhecimento |
| `AutopilotAgenda.tsx` | Agenda autopilot |
| `MissionReplayTimeline.tsx` | Replay de missão |
| `FailureRecoveryCard.tsx` | Recuperação de falha |
| `BlockerBanner.tsx` | Banner de bloqueios |
| `CanvasView.tsx` + `FactoryOSView.tsx` + `KnowledgeGraphView.tsx` | Views completas |

### API Routes existentes

| Rota | Status |
|------|--------|
| `POST /api/missions` | ✅ |
| `POST /api/missions/dry-run` | ✅ |
| `POST /api/missions/preflight` | ✅ |
| `GET /api/missions/[id]/stream` | ✅ (SSE) |
| `POST /api/missions/[id]/replay` | ✅ |
| `POST /api/missions/[id]/rollback` | ✅ |
| `GET/POST /api/approvals` | ✅ |
| `POST /api/approvals/[id]/decide` | ✅ |
| `POST /api/chat` | ✅ (⚠️ Anthropic direto — V1) |
| `GET /api/akasha/search` | ✅ (⚠️ porta errada — V3) |
| `GET /api/health` | ✅ |
| `POST /api/context-pack` | ✅ |
| `GET /api/cost` | ✅ |
| `GET /api/oraculo` | ✅ |
| `POST /api/simulate` | ✅ |
| `GET /api/sync` | ✅ |
| `GET /api/autopilot` | ✅ |
| `GET/POST /api/projects` | ✅ |

---

## 4. HERANÇA MANUS — CANDIDATOS A REMOÇÃO

| Arquivo | Referência Manus | Observação |
|---------|-----------------|------------|
| `src/components/modals/CloudComputerModal.tsx` | "Computador na nuvem" / "espaço de trabalho 24/7" | Feature cloud browser da Manus — substituir por LocalFolderBridge |
| `src/app/api/chat/route.ts` | Chama Anthropic direto (estilo Manus) | Reescrever para LiteLLM :4001 |

**Nenhum arquivo com "Manus", "mail-manus", "cloud-browser" literal encontrado.**  
Herança é semântica (cloud computer + Anthropic direto), não nominal.

**Candidatos adicionais para verificação:**
- `MeetingRecorderModal.tsx` — verificar se tem referência externa
- `evo021_spec.txt`, `fase3_evo021.txt`, `fase3_spec.txt` — arquivos não rastreados na raiz (limpar ou commitar)
- `docs/superpowers/` — não rastreado

---

## 5. SERVIÇOS — STATUS

| Serviço | Porta | Status | Impacto Onda A |
|---------|-------|--------|----------------|
| CALM Shell | :3001 | ✅ UP | — |
| OMNIS Core | :8000 | ❌ DOWN | F-03 (busca AKASHA) indisponível |
| AKASHA/Postgres | :5432 | ❌ DOWN | F-03, F-22 indisponíveis |
| LiteLLM | :4001 | ❌ DOWN | V1 fix não testável |
| Redis | :6379 | ❌ DOWN | SSE não funciona |
| n8n | :5678 | ❌ DOWN | opcional |
| Qdrant | :6333 | ❌ DOWN | opcional |
| KRATOS | :5100 | ❌ DOWN | link externo quebrado |

---

## 6. WAF-01 BRIDGE — STATUS

| Item | Status |
|------|--------|
| `C:\Users\lucas\omnis-control\src\bridge\` | ❌ NÃO EXISTE |
| `omnis_bridge.py` | ❌ NÃO EXISTE |

**Conclusão:** WAF-01 precisa ser construído do zero. Onda B totalmente bloqueada.

---

## 7. HERMES LOCAL

| Item | Status |
|------|--------|
| `$env:LOCALAPPDATA\hermes\` | ✅ EXISTE |
| `config.yaml` | ✅ EXISTE |

---

## 8. IDENTIDADE VISUAL — ANÁLISE RÁPIDA

- CSS variables encontradas: `--background-gray-main`, `--text-primary`, `--text-secondary`, `--Button-black`, `--border-main`
- Sem referências a roxo/indigo (#6366F1) ainda — PRD pede Accent: `#6366F1`
- Nenhum "Manus" literal no CSS
- `CloudComputerModal` usa `--Button-black` e textos em PT-BR genéricos

---

## 9. GIT STATUS

```
Branch: feature/calm-shell-integration
Remote: origin/master (diferente — branch local sem remote tracking)

Untracked (a classificar):
  docs/superpowers/
  evo021_spec.txt
  fase3_evo021.txt
  fase3_spec.txt
```

---

## 10. RESUMO EXECUTIVO

### O que o manus-clone já tem (surpresa positiva)

O repo está muito mais avançado do que o esperado:
- **Onda B** (pós WAF-01): F-11 (tabs), F-26 (preflight), F-28 (Factory OS), F-13 (MCP panel), F-30 (plugins) — todos existem
- **API routes completas**: stream SSE, replay, rollback, approval decide, simulate — tudo existe
- **Todas as deps PRD já instaladas**

### O que falta para Onda A

Apenas 5 componentes a criar do zero:
1. `src/stores/projectStore.ts` (F-01)
2. `src/components/ProjectPanel.tsx` (F-01)
3. `src/components/ModelSelector.tsx` (F-02)
4. `src/components/SearchFocusSelector.tsx` (F-08)
5. `src/components/FileUploadChat.tsx` (F-09)
6. `src/components/ResearchToggle.tsx` (F-05)

E 2 a evoluir:
- `CommandPalette.tsx` — adicionar 1 comando (select-model)
- `src/app/api/akasha/search/route.ts` — corrigir porta e método

### Violações críticas a corrigir ANTES de qualquer feature

1. **V1** — `chat/route.ts`: redirecionar Anthropic → LiteLLM :4001
2. **V2** — IDs: instalar `ulidx` e substituir Math.random
3. **V3** — AKASHA route: corrigir porta 8765 → 8000

---

## PLANO PROPOSTO (sujeito a GO do Lucas)

```
IMEDIATO (antes de qualquer feature):
  [FIX-V1] chat/route.ts → LiteLLM :4001 (model: ollama-fast)
  [FIX-V2] ulidx install + substituir Math.random em uiStore.ts
  [FIX-V3] akasha/search/route.ts → :8000/api/akasha/search GET

LIMPEZA (após GO Lucas):
  [CLEAN-1] CloudComputerModal.tsx → adaptar para LocalFolderBridge
  [CLEAN-2] Classificar arquivos não rastreados (evo021_spec.txt etc.)

ONDA A — 6 componentes novos (após violações corrigidas):
  F-01: projectStore.ts + ProjectPanel.tsx
  F-02: ModelSelector.tsx
  F-05: ResearchToggle.tsx
  F-08: SearchFocusSelector.tsx
  F-09: FileUploadChat.tsx
  F-12: CommandPalette.tsx (expand — 1 comando novo)

INFRA PARALELA:
  WAF-01: src/bridge/calm_bridge.py no omnis-control (R2, 1-2 dias)
  Obsidian: dry-run 100 notas antes de ingestão completa
  ulidx: instalar em manus-clone
```

---

**GATE G1 COMPLETO.**  
Aguardando GO do Lucas para iniciar LIMPEZA e ONDA A.

---
*Gerado automaticamente — dry_run=True — nenhuma alteração realizada*
