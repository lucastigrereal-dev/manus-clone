import { useEffect, useRef, useCallback } from 'react'

// idb-keyval helpers with localStorage fallback
async function idbSet(key: string, value: string): Promise<void> {
  try {
    const { set } = await import('idb-keyval')
    await set(key, value)
  } catch {
    try { localStorage.setItem(key, value) } catch { /* ignore */ }
  }
}

async function idbGet(key: string): Promise<string | undefined> {
  try {
    const { get } = await import('idb-keyval')
    return await get<string>(key)
  } catch {
    try { return localStorage.getItem(key) ?? undefined } catch { return undefined }
  }
}

async function idbDel(key: string): Promise<void> {
  try {
    const { del } = await import('idb-keyval')
    await del(key)
  } catch {
    try { localStorage.removeItem(key) } catch { /* ignore */ }
  }
}

// Named exports for external use
export const saveDraft = idbSet
export const loadDraft = idbGet
export const clearDraft = idbDel

interface UseDraftAutosaveOptions {
  key: string
  value: string
  onRestore?: (value: string) => void
}

export function useDraftAutosave({ key, value, onRestore }: UseDraftAutosaveOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountedRef = useRef(false)

  // Restore on mount
  useEffect(() => {
    if (mountedRef.current) return
    mountedRef.current = true
    idbGet(key).then((saved) => {
      if (saved && onRestore) onRestore(saved)
    })
  }, [key, onRestore])

  // Autosave with 500ms debounce
  useEffect(() => {
    if (!mountedRef.current) return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (value.trim()) {
        idbSet(key, value)
      } else {
        idbDel(key)
      }
    }, 500)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [key, value])

  const clear = useCallback(() => idbDel(key), [key])

  return { clear }
}
