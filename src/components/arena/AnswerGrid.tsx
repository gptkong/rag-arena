// AnswerGrid - 回答网格布局组件

import { Row, Col, Spin, Tabs, Tag } from 'antd'
import { AnswerCard } from './AnswerCard'
import type { Answer } from '@/types/arena'
import type { LayoutMode } from './LayoutSwitcher'

interface AnswerGridProps {
  /** 回答列表 */
  answers: Answer[]
  /** 已点赞的回答 ID */
  votedAnswerId: string | null
  /** 点赞加载状态 */
  votingAnswerId: string | null
  /** 点赞回调 */
  onVote: (answerId: string) => void
  /** 布局模式 */
  layoutMode?: LayoutMode
}

// 供应商标识颜色映射
const providerColors: Record<string, string> = {
  A: 'blue',
  B: 'green',
  C: 'orange',
  D: 'purple',
}

// 根据布局模式获取列宽配置
function getColSpan(mode: LayoutMode) {
  switch (mode) {
    case 'four-col':
      return { xs: 24, sm: 12, lg: 6 }
    case 'two-col':
      return { xs: 24, md: 12 }
    case 'one-col':
      return { xs: 24 }
    default:
      return { xs: 24, md: 12 }
  }
}

export function AnswerGrid({
  answers,
  votedAnswerId,
  votingAnswerId,
  onVote,
  layoutMode = 'two-col',
}: AnswerGridProps) {
  if (answers.length === 0) {
    return null
  }

  // Tabs 布局模式
  if (layoutMode === 'tabs') {
    return (
      <div className="w-full">
        <Tabs
          type="card"
          items={answers.map((answer) => ({
            key: answer.id,
            label: (
              <span className="flex items-center gap-2">
                <Tag color={providerColors[answer.providerId]} className="mr-0">
                  {answer.providerId}
                </Tag>
                模型 {answer.providerId}
                {votedAnswerId === answer.id && (
                  <span className="text-blue-500 ml-1">✓</span>
                )}
              </span>
            ),
            children: (
              <AnswerCard
                answer={answer}
                isVoted={votedAnswerId === answer.id}
                disabled={votedAnswerId !== null && votedAnswerId !== answer.id}
                loading={votingAnswerId === answer.id}
                onVote={() => onVote(answer.id)}
              />
            ),
          }))}
        />
      </div>
    )
  }

  // Grid 布局模式 (four-col / two-col / one-col)
  const colSpan = getColSpan(layoutMode)

  return (
    <div className="w-full">
      <Row gutter={[16, 16]}>
        {answers.map((answer) => (
          <Col key={answer.id} {...colSpan}>
            <AnswerCard
              answer={answer}
              isVoted={votedAnswerId === answer.id}
              disabled={votedAnswerId !== null && votedAnswerId !== answer.id}
              loading={votingAnswerId === answer.id}
              onVote={() => onVote(answer.id)}
            />
          </Col>
        ))}
      </Row>
    </div>
  )
}

interface AnswerGridSkeletonProps {
  /** 是否显示 */
  visible: boolean
}

export function AnswerGridSkeleton({ visible }: AnswerGridSkeletonProps) {
  if (!visible) return null

  return (
    <div className="w-full flex items-center justify-center py-20">
      <Spin size="large" tip="正在获取回答..." />
    </div>
  )
}
