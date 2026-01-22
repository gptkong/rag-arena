// TaskSidebarCreateTaskModal - create task dialog UI

import { Form, Input, Modal } from 'antd'
import type { FormInstance } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

export interface TaskSidebarCreateTaskModalProps {
  open: boolean
  confirmLoading: boolean
  form: FormInstance
  onOk: () => void | Promise<void>
  onCancel: () => void
}

export function TaskSidebarCreateTaskModal({
  open,
  confirmLoading,
  form,
  onOk,
  onCancel,
}: TaskSidebarCreateTaskModalProps) {
  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-gradient-to-br from-teal-500 to-emerald-500">
            <PlusOutlined className="text-sm text-white" />
          </div>
          <span className="text-lg font-semibold text-slate-700">新建任务</span>
        </div>
      }
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      okText="创建"
      cancelText="取消"
      width={520}
      destroyOnClose
      okButtonProps={{
        className:
          'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 border-0',
      }}
      className="[&_.ant-modal-header]:border-b [&_.ant-modal-header]:border-slate-200"
    >
      <Form form={form} layout="vertical" className="mt-2">
        <Form.Item
          label={<span className="font-medium text-slate-700">任务标题</span>}
          name="title"
          rules={[
            { required: true, message: '请输入任务标题' },
            { max: 100, message: '任务标题不能超过100个字符' },
          ]}
        >
          <Input
            placeholder="请输入任务标题"
            maxLength={100}
            showCount
            autoFocus
            className="rounded-md"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label={<span className="font-medium text-slate-700">任务描述</span>}
          name="description"
          rules={[{ max: 500, message: '任务描述不能超过500个字符' }]}
        >
          <Input.TextArea
            placeholder="请输入任务描述（可选）"
            rows={4}
            maxLength={500}
            showCount
            className="rounded-md"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
