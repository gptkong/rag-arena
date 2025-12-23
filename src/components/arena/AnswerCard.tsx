// AnswerCard - 单个回答卡片组件

import { useState, useRef, useEffect } from 'react'
import { Card, Button, Tag, Alert } from 'antd'
import { LikeOutlined, LikeFilled, FileTextOutlined, DownOutlined } from '@ant-design/icons'
import { XMarkdown } from '@ant-design/x-markdown'
import '@ant-design/x-markdown/themes/light.css'
import type { Answer } from '@/types/arena'
import { CitationCard } from './CitationCard'

interface AnswerCardProps {
  /** 回答数据 */
  answer: Answer
  /** 是否已点赞此回答 */
  isVoted: boolean
  /** 是否禁用点赞 (已投票给其他答案) */
  disabled: boolean
  /** 点赞加载状态 */
  loading?: boolean
  /** 点赞回调 */
  onVote: () => void
}

// 供应商标识颜色映射
const providerColors: Record<string, string> = {
  A: 'blue',
  B: 'green',
  C: 'orange',
  D: 'purple',
}

export function AnswerCard({
  answer,
  isVoted,
  disabled,
  loading = false,
  onVote,
}: AnswerCardProps) {
  const color = providerColors[answer.providerId] || 'default'
  const [citationsExpanded, setCitationsExpanded] = useState(true)
  const hasCitations = answer.citations && answer.citations.length > 0
  const hasError = Boolean(answer.error)

  // 内容区域 ref，用于自动滚动
  const contentRef = useRef<HTMLDivElement>(null)

  // 流式渲染时自动滚动到底部
  useEffect(() => {
    if (contentRef.current && answer.content) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
    }
  }, [answer.content])

  return (
    <Card
      className={`h-full flex flex-col transition-all ${
        isVoted ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}
      title={
        <div className="flex items-center gap-2">
          <Tag color={color} className="text-base px-3 py-1">
            模型 {answer.providerId}
          </Tag>
          {hasCitations && (
            <Tag 
              icon={<FileTextOutlined />} 
              color="cyan"
              className="text-xs"
            >
              {answer.citations!.length} 个引用
            </Tag>
          )}
        </div>
      }
      extra={
        <Button
          type={isVoted ? 'primary' : 'default'}
          icon={isVoted ? <LikeFilled /> : <LikeOutlined />}
          onClick={onVote}
          disabled={disabled && !isVoted}
          loading={loading}
          size="small"
        >
          {isVoted ? '已点赞' : '点赞'}
        </Button>
      }
    >
      {/* 回答内容区域 */}
      <div ref={contentRef} className="flex-1 overflow-auto max-h-80">
        {hasError && (
          <Alert
            type="error"
            showIcon
            message="生成失败"
            description={answer.error}
            className="mb-3"
          />
        )}
        <XMarkdown className="x-markdown-light" content={answer.content} />
      </div>

      {/* 引用摘要区域 */}
      {hasCitations && (
        <div className="mt-4 pt-4 border-t border-slate-200/60">
          {/* 展开/收起按钮 */}
          <button
            onClick={() => setCitationsExpanded(!citationsExpanded)}
            className={`
              flex items-center gap-3 w-full px-4 py-2.5 rounded-xl
              bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50
              hover:from-indigo-100 hover:via-purple-100 hover:to-pink-100
              border border-indigo-100 hover:border-indigo-200
              transition-all duration-300 group
            `}
          >
            {/* 图标容器 */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
              <FileTextOutlined className="text-white text-sm" />
            </div>
            
            {/* 文字 */}
            <div className="flex-1 text-left">
              <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors">
                参考来源
              </span>
              <span className="ml-2 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold">
                {answer.citations!.length}
              </span>
            </div>
            
            {/* 展开/收起图标 */}
            <div className={`
              w-6 h-6 rounded-full bg-white shadow-sm
              flex items-center justify-center
              text-slate-400 group-hover:text-indigo-500
              transition-all duration-300
              ${citationsExpanded ? 'rotate-180' : 'rotate-0'}
            `}>
              <DownOutlined className="text-xs" />
            </div>
          </button>
          
          {/* 引用列表 - 带动画 */}
          <div className={`
            overflow-hidden transition-all duration-300 ease-out
            ${citationsExpanded ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}
          `}>
            <div className="space-y-3 max-h-80 overflow-auto pr-1">
              {answer.citations!.map((citation, index) => (
                <CitationCard key={citation.id} citation={citation} index={index} />
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
