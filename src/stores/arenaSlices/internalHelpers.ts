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

export function getFirstTaskSession(sessions: ArenaSession[], taskId: string) {
  return getTaskSessions(sessions, taskId)[0]
}

export function getLatestTaskSession(sessions: ArenaSession[], taskId: string) {
  return getTaskSessionsSortedByUpdatedAtDesc(sessions, taskId)[0]
}

export function getOldestTaskSession(sessions: ArenaSession[], taskId: string) {
  return getTaskSessionsSortedByUpdatedAtAsc(sessions, taskId)[0]
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

export function computeActiveAfterTaskDeletion(params: {
  deletedTaskId: string
  prevActiveTaskId: string
  remainingTasks: Array<{ id: string }>
  remainingSessions: ArenaSession[]
}): { activeTaskId: string; activeSessionId: string } {
  const { deletedTaskId, prevActiveTaskId, remainingTasks, remainingSessions } = params

  // Preserve existing behavior: deleting a non-active task clears activeSessionId.
  if (prevActiveTaskId !== deletedTaskId) {
    return { activeTaskId: prevActiveTaskId, activeSessionId: '' }
  }

  const nextActiveTaskId = remainingTasks[0]?.id || ''
  if (!nextActiveTaskId) return { activeTaskId: '', activeSessionId: '' }

  const nextActiveSessionId = getFirstTaskSession(remainingSessions, nextActiveTaskId)?.id || ''
  return { activeTaskId: nextActiveTaskId, activeSessionId: nextActiveSessionId }
}

export function computeActiveSessionAfterSessionDeletion(params: {
  deletedSessionId: string
  prevActiveSessionId: string
  taskId: string
  remainingSessions: ArenaSession[]
}): string {
  const { deletedSessionId, prevActiveSessionId, taskId, remainingSessions } = params

  if (prevActiveSessionId !== deletedSessionId) return prevActiveSessionId

  return getLatestTaskSession(remainingSessions, taskId)?.id || ''
}
