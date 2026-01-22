import type { MouseEvent } from 'react'
import { Input, Tooltip } from 'antd'
import { DeleteOutlined, EditOutlined, MessageOutlined } from '@ant-design/icons'
import clsx from 'clsx'
import type { ArenaSession } from '@/stores/arena'

export interface SessionTreeItemProps {
  session: ArenaSession
  activeSessionId: string
  disabled: boolean
  editingSessionId: string | null
  editValue: string
  setEditValue: (value: string) => void
  onSelectSession: (sessionId: string) => void
  onStartEditSession: (sessionId: string, currentTitle: string, e: MouseEvent) => void
  onFinishEditSession: () => void
  onDeleteSession: (sessionId: string, e: MouseEvent) => void
}

export function SessionTreeItem({
  session,
  activeSessionId,
  disabled,
  editingSessionId,
  editValue,
  setEditValue,
  onSelectSession,
  onStartEditSession,
  onFinishEditSession,
  onDeleteSession,
}: SessionTreeItemProps) {
  const isSessionActive = activeSessionId === session.id

  return (
    <div
      onClick={() => onSelectSession(session.id)}
      className={clsx(
        'group flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-all duration-200',
        isSessionActive
          ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-sm'
          : 'hover:bg-slate-50',
        disabled && 'cursor-not-allowed opacity-60'
      )}
    >
      <span
        className={clsx(
          'w-5 h-5 rounded flex items-center justify-center flex-shrink-0',
          isSessionActive ? 'bg-white/20' : 'bg-gradient-to-br from-slate-100 to-slate-50'
        )}
      >
        <MessageOutlined
          className={clsx('text-xs', isSessionActive ? 'text-white' : 'text-slate-500')}
        />
      </span>

      {editingSessionId === session.id ? (
        <Input
          size="small"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={onFinishEditSession}
          onPressEnter={onFinishEditSession}
          onClick={(e) => e.stopPropagation()}
          autoFocus
          className="flex-1"
        />
      ) : (
        <span
          className={clsx(
            'flex-1 text-sm truncate',
            isSessionActive ? 'text-white' : 'text-slate-500'
          )}
        >
          {session.title || '新会话'}
        </span>
      )}

      {!isSessionActive && (
        <div className="items-center hidden gap-1 group-hover:flex">
          <Tooltip title="重命名">
            <button
              onClick={(e) => onStartEditSession(session.id, session.title, e)}
              className="flex items-center justify-center w-5 h-5 transition-colors rounded cursor-pointer text-slate-500 hover:text-blue-600 hover:bg-blue-50"
            >
              <EditOutlined className="text-xs" />
            </button>
          </Tooltip>
          <Tooltip title="删除">
            <button
              onClick={(e) => onDeleteSession(session.id, e)}
              className="flex items-center justify-center w-5 h-5 transition-colors rounded cursor-pointer text-slate-500 hover:text-red-600 hover:bg-red-50"
            >
              <DeleteOutlined className="text-xs" />
            </button>
          </Tooltip>
        </div>
      )}

      {isSessionActive && (
        <div className="flex items-center gap-1">
          <Tooltip title="重命名">
            <button
              onClick={(e) => onStartEditSession(session.id, session.title, e)}
              className="flex items-center justify-center w-5 h-5 transition-colors rounded text-white/70 hover:text-white hover:bg-white/20"
            >
              <EditOutlined className="text-xs" />
            </button>
          </Tooltip>
          <Tooltip title="删除">
            <button
              onClick={(e) => onDeleteSession(session.id, e)}
              className="flex items-center justify-center w-5 h-5 transition-colors rounded text-white/70 hover:text-white hover:bg-white/20"
            >
              <DeleteOutlined className="text-xs" />
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  )
}
