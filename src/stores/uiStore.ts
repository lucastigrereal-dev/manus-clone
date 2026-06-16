import { create } from 'zustand'

interface Toast {
  id: string
  kind: 'info' | 'success' | 'warning' | 'error'
  message: string
  autoDismiss?: number
}

interface UiStore {
  focusMode: boolean
  toggleFocusMode: () => void
  commandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void
  activeFactory: string | null
  setActiveFactory: (f: string | null) => void
  toasts: Toast[]
  addToast: (t: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

export const useUiStore = create<UiStore>((set) => ({
  focusMode: false,
  toggleFocusMode: () => set((s) => ({ focusMode: !s.focusMode })),
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  activeFactory: null,
  setActiveFactory: (f) => set({ activeFactory: f }),
  toasts: [],
  addToast: (t) =>
    set((s) => ({
      toasts: [...s.toasts, { ...t, id: Math.random().toString(36).slice(2) }],
    })),
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
