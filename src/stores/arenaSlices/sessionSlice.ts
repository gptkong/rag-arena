import type { StateCreator } from 'zustand'
import type { ArenaSessionSlice, ArenaState } from '../arenaStoreTypes'
import { MAX_SESSIONS_PER_TASK, createEmptySession } from '../arenaHelpers'
import {
  computeActiveSessionAfterSessionDeletion,
  getTaskSessions,
  getOldestTaskSession,
  touchTask,
} from './internalHelpers'

export const createSessionSlice: StateCreator<ArenaState, [], [], ArenaSessionSlice> = (set, get) => {
  return {
    // ========== Session Actions ==========

    startNewSession: async () => {
      const { activeTaskId, sessions } = get()

      // 不调用接口，只创建本地会话（空会话，等待用户输入问题后再创建）
      const newSession = createEmptySession(activeTaskId)

      // 限制每个任务的会话数量
      const taskSessions = getTaskSessions(sessions, activeTaskId)
      let nextSessions = [newSession, ...sessions]

      if (taskSessions.length >= MAX_SESSIONS_PER_TASK) {
        // 删除该任务下最旧的会话
        const oldestSession = getOldestTaskSession(sessions, activeTaskId)
        if (oldestSession) {
          nextSessions = nextSessions.filter((s) => s.id !== oldestSession.id)
        }
      }

      set({
        sessions: nextSessions,
        activeSessionId: newSession.id,
      })

      touchTask(set, activeTaskId)
      return newSession.id
    },

    setActiveSessionId: (sessionId) => {
      const { sessions } = get()
      const session = sessions.find((s) => s.id === sessionId)
      if (!session) return

      // 同时更新 activeTaskId 并展开该任务
      set((state) => ({
        activeSessionId: sessionId,
        activeTaskId: session.taskId,
        tasks: state.tasks.map((t) => (t.id === session.taskId ? { ...t, expanded: true } : t)),
      }))
    },

    deleteSession: (sessionId) => {
      set((state) => {
        const session = state.sessions.find((s) => s.id === sessionId)
        if (!session) return state

        const remaining = state.sessions.filter((s) => s.id !== sessionId)
        const taskSessions = getTaskSessions(remaining, session.taskId)

        // 如果任务下没有会话了，创建一个新的
        if (taskSessions.length === 0) {
          const newSession = createEmptySession(session.taskId)
          return {
            ...state,
            sessions: [...remaining, newSession],
            activeSessionId:
              state.activeSessionId === sessionId ? newSession.id : state.activeSessionId,
          }
        }

        // 如果删除的是当前会话，切换到同任务下的第一个会话
        const nextActiveSessionId = computeActiveSessionAfterSessionDeletion({
          deletedSessionId: sessionId,
          prevActiveSessionId: state.activeSessionId,
          taskId: session.taskId,
          remainingSessions: remaining,
        })

        return {
          ...state,
          sessions: remaining,
          activeSessionId: nextActiveSessionId,
        }
      })
    },

    renameSession: (sessionId, title) => {
      set((state) => ({
        sessions: state.sessions.map((s) => (s.id === sessionId ? { ...s, title, updatedAt: Date.now() } : s)),
      }))
    },
  }
}
