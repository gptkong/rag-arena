// SessionSidebar - 历史会话侧边栏（使用 @ant-design/x Conversations）

import type { CSSProperties } from 'react'
import { Conversations, type ConversationItemType } from '@ant-design/x'
import { Modal, Empty, Badge, Tooltip } from 'antd'
import {
  MessageOutlined,
  HistoryOutlined,
  DeleteOutlined,
  LeftOutlined,
  RightOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import clsx from 'clsx'
import { useArenaStore } from '@/stores/arena'

interface SessionSidebarProps {
  className?: string
  style?: CSSProperties
  /** 禁用交互（例如流式生成中避免跨会话串写） */
  disabled?: boolean
  /** 选中会话后回调（如用于关闭移动端抽屉） */
  onAfterSelect?: () => void
  /** 是否折叠 */
  collapsed?: boolean
  /** 折叠状态变化回调 */
  onCollapsedChange?: (collapsed: boolean) => void
}

export function SessionSidebar({
  className,
  style,
  disabled = false,
  onAfterSelect,
  collapsed = false,
  onCollapsedChange,
}: SessionSidebarProps) {
  const sessions = useArenaStore((s) => s.sessions)
  const activeSessionId = useArenaStore((s) => s.activeSessionId)
  const startNewSession = useArenaStore((s) => s.startNewSession)
  const setActiveSessionId = useArenaStore((s) => s.setActiveSessionId)
  const deleteSession = useArenaStore((s) => s.deleteSession)

  const sortedSessions = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt)

  const items: ConversationItemType[] = sortedSessions.map((s) => ({
    key: s.id,
    label: s.title || '新会话',
    icon: (
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center flex-shrink-0">
        <MessageOutlined className="text-teal-500 text-sm" />
      </div>
    ),
    disabled,
  }))

  const handleCreate = () => {
    if (disabled) return
    startNewSession()
    onAfterSelect?.()
  }

  const handleSelect = (sessionId: string) => {
    if (disabled) return
    setActiveSessionId(sessionId)
    onAfterSelect?.()
  }

  const handleDelete = (sessionId: string) => {
    if (disabled) return
    Modal.confirm({
      title: '删除会话',
      icon: <DeleteOutlined className="text-red-500" />,
      content: '删除后将无法恢复（仅影响本地浏览器）。确认删除？',
      okText: '删除',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: () => deleteSession(sessionId),
    })
  }

  const toggleCollapse = () => {
    onCollapsedChange?.(!collapsed)
  }

  // 折叠状态下的精简视图
  if (collapsed) {
    return (
      <div
        className={clsx(
          'flex flex-col items-center py-4 gap-3 glass-card !rounded-2xl h-full',
          className,
        )}
        style={style}
      >
        {/* 展开按钮 */}
        <Tooltip title="展开侧边栏" placement="right">
          <button
            onClick={toggleCollapse}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white hover:from-teal-600 hover:to-emerald-600 transition-all duration-300 shadow-md shadow-teal-500/25"
          >
            <RightOutlined className="text-sm" />
          </button>
        </Tooltip>

        {/* 新建会话按钮 */}
        <Tooltip title="新建会话" placement="right">
          <button
            onClick={handleCreate}
            disabled={disabled}
            className={clsx(
              'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300',
              disabled
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600 hover:from-emerald-100 hover:to-teal-100 hover:shadow-md',
            )}
          >
            <PlusOutlined className="text-sm" />
          </button>
        </Tooltip>

        {/* 分隔线 */}
        <div className="w-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        {/* 会话列表缩略图 */}
        <div className="flex-1 overflow-auto w-full px-2 space-y-2">
          {sortedSessions.slice(0, 10).map((session) => (
            <Tooltip key={session.id} title={session.title || '新会话'} placement="right">
              <button
                onClick={() => handleSelect(session.id)}
                disabled={disabled}
                className={clsx(
                  'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 mx-auto',
                  activeSessionId === session.id
                    ? 'bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-md shadow-teal-500/25'
                    : disabled
                      ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
                      : 'bg-gradient-to-br from-teal-50 to-emerald-50 text-teal-500 hover:from-teal-100 hover:to-emerald-100',
                )}
              >
                <MessageOutlined className="text-sm" />
              </button>
            </Tooltip>
          ))}
          {sessions.length > 10 && (
            <div className="text-center text-xs text-slate-400">+{sessions.length - 10}</div>
          )}
        </div>

        {/* 会话数量 */}
        <Badge count={sessions.length} size="small" color="#14b8a6" />
      </div>
    )
  }

  // 展开状态下的完整视图
  return (
    <div
      className={clsx('glass-card !rounded-2xl overflow-hidden flex flex-col h-full', className)}
      style={style}
    >
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
            <HistoryOutlined className="text-white text-xs" />
          </div>
          <span className="font-semibold text-slate-700">历史会话</span>
          <Badge count={sessions.length} size="small" color="#14b8a6" />
        </div>
        <Tooltip title="收起侧边栏">
          <button
            onClick={toggleCollapse}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
          >
            <LeftOutlined className="text-xs" />
          </button>
        </Tooltip>
      </div>

      {/* 会话列表 */}
      <div className="flex-1 overflow-auto p-2">
        {sessions.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无历史会话" className="my-8" />
        ) : (
          <Conversations
            items={items}
            activeKey={activeSessionId}
            onActiveChange={handleSelect}
            creation={{
              label: '新建会话',
              onClick: handleCreate,
              disabled,
            }}
            menu={(conversation) => ({
              items: [
                {
                  key: 'delete',
                  label: '删除',
                  danger: true,
                  icon: <DeleteOutlined />,
                },
              ],
              onClick: ({ key }) => {
                if (key === 'delete') handleDelete(conversation.key)
              },
            })}
          />
        )}
      </div>
    </div>
  )
}
