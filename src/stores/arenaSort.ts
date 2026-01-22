// Shared sort helpers for Arena domain objects.

export type HasUpdatedAt = { updatedAt: number }

export function byUpdatedAtDesc(a: HasUpdatedAt, b: HasUpdatedAt) {
  return b.updatedAt - a.updatedAt
}

export function byUpdatedAtAsc(a: HasUpdatedAt, b: HasUpdatedAt) {
  return a.updatedAt - b.updatedAt
}
