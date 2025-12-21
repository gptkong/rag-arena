// Arena - RAG 问答竞技场类型定义

/**
 * 单个引用摘要
 */
export interface Citation {
  /** 引用唯一标识 */
  id: string
  /** 文档标题 */
  title: string
  /** 摘要内容 */
  content: string
  /** 文档来源/URL (可选) */
  source?: string
  /** 相关性分数 (0-1，可选) */
  relevanceScore?: number
  /** 页码或章节 (可选) */
  location?: string
  /** 文档类型标签 (可选，如 PDF、网页、数据库等) */
  docType?: 'pdf' | 'webpage' | 'database' | 'api' | 'file' | 'other'
}

/**
 * 单个回答
 */
export interface Answer {
  /** 回答唯一标识 */
  id: string
  /** 回答内容 (支持 Markdown) */
  content: string
  /** 供应商标识 (匿名，如 A/B/C/D) */
  providerId: string
  /** 引用摘要列表 (可选) */
  citations?: Citation[]
}

/**
 * 竞技场回答响应
 */
export interface ArenaResponse {
  /** 问题 ID */
  questionId: string
  /** 原始问题 */
  question: string
  /** 4 个回答 */
  answers: Answer[]
}

/**
 * 点赞请求
 */
export interface VoteRequest {
  /** 问题 ID */
  questionId: string
  /** 回答 ID */
  answerId: string
}

/**
 * 点赞响应
 */
export interface VoteResponse {
  /** 是否成功 */
  success: boolean
}

/**
 * 统计数据响应
 * key: 提供商 ID, value: 投票数量
 */
export type StatsResponse = Record<string, number>
