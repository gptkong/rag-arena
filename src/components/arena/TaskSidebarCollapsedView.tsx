// TaskSidebarCollapsedView - collapsed sidebar UI

import type { CSSProperties } from 'react'
import { Badge, Tooltip } from 'antd'
import { FolderOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons'
import clsx from 'clsx'
import type { Task } from '@/types/arena'

export interface TaskSidebarCollapsedViewProps {
  className?: string
  style?: CSSProperties
  disabled?: boolean
  tasks: Task[]
  sortedTasks: Task[]
  activeTaskId: string
  onToggleCollapse: () => void
  onCreateTask: () => void
  onSelectTask: (taskId: string) => void
}

export function TaskSidebarCollapsedView({
  className,
  style,
  disabled = false,
  tasks,
  sortedTasks,
  activeTaskId,
  onToggleCollapse,
  onCreateTask,
  onSelectTask,
}: TaskSidebarCollapsedViewProps) {
  return (
    <div
      className={clsx('flex flex-col items-center py-4 gap-3 glass-card !rounded-md h-full', className)}
      style={style}
    >
      {/* 展开按钮 */}
      <Tooltip title="展开侧边栏" placement="right">
        <button
          onClick={onToggleCollapse}
          className="flex items-center justify-center w-10 h-10 text-white transition-all duration-300 rounded shadow-md bg-gradient-to-br from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-teal-500/25"
        >
          <RightOutlined className="text-sm" />
        </button>
      </Tooltip>

      {/* 新建任务按钮 */}
      <Tooltip title="新建任务" placement="right">
        <button
          onClick={onCreateTask}
          disabled={disabled}
          className={clsx(
            'w-10 h-10 rounded flex items-center justify-center transition-all duration-300',
            disabled
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600 hover:from-emerald-100 hover:to-teal-100 hover:shadow-md'
          )}
        >
          <PlusOutlined className="text-sm" />
        </button>
      </Tooltip>

      {/* 分隔线 */}
      <div className="w-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* 任务列表缩略图 */}
      <div className="flex-1 w-full px-2 space-y-2 overflow-auto">
        {sortedTasks.slice(0, 10).map((task) => (
          <Tooltip key={task.id} title={task.title} placement="right">
            <button
              onClick={() => {
                if (!disabled) {
                  onSelectTask(task.id)
                }
              }}
              disabled={disabled}
              className={clsx(
                'w-10 h-10 rounded flex items-center justify-center transition-all duration-300 mx-auto',
                activeTaskId === task.id
                  ? 'bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-md shadow-teal-500/25'
                  : disabled
                    ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
                    : 'bg-gradient-to-br from-teal-50 to-emerald-50 text-teal-500 hover:from-teal-100 hover:to-emerald-100'
              )}
            >
              <FolderOutlined className="text-sm" />
            </button>
          </Tooltip>
        ))}
        {tasks.length > 10 && (
          <div className="text-xs text-center text-slate-500">+{tasks.length - 10}</div>
        )}
      </div>

      {/* 任务数量 */}
      <Badge count={tasks.length} size="small" color="#14b8a6" />
    </div>
  )
}
