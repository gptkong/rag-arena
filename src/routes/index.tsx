// Arena Page - RAG 问答竞技场首页

import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Typography, message, Alert, Drawer, Button } from 'antd'
import { TrophyOutlined, ThunderboltOutlined, HistoryOutlined } from '@ant-design/icons'
import {
  QuestionInput,
  AnswerGrid,
  AnswerGridSkeleton,
  LayoutSwitcher,
  SessionSidebar,
  type LayoutMode,
  type DateRange,
} from '@/components/arena'
import { useArenaStore } from '@/stores/arena'
import { arenaApi } from '@/services/arena'

const { Title, Text } = Typography

export const Route = createFileRoute('/')({
  component: ArenaPage,
})

function ArenaPage() {
  const {
    isLoading,
    setAnswers,
    appendAnswerDelta,
    finalizeAnswer,
    setAnswerError,
    setLoading,
    setVotedAnswerId,
    startNewSession,
    startSessionWithQuestion,
    setServerQuestionId,
  } = useArenaStore()

  const [votingAnswerId, setVotingAnswerId] = useState<string | null>(null)
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('two-col')
  const [historyOpen, setHistoryOpen] = useState(false)

  const { activeSessionId, activeSession } = useArenaStore((s) => ({
    activeSessionId: s.activeSessionId,
    activeSession: s.sessions.find((ss) => ss.id === s.activeSessionId) || null,
  }))

  const question = activeSession?.question || ''
  const questionId = activeSession?.serverQuestionId || null
  const answers = activeSession?.answers || []
  const votedAnswerId = activeSession?.votedAnswerId || null

  useEffect(() => {
    setVotingAnswerId(null)
  }, [activeSessionId])

  // 提交问题
  const handleSubmit = async (q: string, dateRange?: DateRange) => {
    startSessionWithQuestion(q)
    setLoading(true)

    try {
      setServerQuestionId(null)
      setAnswers([])

      const deltaBuffer = new Map<string, string>()
      let flushScheduled = false
      const flush = () => {
        flushScheduled = false
        for (const [answerId, delta] of deltaBuffer) {
          if (delta) appendAnswerDelta(answerId, delta)
        }
        deltaBuffer.clear()
      }
      const scheduleFlush = () => {
        if (flushScheduled) return
        flushScheduled = true
        requestAnimationFrame(flush)
      }

      await arenaApi.submitQuestionStream(q, dateRange, {
        onMeta: (meta) => {
          setServerQuestionId(meta.questionId)
          setAnswers(
            meta.answers.map((a) => ({
              id: a.answerId,
              providerId: a.providerId,
              content: '',
            })),
          )
        },
        onDelta: (e) => {
          deltaBuffer.set(e.answerId, `${deltaBuffer.get(e.answerId) || ''}${e.delta}`)
          scheduleFlush()
        },
        onAnswerDone: (e) => {
          flush()
          finalizeAnswer(e.answerId, {
            content: e.content,
            citations: e.citations,
          })
        },
        onAnswerError: (e) => {
          flush()
          setAnswerError(e.answerId, e.message)
        },
        onDone: (e) => {
          flush()
          if (!e.ok) {
            throw new Error(e.message || '获取回答失败，请重试')
          }
        },
      })
    } catch (error) {
      message.error(error instanceof Error ? error.message : '获取回答失败，请重试')
      setServerQuestionId(null)
      setAnswers([])
    } finally {
      setLoading(false)
    }
  }

  // 点赞
  const handleVote = async (answerId: string) => {
    if (isLoading) return
    if (!questionId) return

    // 如果点击已点赞的回答，取消点赞
    if (votedAnswerId === answerId) {
      setVotedAnswerId(null)
      return
    }

    setVotingAnswerId(answerId)

    try {
      await arenaApi.submitVote({ questionId, answerId })
      setVotedAnswerId(answerId)
      message.success('点赞成功！')
    } catch (error) {
      message.error(error instanceof Error ? error.message : '点赞失败，请重试')
    } finally {
      setVotingAnswerId(null)
    }
  }

  // 重新提问
  const handleReset = () => {
    if (isLoading) return
    startNewSession()
  }

  const hasAnswers = answers.length > 0
  const isActive = hasAnswers || isLoading

  return (
    <div className="mx-auto w-full max-w-7xl flex gap-6 min-h-[calc(100vh-4rem)]">
      {/* 桌面端侧边栏 */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-8 h-[calc(100vh-6rem)]">
          <SessionSidebar className="h-full" disabled={isLoading} />
        </div>
      </aside>

      {/* 主内容 */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* 标题和输入区域 */}
        <div className={`${isActive ? 'pt-0' : 'flex-1 flex flex-col justify-center'}`}>
          <div className="w-full max-w-4xl mx-auto">
            {/* 页面标题 */}
            <div className="text-center mb-8 relative">
              <Button
                className="lg:hidden absolute left-0 top-0"
                icon={<HistoryOutlined />}
                onClick={() => setHistoryOpen(true)}
                disabled={isLoading}
              >
                历史
              </Button>

              <Title
                level={isActive ? 3 : 1}
                className="flex items-center justify-center gap-3 !mb-3"
              >
                <TrophyOutlined className="text-yellow-500" />
                RAG 问答竞技场
              </Title>

              {!isActive && (
                <Text type="secondary" className="text-base">
                  <ThunderboltOutlined className="mr-2 text-amber-500" />
                  提出问题，对比 4 个 AI 模型的回答，为最佳答案点赞
                </Text>
              )}
            </div>

            {/* 问题输入区域 */}
            <div className="mb-8">
              <QuestionInput
                key={activeSessionId}
                loading={isLoading}
                disabled={hasAnswers}
                onSubmit={handleSubmit}
                onReset={handleReset}
              />
            </div>
          </div>
        </div>

        {/* 回答区域 */}
        {isActive && (
          <div className="flex-1 w-full">
            {/* 当前问题展示 + 布局切换 */}
            {question && hasAnswers && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <Alert
                  message="当前问题"
                  description={question}
                  type="info"
                  showIcon
                  className="flex-1 w-full sm:w-auto"
                />
                <div className="flex-shrink-0">
                  <LayoutSwitcher value={layoutMode} onChange={setLayoutMode} />
                </div>
              </div>
            )}

            {/* 加载状态 */}
            <AnswerGridSkeleton visible={isLoading && !hasAnswers} />

            {/* 回答网格 */}
            {hasAnswers && (
              <AnswerGrid
                answers={answers}
                votedAnswerId={votedAnswerId}
                votingAnswerId={votingAnswerId}
                onVote={handleVote}
                layoutMode={layoutMode}
                disableVoting={isLoading}
              />
            )}

            {/* 投票提示 */}
            {hasAnswers && !votedAnswerId && !isLoading && (
              <div className="text-center mt-6">
                <Text type="secondary">请为您认为最好的回答点赞</Text>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 移动端抽屉侧边栏 */}
      <Drawer
        title="历史会话"
        placement="left"
        width={320}
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        className="lg:hidden"
      >
        <SessionSidebar disabled={isLoading} onAfterSelect={() => setHistoryOpen(false)} />
      </Drawer>
    </div>
  )
}
