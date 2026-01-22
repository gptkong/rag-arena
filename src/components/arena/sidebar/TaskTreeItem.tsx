import type { MouseEvent } from 'react'
import { Badge, Input, Tooltip } from 'antd'
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  PlusOutlined,
  RightOutlined,
} from '@ant-design/icons'
import clsx from 'clsx'
import type { Task } from '@/types/arena'
import type { ArenaSession } from '@/stores/arena'
import { SessionTreeItem } from './SessionTreeItem'

export interface TaskTreeItemProps {
  task: Task
  activeTaskId: string
  activeSessionId: string
  disabled: boolean
  editingTaskId: string | null
  editingSessionId: string | null
  editValue: string
  setEditValue: (value: string) => void
  getTaskSessions: (taskId: string) => ArenaSession[]
  onToggleTaskExpanded: (taskId: string) => void
  onCreateSession: (taskId: string, e: MouseEvent) => void
  onSelectSession: (sessionId: string) => void
  onDeleteTask: (taskId: string, e: MouseEvent) => void
  onStartEditTask: (taskId: string, currentTitle: string, e: MouseEvent) => void
  onFinishEditTask: () => void
  onDeleteSession: (sessionId: string, e: MouseEvent) => void
  onStartEditSession: (sessionId: string, currentTitle: string, e: MouseEvent) => void
  onFinishEditSession: () => void
}

export function TaskTreeItem({
  task,
  activeTaskId,
  activeSessionId,
  disabled,
  editingTaskId,
  editingSessionId,
  editValue,
  setEditValue,
  getTaskSessions,
  onToggleTaskExpanded,
  onCreateSession,
  onSelectSession,
  onDeleteTask,
  onStartEditTask,
  onFinishEditTask,
  onDeleteSession,
  onStartEditSession,
  onFinishEditSession,
}: TaskTreeItemProps) {
  const taskSessions = getTaskSessions(task.id)
  const isActive = activeTaskId === task.id

  return (
    <div className="select-none">
      <div
        onClick={() => {
          if (!disabled) {
            onToggleTaskExpanded(task.id)
          }
        }}
        className={clsx(
          'group flex items-center gap-2 px-2 py-2 rounded cursor-pointer transition-all duration-200',
          isActive ? 'bg-gradient-to-r from-teal-50 to-emerald-50' : 'hover:bg-slate-50',
          disabled && 'cursor-not-allowed opacity-60'
        )}
      >
        <span className="flex items-center justify-center w-4 h-4 text-slate-500">
          {task.expanded ? <DownOutlined className="text-xs" /> : <RightOutlined className="text-xs" />}
        </span>

        <span
          className={clsx(
            'w-6 h-6 rounded flex items-center justify-center',
            isActive
              ? 'bg-gradient-to-br from-teal-500 to-emerald-500 text-white'
              : 'bg-gradient-to-br from-teal-100 to-emerald-100 text-teal-500'
          )}
        >
          {task.expanded ? (
            <FolderOpenOutlined className="text-xs" />
          ) : (
            <FolderOutlined className="text-xs" />
          )}
        </span>

        {editingTaskId === task.id ? (
          <Input
            size="small"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={onFinishEditTask}
            onPressEnter={onFinishEditTask}
            onClick={(e) => e.stopPropagation()}
            autoFocus
            className="flex-1"
          />
        ) : (
          <span
            className={clsx(
              'flex-1 text-sm truncate',
              isActive ? 'text-teal-700 font-medium' : 'text-slate-600'
            )}
          >
            {task.title}
          </span>
        )}

        <Badge
          count={taskSessions.length}
          size="small"
          className="opacity-60"
          color={isActive ? '#14b8a6' : '#94a3b8'}
        />

        <div className="items-center hidden gap-1 group-hover:flex">
          <Tooltip title="新建会话">
            <button
              onClick={(e) => onCreateSession(task.id, e)}
              className="flex items-center justify-center w-6 h-6 transition-colors rounded cursor-pointer text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
            >
              <PlusOutlined className="text-xs" />
            </button>
          </Tooltip>
          <Tooltip title="重命名">
            <button
              onClick={(e) => onStartEditTask(task.id, task.title, e)}
              className="flex items-center justify-center w-6 h-6 transition-colors rounded cursor-pointer text-slate-500 hover:text-blue-600 hover:bg-blue-50"
            >
              <EditOutlined className="text-xs" />
            </button>
          </Tooltip>
          <Tooltip title="删除">
            <button
              onClick={(e) => onDeleteTask(task.id, e)}
              className="flex items-center justify-center w-6 h-6 transition-colors rounded cursor-pointer text-slate-500 hover:text-red-600 hover:bg-red-50"
            >
              <DeleteOutlined className="text-xs" />
            </button>
          </Tooltip>
        </div>
      </div>

      {task.expanded && (
        <div className="ml-6 mt-1 space-y-0.5">
          {taskSessions.map((session) => (
            <SessionTreeItem
              key={session.id}
              session={session}
              activeSessionId={activeSessionId}
              disabled={disabled}
              editingSessionId={editingSessionId}
              editValue={editValue}
              setEditValue={setEditValue}
              onSelectSession={onSelectSession}
              onStartEditSession={onStartEditSession}
              onFinishEditSession={onFinishEditSession}
              onDeleteSession={onDeleteSession}
            />
          ))}

          <button
            onClick={(e) => onCreateSession(task.id, e)}
            disabled={disabled}
            className={clsx(
              'w-full flex items-center gap-2 px-2 py-1.5 rounded transition-all duration-200 text-sm',
              disabled
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50 cursor-pointer'
            )}
          >
            <span className="flex items-center justify-center w-5 h-5 rounded">
              <PlusOutlined className="text-xs" />
            </span>
            <span>新建会话</span>
          </button>
        </div>
      )}
    </div>
  )
}
