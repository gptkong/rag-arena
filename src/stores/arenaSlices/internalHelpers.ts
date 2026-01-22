import type { StateCreator } from 'zustand'
import type { ArenaState } from '../arenaStoreTypes'
import type { ArenaSession } from '../arenaTypes'
import { byUpdatedAtAsc, byUpdatedAtDesc } from '../arenaSort'

type ArenaSet = Parameters<StateCreator<ArenaState>>[0]
type ArenaGet = Parameters<StateCreator<ArenaState>>[1]

export function getTaskSessions(sessions: ArenaSession[], taskId: string) {
  return sessions.filter((s) => s.taskId === taskId)
}

export function getTaskSessionsSortedByUpdatedAtDesc(sessions: ArenaSession[], taskId: string) {
  return getTaskSessions(sessions, taskId).sort(byUpdatedAtDesc)
}

export function getTaskSessionsSortedByUpdatedAtAsc(sessions: ArenaSession[], taskId: string) {
  return getTaskSessions(sessions, taskId).sort(byUpdatedAtAsc)
}

export function touchTask(set: ArenaSet, taskId: string) {
  set((state) => ({
    tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, updatedAt: Date.now() } : t)),
  }))
}

export function updateActiveSession(
  set: ArenaSet,
  get: ArenaGet,
  updater: (session: ArenaSession) => ArenaSession
) {
  const { activeSessionId, sessions } = get()
  const nextSessions = sessions.map((s) => (s.id === activeSessionId ? updater(s) : s))
  set({ sessions: nextSessions })
}
