// Arena Store - RAG 问答竞技场状态管理

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Answer } from '@/types/arena'

export interface ArenaSession {
  /** 本地会话 ID */
  id: string
  /** 会话标题（用于列表展示） */
  title: string
  /** 创建时间（毫秒时间戳） */
  createdAt: number
  /** 更新时间（毫秒时间戳） */
  updatedAt: number

  /** 当前问题 */
  question: string
  /** 服务端问题 ID（可能为空） */
  serverQuestionId: string | null
  /** 回答列表 */
  answers: Answer[]
  /** 已点赞的回答 ID */
  votedAnswerId: string | null
}

const MAX_SESSIONS = 50

function createSessionId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function toSessionTitle(question: string) {
  const trimmed = question.trim()
  if (!trimmed) return '新会话'
  return trimmed.length > 24 ? `${trimmed.slice(0, 24)}…` : trimmed
}

function createEmptySession(partial?: Partial<ArenaSession>): ArenaSession {
  const now = Date.now()
  const id = partial?.id || createSessionId()
  const question = partial?.question || ''
  return {
    id,
    title: partial?.title || toSessionTitle(question),
    createdAt: partial?.createdAt ?? now,
    updatedAt: partial?.updatedAt ?? now,
    question,
    serverQuestionId: partial?.serverQuestionId ?? null,
    answers: partial?.answers ?? [],
    votedAnswerId: partial?.votedAnswerId ?? null,
  }
}

interface ArenaState {
  /** 历史会话列表（按更新时间可排序展示） */
  sessions: ArenaSession[]
  /** 当前会话 ID */
  activeSessionId: string
  /** 加载状态（流式生成中） */
  isLoading: boolean
  /** 点赞加载状态 */
  isVoting: boolean

  // Actions
  startNewSession: () => string
  setActiveSessionId: (sessionId: string) => void
  deleteSession: (sessionId: string) => void

  startSessionWithQuestion: (question: string) => string
  setServerQuestionId: (questionId: string | null) => void
  setAnswers: (answers: Answer[]) => void
  appendAnswerDelta: (answerId: string, delta: string) => void
  finalizeAnswer: (answerId: string, patch: Partial<Answer>) => void
  setAnswerError: (answerId: string, message: string) => void
  setLoading: (loading: boolean) => void
  setVotedAnswerId: (answerId: string | null) => void
  setVoting: (voting: boolean) => void
}

function limitSessions(sessions: ArenaSession[], activeSessionId?: string) {
  if (sessions.length <= MAX_SESSIONS) return sessions
  const sorted = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt)
  const top = sorted.slice(0, MAX_SESSIONS)
  if (activeSessionId && !top.some((s) => s.id === activeSessionId)) {
    const active = sessions.find((s) => s.id === activeSessionId)
    if (active) {
      top.pop()
      top.push(active)
    }
  }
  return top
}

export const useArenaStore = create<ArenaState>()(
  persist(
    (set, get) => {
      const initialSession = createEmptySession()

      const updateActiveSession = (updater: (session: ArenaSession) => ArenaSession) => {
        const { activeSessionId, sessions } = get()
        const nextSessions = sessions.map((s) => (s.id === activeSessionId ? updater(s) : s))
        set({ sessions: limitSessions(nextSessions, activeSessionId) })
      }

      const ensureActiveSessionExists = () => {
        const { sessions, activeSessionId } = get()
        const hasActive = sessions.some((s) => s.id === activeSessionId)
        if (hasActive && sessions.length > 0) return

        const fallback = sessions[0] || createEmptySession()
        set({
          sessions: sessions.length > 0 ? sessions : [fallback],
          activeSessionId: fallback.id,
        })
      }

      return {
        sessions: [initialSession],
        activeSessionId: initialSession.id,
        isLoading: false,
        isVoting: false,

        startNewSession: () => {
          const newSession = createEmptySession()
          set((state) => ({
            sessions: limitSessions([newSession, ...state.sessions], newSession.id),
            activeSessionId: newSession.id,
          }))
          return newSession.id
        },

        setActiveSessionId: (sessionId) => {
          const { sessions } = get()
          const exists = sessions.some((s) => s.id === sessionId)
          if (!exists) return
          set({ activeSessionId: sessionId })
        },

        deleteSession: (sessionId) => {
          set((state) => {
            const remaining = state.sessions.filter((s) => s.id !== sessionId)
            if (remaining.length === 0) {
              const newSession = createEmptySession()
              return {
                sessions: [newSession],
                activeSessionId: newSession.id,
              }
            }

            const nextActiveId =
              state.activeSessionId === sessionId ? remaining[0].id : state.activeSessionId

            return {
              sessions: limitSessions(remaining, nextActiveId),
              activeSessionId: nextActiveId,
            }
          })
        },

        startSessionWithQuestion: (question) => {
          ensureActiveSessionExists()
          const { activeSessionId, sessions } = get()
          const active = sessions.find((s) => s.id === activeSessionId)

          const safeQuestion = question.trim()
          if (!active) {
            const newSession = createEmptySession({ question: safeQuestion })
            set({ sessions: [newSession], activeSessionId: newSession.id })
            return newSession.id
          }

          // 如果当前会话已有内容，为本次提问创建新会话，避免覆盖历史
          const shouldCreateNew =
            active.question.trim().length > 0 || active.answers.length > 0 || active.votedAnswerId

          if (shouldCreateNew) {
            const newSession = createEmptySession({ question: safeQuestion })
            set((state) => ({
              sessions: limitSessions([newSession, ...state.sessions], newSession.id),
              activeSessionId: newSession.id,
            }))
            return newSession.id
          }

          updateActiveSession((s) => ({
            ...s,
            question: safeQuestion,
            title: toSessionTitle(safeQuestion),
            updatedAt: Date.now(),
            serverQuestionId: null,
            answers: [],
            votedAnswerId: null,
          }))
          return activeSessionId
        },

        setServerQuestionId: (questionId) => {
          updateActiveSession((s) => ({ ...s, serverQuestionId: questionId, updatedAt: Date.now() }))
        },

        setAnswers: (answers) => {
          updateActiveSession((s) => ({ ...s, answers, updatedAt: Date.now() }))
        },

        appendAnswerDelta: (answerId, delta) => {
          updateActiveSession((s) => ({
            ...s,
            updatedAt: Date.now(),
            answers: s.answers.map((answer) =>
              answer.id === answerId
                ? { ...answer, content: `${answer.content}${delta}` }
                : answer,
            ),
          }))
        },

        finalizeAnswer: (answerId, patch) => {
          updateActiveSession((s) => ({
            ...s,
            updatedAt: Date.now(),
            answers: s.answers.map((answer) =>
              answer.id === answerId ? { ...answer, ...patch, error: undefined } : answer,
            ),
          }))
        },

        setAnswerError: (answerId, message) => {
          updateActiveSession((s) => ({
            ...s,
            updatedAt: Date.now(),
            answers: s.answers.map((answer) =>
              answer.id === answerId ? { ...answer, error: message } : answer,
            ),
          }))
        },

        setLoading: (isLoading) => set({ isLoading }),
        setVotedAnswerId: (answerId) => {
          updateActiveSession((s) => ({ ...s, votedAnswerId: answerId, updatedAt: Date.now() }))
        },
        setVoting: (isVoting) => set({ isVoting }),
      }
    },
    {
      name: 'arena-session-store',
      partialize: (state) => ({
        sessions: state.sessions,
        activeSessionId: state.activeSessionId,
      }),
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (!state) return
        if (!Array.isArray(state.sessions) || state.sessions.length === 0) {
          state.startNewSession()
          return
        }
        if (!state.sessions.some((s) => s.id === state.activeSessionId)) {
          state.setActiveSessionId(state.sessions[0].id)
        }
      },
    },
  ),
)
