import { create } from 'zustand'

interface Toast {
  id: string
  kind: 'info' | 'success' | 'warning' | 'error'
  message: string
  autoDismiss?: number
}

export interface MissionTab {
  id: string
  title: string
  missionId: string | null
  status: 'idle' | 'running' | 'done' | 'error'
  inputValue: string
}

const DEFAULT_TAB: MissionTab = {
  id: 'tab-default',
  title: 'Nova missão',
  missionId: null,
  status: 'idle',
  inputValue: '',
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
  // EVO-033 — parallel mission tabs
  missionTabs: MissionTab[]
  activeTabId: string
  addTab: () => void
  removeTab: (id: string) => void
  setActiveTab: (id: string) => void
  updateTab: (id: string, patch: Partial<MissionTab>) => void
  // EVO-036 — adaptive quick actions
  quickActionUsage: Record<string, number>
  trackQuickAction: (actionId: string) => void
}

const QUICK_ACTION_USAGE_KEY = 'omnis:quick-action-usage'

function loadQuickActionUsage(): Record<string, number> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(QUICK_ACTION_USAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, number>) : {}
  } catch {
    return {}
  }
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
  // EVO-033
  missionTabs: [DEFAULT_TAB],
  activeTabId: DEFAULT_TAB.id,
  addTab: () =>
    set((s) => {
      const id = `tab-${Math.random().toString(36).slice(2, 9)}`
      const newTab: MissionTab = {
        id,
        title: 'Nova missão',
        missionId: null,
        status: 'idle',
        inputValue: '',
      }
      return { missionTabs: [...s.missionTabs, newTab], activeTabId: id }
    }),
  removeTab: (id) =>
    set((s) => {
      const filtered = s.missionTabs.filter((t) => t.id !== id)
      // Always keep at least one tab
      if (filtered.length === 0) return s
      const nextActiveId =
        s.activeTabId === id
          ? filtered[filtered.length - 1].id
          : s.activeTabId
      return { missionTabs: filtered, activeTabId: nextActiveId }
    }),
  setActiveTab: (id) => set({ activeTabId: id }),
  updateTab: (id, patch) =>
    set((s) => ({
      missionTabs: s.missionTabs.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })),
  // EVO-036 — adaptive quick actions
  quickActionUsage: loadQuickActionUsage(),
  trackQuickAction: (actionId) =>
    set((s) => {
      const updated = {
        ...s.quickActionUsage,
        [actionId]: (s.quickActionUsage[actionId] ?? 0) + 1,
      }
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(QUICK_ACTION_USAGE_KEY, JSON.stringify(updated))
        } catch {}
      }
      return { quickActionUsage: updated }
    }),
}))
