// TaskSidebar - 任务列表侧边栏（树形结构）

import type { CSSProperties } from 'react'
import { useTaskSidebarController } from '@/hooks/useTaskSidebarController'
import { TaskSidebarCollapsedView } from './TaskSidebarCollapsedView'
import { TaskSidebarExpandedView } from './TaskSidebarExpandedView'

interface TaskSidebarProps {
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

export function TaskSidebar({
  className,
  style,
  disabled = false,
  onAfterSelect,
  collapsed = false,
  onCollapsedChange,
}: TaskSidebarProps) {
  const controller = useTaskSidebarController({
    disabled,
    collapsed,
    onAfterSelect,
    onCollapsedChange,
  })

  // 折叠状态下的精简视图
  if (collapsed) {
    return (
      <TaskSidebarCollapsedView
        className={className}
        style={style}
        disabled={disabled}
        tasks={controller.tasks}
        sortedTasks={controller.sortedTasks}
        activeTaskId={controller.activeTaskId}
        onToggleCollapse={controller.toggleCollapse}
        onCreateTask={controller.handleCreateTask}
        onSelectTask={controller.handleSelectTask}
      />
    )
  }

  // 展开状态下的完整视图
  return (
    <TaskSidebarExpandedView
      className={className}
      style={style}
      disabled={disabled}
      tasks={controller.tasks}
      sortedTasks={controller.sortedTasks}
      activeTaskId={controller.activeTaskId}
      activeSessionId={controller.activeSessionId}
      isTasksLoading={controller.isTasksLoading}
      editingTaskId={controller.editingTaskId}
      editingSessionId={controller.editingSessionId}
      editValue={controller.editValue}
      setEditValue={controller.setEditValue}
      getTaskSessions={controller.getTaskSessions}
      onToggleCollapse={controller.toggleCollapse}
      onRefreshTaskList={controller.handleRefreshTaskList}
      onCreateTask={controller.handleCreateTask}
      onToggleTaskExpanded={controller.toggleTaskExpanded}
      onCreateSession={controller.handleCreateSession}
      onSelectSession={controller.handleSelectSession}
      onDeleteTask={controller.handleDeleteTask}
      onStartEditTask={controller.handleStartEditTask}
      onFinishEditTask={controller.handleFinishEditTask}
      onDeleteSession={controller.handleDeleteSession}
      onStartEditSession={controller.handleStartEditSession}
      onFinishEditSession={controller.handleFinishEditSession}
      isCreateTaskModalOpen={controller.isCreateTaskModalOpen}
      isSubmitting={controller.isSubmitting}
      createTaskForm={controller.createTaskForm}
      onCreateTaskSubmit={controller.handleCreateTaskSubmit}
      onCreateTaskCancel={controller.handleCreateTaskCancel}
    />
  )
}
