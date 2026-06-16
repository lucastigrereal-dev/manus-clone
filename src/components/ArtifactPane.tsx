"use client"

import { useState, useCallback } from "react"
import ArtifactRenderer from "@/components/ArtifactRenderer"

export interface Artifact {
  id: string
  type: "markdown" | "code" | "table" | "text"
  content: string
  language?: string
  title?: string
}

export const MOCK_ARTIFACTS: Artifact[] = [
  {
    id: "a1",
    type: "markdown",
    title: "Relatório de Pesquisa",
    content:
      "# Benchmark de Hotéis — Natal\n\n## Resumo Executivo\n\nAnálise de **47 propriedades** no litoral norte.\n\n- Preço médio: R$ 320/noite\n- Ocupação média: 78%\n- NPS médio: 72\n\n## Conclusão\n\nMercado com alta demanda em feriados prolongados.",
  },
  {
    id: "a2",
    type: "code",
    title: "Script Gerado",
    language: "python",
    content:
      '# OMNIS Generated Script\ndef analyze_hotels(data: list[dict]) -> dict:\n    prices = [h["price"] for h in data]\n    return {\n        "avg_price": sum(prices) / len(prices),\n        "count": len(data),\n    }\n',
  },
  {
    id: "a3",
    type: "table",
    title: "Dados Tabulares",
    content:
      "Hotel,Preço,NPS,Ocupação\nPousada Sol,280,85,82%\nHotel Costa,350,71,75%\nResort Mar,520,90,68%",
  },
]

interface Props {
  artifacts?: Artifact[]
  isStreaming?: boolean
}

export default function ArtifactPane({ artifacts, isStreaming }: Props) {
  const list = artifacts && artifacts.length > 0 ? artifacts : MOCK_ARTIFACTS
  const [selectedId, setSelectedId] = useState<string>(list[0]?.id ?? "")
  const [fullscreen, setFullscreen] = useState(false)
  const [copied, setCopied] = useState(false)

  const selectedArtifact = list.find((a) => a.id === selectedId) ?? list[0]

  const handleCopy = useCallback(async () => {
    if (!selectedArtifact) return
    try {
      await navigator.clipboard.writeText(selectedArtifact.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // fallback: do nothing silently
    }
  }, [selectedArtifact])

  if (!list || list.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center h-full gap-2"
        style={{ color: "var(--text-tertiary)", fontSize: 14 }}
      >
        <span style={{ fontSize: 28 }}>📦</span>
        <span>Aguardando artifacts...</span>
      </div>
    )
  }

  const tabLabel = (a: Artifact, i: number) =>
    a.title || `${a.type} #${i + 1}`

  const ContentBlock = () => (
    <div className="flex flex-col h-full">
      {/* Streaming indicator */}
      {isStreaming && (
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 shrink-0"
          style={{
            borderBottom: "1px solid var(--border-light)",
            fontSize: 12,
            color: "var(--text-tertiary)",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "rgb(16,185,129)",
              animation: "pulse 1.4s ease-in-out infinite",
            }}
          />
          Streaming...
        </div>
      )}

      {/* Tab bar (only when multiple) */}
      {list.length > 1 && (
        <div
          className="flex items-center gap-0.5 px-2 pt-2 shrink-0 flex-wrap"
          style={{ borderBottom: "1px solid var(--border-main)" }}
        >
          {list.map((a, i) => {
            const isActive = a.id === selectedId
            const label = tabLabel(a, i)
            const truncated = label.length > 20 ? label.slice(0, 18) + "…" : label
            return (
              <button
                key={a.id}
                onClick={() => setSelectedId(a.id)}
                className="px-3 py-1 rounded-t text-xs transition-colors"
                style={{
                  backgroundColor: isActive ? "var(--background-menu-white)" : "transparent",
                  color: isActive ? "var(--text-primary)" : "var(--text-tertiary)",
                  borderBottom: isActive ? "2px solid var(--Button-black)" : "2px solid transparent",
                  fontWeight: isActive ? 600 : 400,
                }}
                title={label}
              >
                {truncated}
              </button>
            )
          })}
        </div>
      )}

      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-3 py-1.5 shrink-0"
        style={{ borderBottom: "1px solid var(--border-light)" }}
      >
        <span
          className="text-xs font-medium truncate"
          style={{ color: "var(--text-secondary)", maxWidth: "60%" }}
        >
          {selectedArtifact ? tabLabel(selectedArtifact, list.indexOf(selectedArtifact)) : ""}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="px-2 py-1 rounded text-xs transition-colors"
            style={{
              border: "1px solid var(--border-main)",
              color: copied ? "rgb(16,185,129)" : "var(--text-secondary)",
              backgroundColor: "transparent",
            }}
          >
            {copied ? "✓ Copiado" : "⬇ Copiar"}
          </button>
          <button
            onClick={() => setFullscreen(true)}
            className="px-2 py-1 rounded text-xs transition-colors"
            style={{
              border: "1px solid var(--border-main)",
              color: "var(--text-secondary)",
              backgroundColor: "transparent",
            }}
          >
            ↗ Expandir
          </button>
        </div>
      </div>

      {/* Artifact content */}
      <div className="flex-1 overflow-y-auto p-3">
        {selectedArtifact && (
          <ArtifactRenderer
            content={selectedArtifact.content}
            type={selectedArtifact.type}
            language={selectedArtifact.language}
          />
        )}
      </div>
    </div>
  )

  return (
    <>
      <div
        className="flex flex-col overflow-y-auto"
        style={{
          height: "100%",
          backgroundColor: "var(--background-menu-white)",
          border: "1px solid var(--border-main)",
          borderRadius: "0.75rem",
        }}
      >
        <ContentBlock />
      </div>

      {/* Full-screen overlay */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto"
          style={{ backgroundColor: "var(--background-menu-white)" }}
        >
          {/* Fullscreen header */}
          <div
            className="flex items-center justify-between px-4 py-2 shrink-0"
            style={{ borderBottom: "1px solid var(--border-main)" }}
          >
            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              Artifact — {selectedArtifact ? tabLabel(selectedArtifact, list.indexOf(selectedArtifact)) : ""}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded text-xs transition-colors"
                style={{
                  border: "1px solid var(--border-main)",
                  color: copied ? "rgb(16,185,129)" : "var(--text-secondary)",
                  backgroundColor: "transparent",
                }}
              >
                {copied ? "✓ Copiado" : "⬇ Copiar"}
              </button>
              <button
                onClick={() => setFullscreen(false)}
                className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
                style={{
                  border: "1px solid var(--border-main)",
                  color: "var(--text-secondary)",
                  backgroundColor: "transparent",
                }}
              >
                ⇙ Fechar
              </button>
            </div>
          </div>

          {/* Tab bar in fullscreen */}
          {list.length > 1 && (
            <div
              className="flex items-center gap-0.5 px-4 pt-2 shrink-0 flex-wrap"
              style={{ borderBottom: "1px solid var(--border-main)" }}
            >
              {list.map((a, i) => {
                const isActive = a.id === selectedId
                const label = tabLabel(a, i)
                return (
                  <button
                    key={a.id}
                    onClick={() => setSelectedId(a.id)}
                    className="px-3 py-1 rounded-t text-xs transition-colors"
                    style={{
                      color: isActive ? "var(--text-primary)" : "var(--text-tertiary)",
                      borderBottom: isActive ? "2px solid var(--Button-black)" : "2px solid transparent",
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          )}

          {/* Fullscreen content */}
          <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full">
            {selectedArtifact && (
              <ArtifactRenderer
                content={selectedArtifact.content}
                type={selectedArtifact.type}
                language={selectedArtifact.language}
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}
