
import type { CSSProperties, MouseEvent } from 'react'
import { Empty } from 'antd'
import type { FormInstance } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import clsx from 'clsx'
import type { Task } from '@/types/arena'
import type { ArenaSession } from '@/stores/arena'
import { TaskSidebarCreateTaskModal } from './TaskSidebarCreateTaskModal'
import { TaskSidebarHeader, TaskTreeItem } from './sidebar'

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
      <TaskSidebarHeader
        taskCount={tasks.length}
        isTasksLoading={isTasksLoading}
        disabled={disabled}
        onRefreshTaskList={onRefreshTaskList}
        onToggleCollapse={onToggleCollapse}
      />

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

      <div className="flex-1 p-2 overflow-auto">
        {tasks.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无任务" className="my-8" />
        ) : (
          <div className="space-y-1">
            {sortedTasks.map((task) => (
              <TaskTreeItem
                key={task.id}
                task={task}
                activeTaskId={activeTaskId}
                activeSessionId={activeSessionId}
                disabled={disabled}
                editingTaskId={editingTaskId}
                editingSessionId={editingSessionId}
                editValue={editValue}
                setEditValue={setEditValue}
                getTaskSessions={getTaskSessions}
                onToggleTaskExpanded={onToggleTaskExpanded}
                onCreateSession={onCreateSession}
                onSelectSession={onSelectSession}
                onDeleteTask={onDeleteTask}
                onStartEditTask={onStartEditTask}
                onFinishEditTask={onFinishEditTask}
                onDeleteSession={onDeleteSession}
                onStartEditSession={onStartEditSession}
                onFinishEditSession={onFinishEditSession}
              />
            ))}
          </div>
        )}
      </div>

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
