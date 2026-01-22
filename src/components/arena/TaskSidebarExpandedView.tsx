// TaskSidebarExpandedView - expanded sidebar UI

import type { CSSProperties, MouseEvent } from 'react'
import { Badge, Empty, Input, Spin, Tooltip } from 'antd'
import type { FormInstance } from 'antd'
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  LeftOutlined,
  MessageOutlined,
  PlusOutlined,
  ReloadOutlined,
  RightOutlined,
} from '@ant-design/icons'
import clsx from 'clsx'
import type { Task } from '@/types/arena'
import type { ArenaSession } from '@/stores/arena'
import { TaskSidebarCreateTaskModal } from './TaskSidebarCreateTaskModal'

export interface TaskSidebarExpandedViewProps {
  className?: string
  style?: CSSProperties
  disabled?: boolean
  tasks: Task[]
  sortedTasks: Task[]
  activeTaskId: string
  activeSessionId: string
  isTasksLoading: boolean

  editingTaskId: string | null
  editingSessionId: string | null
  editValue: string
  setEditValue: (value: string) => void

  getTaskSessions: (taskId: string) => ArenaSession[]

  onToggleCollapse: () => void
  onRefreshTaskList: () => void

  onCreateTask: () => void
  onToggleTaskExpanded: (taskId: string) => void
  onCreateSession: (taskId: string, e: MouseEvent) => void
  onSelectSession: (sessionId: string) => void

  onDeleteTask: (taskId: string, e: MouseEvent) => void
  onStartEditTask: (taskId: string, currentTitle: string, e: MouseEvent) => void
  onFinishEditTask: () => void

  onDeleteSession: (sessionId: string, e: MouseEvent) => void
  onStartEditSession: (sessionId: string, currentTitle: string, e: MouseEvent) => void
  onFinishEditSession: () => void

  // Create task modal
  isCreateTaskModalOpen: boolean
  isSubmitting: boolean
  createTaskForm: FormInstance
  onCreateTaskSubmit: () => void | Promise<void>
  onCreateTaskCancel: () => void
}

export function TaskSidebarExpandedView({
  className,
  style,
  disabled = false,
  tasks,
  sortedTasks,
  activeTaskId,
  activeSessionId,
  isTasksLoading,
  editingTaskId,
  editingSessionId,
  editValue,
  setEditValue,
  getTaskSessions,
  onToggleCollapse,
  onRefreshTaskList,
  onCreateTask,
  onToggleTaskExpanded,
  onCreateSession,
  onSelectSession,
  onDeleteTask,
  onStartEditTask,
  onFinishEditTask,
  onDeleteSession,
  onStartEditSession,
  onFinishEditSession,
  isCreateTaskModalOpen,
  isSubmitting,
  createTaskForm,
  onCreateTaskSubmit,
  onCreateTaskCancel,
}: TaskSidebarExpandedViewProps) {
  return (
    <div
      className={clsx('glass-card !rounded-md overflow-hidden flex flex-col h-full', className)}
      style={style}
    >
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded w-7 h-7 bg-gradient-to-br from-teal-500 to-emerald-500">
            <FolderOutlined className="text-xs text-white" />
          </div>
          <span className="font-semibold text-slate-700">任务列表</span>
          <Badge count={tasks.length} size="small" color="#14b8a6" />
        </div>
        <div className="flex items-center gap-1">
          <Tooltip title="刷新任务列表">
            <button
              onClick={onRefreshTaskList}
              disabled={isTasksLoading || disabled}
              className={clsx(
                'w-7 h-7 rounded flex items-center justify-center transition-all duration-200 cursor-pointer',
                isTasksLoading || disabled
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              )}
            >
              {isTasksLoading ? <Spin size="small" /> : <ReloadOutlined className="text-xs" />}
            </button>
          </Tooltip>
          <Tooltip title="收起侧边栏">
            <button
              onClick={onToggleCollapse}
              className="flex items-center justify-center transition-all duration-200 rounded cursor-pointer w-7 h-7 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            >
              <LeftOutlined className="text-xs" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* 新建任务按钮 */}
      <div className="px-3 py-2 border-b border-slate-200">
        <button
          onClick={onCreateTask}
          disabled={disabled}
          className={clsx(
            'w-full flex items-center gap-2 px-3 py-2 rounded transition-all duration-200',
            disabled
              ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-600 hover:from-emerald-100 hover:to-teal-100'
          )}
        >
          <PlusOutlined className="text-sm" />
          <span className="text-sm font-medium">新建任务</span>
        </button>
      </div>

      {/* 任务树形列表 */}
      <div className="flex-1 p-2 overflow-auto">
        {tasks.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无任务" className="my-8" />
        ) : (
          <div className="space-y-1">
            {sortedTasks.map((task) => {
              const taskSessions = getTaskSessions(task.id)
              const isActive = activeTaskId === task.id

              return (
                <div key={task.id} className="select-none">
                  {/* 任务节点 */}
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
                    {/* 展开/折叠图标 */}
                    <span className="flex items-center justify-center w-4 h-4 text-slate-500">
                      {task.expanded ? <DownOutlined className="text-xs" /> : <RightOutlined className="text-xs" />}
                    </span>

                    {/* 文件夹图标 */}
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

                    {/* 任务标题 */}
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

                    {/* 会话数量 */}
                    <Badge
                      count={taskSessions.length}
                      size="small"
                      className="opacity-60"
                      color={isActive ? '#14b8a6' : '#94a3b8'}
                    />

                    {/* 操作按钮 */}
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

                  {/* 会话列表（展开时显示） */}
                  {task.expanded && (
                    <div className="ml-6 mt-1 space-y-0.5">
                      {taskSessions.map((session) => {
                        const isSessionActive = activeSessionId === session.id

                        return (
                          <div
                            key={session.id}
                            onClick={() => onSelectSession(session.id)}
                            className={clsx(
                              'group flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-all duration-200',
                              isSessionActive
                                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-sm'
                                : 'hover:bg-slate-50',
                              disabled && 'cursor-not-allowed opacity-60'
                            )}
                          >
                            {/* 会话图标 */}
                            <span
                              className={clsx(
                                'w-5 h-5 rounded flex items-center justify-center flex-shrink-0',
                                isSessionActive
                                  ? 'bg-white/20'
                                  : 'bg-gradient-to-br from-slate-100 to-slate-50'
                              )}
                            >
                              <MessageOutlined
                                className={clsx(
                                  'text-xs',
                                  isSessionActive ? 'text-white' : 'text-slate-500'
                                )}
                              />
                            </span>

                            {/* 会话标题 */}
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

                            {/* 操作按钮 */}
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

                            {/* 选中状态的操作按钮 */}
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
                      })}

                      {/* 任务内新建会话按钮 */}
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
            })}
          </div>
        )}
      </div>

      {/* 新建任务弹窗 */}
      <TaskSidebarCreateTaskModal
        open={isCreateTaskModalOpen}
        confirmLoading={isSubmitting}
        form={createTaskForm}
        onOk={onCreateTaskSubmit}
        onCancel={onCreateTaskCancel}
      />
    </div>
  )
}
