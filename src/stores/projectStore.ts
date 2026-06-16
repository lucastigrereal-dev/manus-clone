import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ulid } from 'ulidx'

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  content: string
  uploadedAt: string
}

export interface Project {
  id: string
  name: string
  instructions: string
  files: UploadedFile[]
  missions: string[]
  createdAt: string
  color: string
}

const PROJECT_COLORS = [
  '#6366F1', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#06B6D4', '#84CC16', '#F97316',
]

interface ProjectStore {
  projects: Project[]
  activeProjectId: string | null
  createProject: (name: string, instructions: string) => string
  setActiveProject: (id: string | null) => void
  uploadFile: (projectId: string, file: UploadedFile) => void
  removeFile: (projectId: string, fileId: string) => void
  addMission: (projectId: string, missionId: string) => void
  deleteProject: (id: string) => void
  getActive: () => Project | null
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProjectId: null,

      createProject: (name, instructions) => {
        const id = ulid()
        const color = PROJECT_COLORS[get().projects.length % PROJECT_COLORS.length]
        const project: Project = {
          id,
          name,
          instructions,
          files: [],
          missions: [],
          createdAt: new Date().toISOString(),
          color,
        }
        set((s) => ({ projects: [...s.projects, project], activeProjectId: id }))
        return id
      },

      setActiveProject: (id) => set({ activeProjectId: id }),

      uploadFile: (projectId, file) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId ? { ...p, files: [...p.files, file] } : p
          ),
        })),

      removeFile: (projectId, fileId) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? { ...p, files: p.files.filter((f) => f.id !== fileId) }
              : p
          ),
        })),

      addMission: (projectId, missionId) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? { ...p, missions: [...p.missions, missionId] }
              : p
          ),
        })),

      deleteProject: (id) =>
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          activeProjectId: s.activeProjectId === id ? null : s.activeProjectId,
        })),

      getActive: () => {
        const { projects, activeProjectId } = get()
        return projects.find((p) => p.id === activeProjectId) ?? null
      },
    }),
    { name: 'omnis:projects' }
  )
)
