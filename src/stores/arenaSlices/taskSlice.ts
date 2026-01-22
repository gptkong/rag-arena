import type { StateCreator } from 'zustand'
import type { ArenaTaskSlice, ArenaState } from '../arenaStoreTypes'
import { MAX_TASKS, createEmptyTask } from '../arenaHelpers'
import {
  computeActiveAfterTaskDeletion,
  getLatestTaskSession,
} from './internalHelpers'

export const createTaskSlice: StateCreator<ArenaState, [], [], ArenaTaskSlice> = (set, get) => ({
  // ========== Task Actions ==========

  createTask: (title) => {
    const newTask = createEmptyTask({ title: title || '新任务' })

    set((state) => {
      // 限制任务数量
      let tasks = [newTask, ...state.tasks]
      if (tasks.length > MAX_TASKS) {
        tasks = tasks.slice(0, MAX_TASKS)
      }
      return {
        tasks,
        activeTaskId: newTask.id,
        activeSessionId: '',
      }
    })
    return newTask.id
  },

  deleteTask: (taskId) => {
    set((state) => {
      const remainingTasks = state.tasks.filter((t) => t.id !== taskId)
      const remainingSessions = state.sessions.filter((s) => s.taskId !== taskId)

      // 如果删除了所有任务，创建新的默认任务
      if (remainingTasks.length === 0) {
        const newTask = createEmptyTask({ title: '默认任务' })
        return {
          tasks: [newTask],
          sessions: [],
          activeTaskId: newTask.id,
          activeSessionId: '',
        }
      }

      const { activeTaskId, activeSessionId } = computeActiveAfterTaskDeletion({
        deletedTaskId: taskId,
        prevActiveTaskId: state.activeTaskId,
        remainingTasks,
        remainingSessions,
      })

      return {
        tasks: remainingTasks,
        sessions: remainingSessions,
        activeTaskId,
        activeSessionId,
      }
    })
  },

  renameTask: (taskId, title) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, title, updatedAt: Date.now() } : t)),
    }))
  },

  toggleTaskExpanded: (taskId) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, expanded: !t.expanded } : t)),
    }))
  },

  setActiveTaskId: (taskId) => {
    const { tasks, sessions } = get()
    const exists = tasks.some((t) => t.id === taskId)
    if (!exists) return

    // 切换到该任务的第一个会话
    const latest = getLatestTaskSession(sessions, taskId)

    set({
      activeTaskId: taskId,
      activeSessionId: latest?.id || '',
    })
  },
})
