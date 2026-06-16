'use client'

import React, { useRef, useState } from 'react'
import { ulid } from 'ulidx'

const ACCEPTED = '.pdf,.csv,.xlsx,.xls,.md,.txt,.png,.jpg,.jpeg,.webp'
const MAX_SIZE_MB = 10
const MAX_FILES = 5

export interface AttachedFile {
  id: string
  name: string
  size: number
  type: string
  content: string
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function fileIcon(type: string) {
  if (type.startsWith('image/')) return '🖼'
  if (type.includes('pdf')) return '📄'
  if (type.includes('csv') || type.includes('excel') || type.includes('spreadsheet')) return '📊'
  if (type.includes('markdown') || type.includes('text')) return '📝'
  return '📎'
}

interface FileUploadChatProps {
  files: AttachedFile[]
  onAdd: (file: AttachedFile) => void
  onRemove: (id: string) => void
}

export default function FileUploadChat({ files, onAdd, onRemove }: FileUploadChatProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null)
    const selected = Array.from(e.target.files ?? [])
    if (!selected.length) return

    if (files.length + selected.length > MAX_FILES) {
      setError(`Máximo ${MAX_FILES} arquivos por conversa`)
      return
    }

    for (const file of selected) {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`${file.name} excede ${MAX_SIZE_MB}MB`)
        continue
      }

      const content = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        if (file.type.startsWith('image/')) {
          reader.readAsDataURL(file)
        } else {
          reader.readAsText(file)
        }
        reader.onload = () => resolve(reader.result as string)
      })

      onAdd({ id: ulid(), name: file.name, size: file.size, type: file.type, content })
    }

    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex flex-col gap-1">
      {files.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-1">
          {files.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs"
              style={{ border: '1px solid var(--border-main)', backgroundColor: 'var(--background-nav)' }}
            >
              <span>{fileIcon(f.type)}</span>
              <span style={{ color: 'var(--text-primary)' }} className="max-w-[120px] truncate">{f.name}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{formatBytes(f.size)}</span>
              <button
                onClick={() => onRemove(f.id)}
                className="ml-0.5 opacity-50 hover:opacity-100 transition-opacity"
                style={{ color: 'var(--text-tertiary)' }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-[11px] px-1" style={{ color: '#EF4444' }}>{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        multiple
        className="hidden"
        onChange={handleChange}
      />

      <button
        onClick={() => inputRef.current?.click()}
        disabled={files.length >= MAX_FILES}
        className="flex items-center justify-center w-7 h-7 rounded-lg transition-colors disabled:opacity-40"
        style={{ color: 'var(--text-secondary)' }}
        title="Anexar arquivo (PDF, CSV, XLSX, MD, TXT, imagem — max 10MB)"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M13.5 7.5L7.5 13.5a3.5 3.5 0 0 1-4.95-4.95l6-6a2.333 2.333 0 0 1 3.3 3.3l-6 6A1.167 1.167 0 0 1 4.2 10.2l5.5-5.5"
            stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}
