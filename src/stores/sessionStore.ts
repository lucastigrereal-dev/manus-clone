import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ulid } from 'ulidx'

export interface StoredMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  agent?: string
  timestamp: string // ISO string — safe for JSON.stringify
}

export interface Session {
  id: string
  title: string
  messages: StoredMessage[]
  pinned: boolean
  createdAt: string
  updatedAt: string
}

interface SessionStore {
  sessions: Session[]
  activeSessionId: string | null
  createSession: () => string
  setActiveSession: (id: string | null) => void
  appendMessage: (sessionId: string, msg: StoredMessage) => void
  renameSession: (id: string, title: string) => void
  togglePin: (id: string) => void
  deleteSession: (id: string) => void
  getActive: () => Session | null
  searchSessions: (query: string) => Session[]
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessionId: null,

      createSession: () => {
        const id = ulid()
        const now = new Date().toISOString()
        set((s) => ({
          sessions: [
            ...s.sessions,
            { id, title: '', messages: [], pinned: false, createdAt: now, updatedAt: now },
          ],
          activeSessionId: id,
        }))
        return id
      },

      setActiveSession: (id) => set({ activeSessionId: id }),

      appendMessage: (sessionId, msg) => {
        const now = new Date().toISOString()
        set((s) => ({
          sessions: s.sessions.map((sess) => {
            if (sess.id !== sessionId) return sess
            const messages = [...sess.messages, msg]
            const title =
              sess.title || (msg.role === 'user' ? msg.content.slice(0, 60) : '')
            return { ...sess, messages, title, updatedAt: now }
          }),
        }))
      },

      renameSession: (id, title) =>
        set((s) => ({
          sessions: s.sessions.map((sess) => (sess.id === id ? { ...sess, title } : sess)),
        })),

      togglePin: (id) =>
        set((s) => ({
          sessions: s.sessions.map((sess) =>
            sess.id === id ? { ...sess, pinned: !sess.pinned } : sess,
          ),
        })),

      deleteSession: (id) =>
        set((s) => ({
          sessions: s.sessions.filter((sess) => sess.id !== id),
          activeSessionId: s.activeSessionId === id ? null : s.activeSessionId,
        })),

      getActive: () => {
        const { sessions, activeSessionId } = get()
        return sessions.find((s) => s.id === activeSessionId) ?? null
      },

      searchSessions: (query) => {
        const q = query.toLowerCase()
        return get().sessions.filter(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.messages.some((m) => m.content.toLowerCase().includes(q)),
        )
      },
    }),
    { name: 'omnis:sessions' },
  ),
)
