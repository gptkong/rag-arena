// Arena Store - RAG 问答竞技场状态管理

import { create } from 'zustand'
import type { Answer } from '@/types/arena'

interface ArenaState {
  /** 当前问题 */
  question: string
  /** 问题 ID */
  questionId: string | null
  /** 4 个回答 */
  answers: Answer[]
  /** 加载状态 */
  isLoading: boolean
  /** 已点赞的回答 ID */
  votedAnswerId: string | null
  /** 点赞加载状态 */
  isVoting: boolean

  // Actions
  setQuestion: (question: string) => void
  setQuestionId: (questionId: string | null) => void
  setAnswers: (answers: Answer[]) => void
  appendAnswerDelta: (answerId: string, delta: string) => void
  finalizeAnswer: (answerId: string, patch: Partial<Answer>) => void
  setAnswerError: (answerId: string, message: string) => void
  setLoading: (loading: boolean) => void
  setVotedAnswerId: (answerId: string | null) => void
  setVoting: (voting: boolean) => void
  reset: () => void
}

const initialState = {
  question: '',
  questionId: null,
  answers: [],
  isLoading: false,
  votedAnswerId: null,
  isVoting: false,
}

export const useArenaStore = create<ArenaState>()((set) => ({
  ...initialState,

  setQuestion: (question) => set({ question }),
  setQuestionId: (questionId) => set({ questionId }),
  setAnswers: (answers) => set({ answers }),
  appendAnswerDelta: (answerId, delta) =>
    set((state) => ({
      answers: state.answers.map((answer) =>
        answer.id === answerId
          ? { ...answer, content: `${answer.content}${delta}` }
          : answer,
      ),
    })),
  finalizeAnswer: (answerId, patch) =>
    set((state) => ({
      answers: state.answers.map((answer) =>
        answer.id === answerId ? { ...answer, ...patch } : answer,
      ),
    })),
  setAnswerError: (answerId, message) =>
    set((state) => ({
      answers: state.answers.map((answer) =>
        answer.id === answerId ? { ...answer, error: message } : answer,
      ),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setVotedAnswerId: (votedAnswerId) => set({ votedAnswerId }),
  setVoting: (isVoting) => set({ isVoting }),
  reset: () => set(initialState),
}))
