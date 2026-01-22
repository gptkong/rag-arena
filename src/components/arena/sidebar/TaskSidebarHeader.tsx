import { Badge, Spin, Tooltip } from 'antd'
import { FolderOutlined, LeftOutlined, ReloadOutlined } from '@ant-design/icons'
import clsx from 'clsx'

export interface TaskSidebarHeaderProps {
  taskCount: number
  isTasksLoading: boolean
  disabled: boolean
  onRefreshTaskList: () => void
  onToggleCollapse: () => void
}

export function TaskSidebarHeader({
  taskCount,
  isTasksLoading,
  disabled,
  onRefreshTaskList,
  onToggleCollapse,
}: TaskSidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center rounded w-7 h-7 bg-gradient-to-br from-teal-500 to-emerald-500">
          <FolderOutlined className="text-xs text-white" />
        </div>
        <span className="font-semibold text-slate-700">任务列表</span>
        <Badge count={taskCount} size="small" color="#14b8a6" />
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
  )
}
