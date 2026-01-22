// Pure selectors for Arena store state.
//
// Keep these selectors store-implementation-agnostic so consumers don't depend
// on the exact internal shape (arrays vs maps, etc.).

import type { Task } from '@/types/arena'
import type { ArenaSession } from './arenaTypes'
import { byUpdatedAtDesc } from './arenaSort'

export function selectActiveSession(state: {
  sessions: ArenaSession[]
  activeSessionId: string
}): ArenaSession | null {
  return state.sessions.find((s) => s.id === state.activeSessionId) || null
}

export function selectTaskSessionsSorted(state: { sessions: ArenaSession[] }, taskId: string) {
  return state.sessions
    .filter((s) => s.taskId === taskId)
    .sort(byUpdatedAtDesc)
}

export function selectTasksSorted(state: { tasks: Task[] }): Task[] {
  return [...state.tasks].sort(byUpdatedAtDesc)
}
