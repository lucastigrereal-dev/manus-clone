"use client"

import dynamic from "next/dynamic"
import ReactMarkdown from "react-markdown"

// Monaco must be dynamically imported (no SSR)
const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((m) => m.default),
  { ssr: false, loading: () => <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-tertiary)", fontSize: 13 }}>Carregando editor...</div> }
)

export interface ArtifactRendererProps {
  content: string
  type: "markdown" | "code" | "table" | "text"
  language?: string
}

function parseTabular(content: string): string[][] {
  const lines = content.split("\n").filter((l) => l.trim() !== "")
  return lines.map((line) => {
    // Prefer tab separator; fall back to comma
    if (line.includes("\t")) return line.split("\t")
    return line.split(",")
  })
}

export default function ArtifactRenderer({ content, type, language }: ArtifactRendererProps) {
  if (type === "markdown") {
    return (
      <div
        className="text-sm leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 style={{ color: "var(--text-primary)", fontSize: "1.25rem", fontWeight: 600, marginTop: "1rem", marginBottom: "0.5rem" }}>{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 style={{ color: "var(--text-primary)", fontSize: "1.1rem", fontWeight: 600, marginTop: "0.875rem", marginBottom: "0.375rem" }}>{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 style={{ color: "var(--text-primary)", fontSize: "1rem", fontWeight: 600, marginTop: "0.75rem", marginBottom: "0.25rem" }}>{children}</h3>
            ),
            p: ({ children }) => (
              <p style={{ color: "var(--text-secondary)", marginBottom: "0.5rem" }}>{children}</p>
            ),
            strong: ({ children }) => (
              <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>{children}</strong>
            ),
            ul: ({ children }) => (
              <ul style={{ paddingLeft: "1.25rem", marginBottom: "0.5rem", listStyleType: "disc" }}>{children}</ul>
            ),
            ol: ({ children }) => (
              <ol style={{ paddingLeft: "1.25rem", marginBottom: "0.5rem", listStyleType: "decimal" }}>{children}</ol>
            ),
            li: ({ children }) => (
              <li style={{ color: "var(--text-secondary)", marginBottom: "0.125rem" }}>{children}</li>
            ),
            code: ({ children, className }) => {
              const isBlock = className?.startsWith("language-")
              if (isBlock) {
                return (
                  <code
                    style={{
                      display: "block",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      backgroundColor: "rgba(0,0,0,0.05)",
                      color: "var(--text-primary)",
                      fontSize: "0.8rem",
                      fontFamily: "monospace",
                      overflowX: "auto",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {children}
                  </code>
                )
              }
              return (
                <code
                  style={{
                    padding: "0.125rem 0.375rem",
                    borderRadius: "0.25rem",
                    backgroundColor: "rgba(0,0,0,0.06)",
                    color: "var(--text-primary)",
                    fontSize: "0.8rem",
                    fontFamily: "monospace",
                  }}
                >
                  {children}
                </code>
              )
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    )
  }

  if (type === "code") {
    return (
      <div
        style={{
          borderRadius: "0.75rem",
          border: "1px solid var(--border-main)",
          overflow: "hidden",
        }}
      >
        <MonacoEditor
          height="300px"
          language={language || "typescript"}
          theme="vs-dark"
          value={content}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            wordWrap: "on",
          }}
        />
      </div>
    )
  }

  if (type === "table") {
    const rows = parseTabular(content)
    if (rows.length === 0) {
      return <p style={{ color: "var(--text-tertiary)", fontSize: 13 }}>Tabela vazia.</p>
    }
    const [header, ...body] = rows

    return (
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 13,
            color: "var(--text-secondary)",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "2px solid var(--border-main)",
              }}
            >
              {header.map((cell, ci) => (
                <th
                  key={ci}
                  style={{
                    padding: "6px 12px",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cell.trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, ri) => (
              <tr
                key={ri}
                style={{
                  backgroundColor: ri % 2 === 1 ? "rgba(0,0,0,0.02)" : "transparent",
                  borderBottom: "1px solid var(--border-light)",
                }}
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    style={{
                      padding: "6px 12px",
                    }}
                  >
                    {cell.trim()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // type === "text"
  return (
    <pre
      className="text-sm whitespace-pre-wrap"
      style={{ color: "var(--text-secondary)", fontFamily: "inherit" }}
    >
      {content}
    </pre>
  )
}
