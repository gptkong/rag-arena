// SessionSidebar - 历史会话侧边栏（使用 @ant-design/x Conversations）

import type { CSSProperties } from 'react'
import { Conversations, type ConversationItemType } from '@ant-design/x'
import { Card, Modal } from 'antd'
import { MessageOutlined } from '@ant-design/icons'
import clsx from 'clsx'
import { useArenaStore } from '@/stores/arena'

interface SessionSidebarProps {
  className?: string
  style?: CSSProperties
  /** 禁用交互（例如流式生成中避免跨会话串写） */
  disabled?: boolean
  /** 选中会话后回调（如用于关闭移动端抽屉） */
  onAfterSelect?: () => void
}

export function SessionSidebar({
  className,
  style,
  disabled = false,
  onAfterSelect,
}: SessionSidebarProps) {
  const sessions = useArenaStore((s) => s.sessions)
  const activeSessionId = useArenaStore((s) => s.activeSessionId)
  const startNewSession = useArenaStore((s) => s.startNewSession)
  const setActiveSessionId = useArenaStore((s) => s.setActiveSessionId)
  const deleteSession = useArenaStore((s) => s.deleteSession)

  const items: ConversationItemType[] = [...sessions]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map((s) => ({
      key: s.id,
      label: s.title || '新会话',
      icon: <MessageOutlined />,
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
      content: '删除后将无法恢复（仅影响本地浏览器）。确认删除？',
      okText: '删除',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: () => deleteSession(sessionId),
    })
  }

  return (
    <Card
      size="small"
      title="历史会话"
      className={clsx('h-full', className)}
      bodyStyle={{ padding: 8, height: '100%', display: 'flex', flexDirection: 'column' }}
      style={style}
    >
      <div className="flex-1 overflow-auto">
        <Conversations
          items={items}
          activeKey={activeSessionId}
          onActiveChange={handleSelect}
          creation={{ label: '新建会话', onClick: handleCreate, disabled }}
          menu={(conversation) => ({
            items: [{ key: 'delete', label: '删除', danger: true }],
            onClick: ({ key }) => {
              if (key === 'delete') handleDelete(conversation.key)
            },
          })}
        />
      </div>
    </Card>
  )
}
