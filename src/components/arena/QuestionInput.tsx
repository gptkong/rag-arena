// QuestionInput - 问题输入组件 (使用 @ant-design/x Sender)

import { useRef, useState } from 'react'
import { Sender } from '@ant-design/x'
import type { SenderRef } from '@ant-design/x/es/sender'
import { Tooltip } from 'antd'
import {
  SendOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import type { DateRange } from '@/types/common'

import { QuestionInputDateRangeHeader } from './QuestionInputDateRangeHeader'
import { QuestionInputDisabledState } from './QuestionInputDisabledState'

interface QuestionInputProps {
  /** 是否加载中 */
  loading?: boolean
  /** 是否禁用 (已有回答时) */
  disabled?: boolean
  /** 受控输入值（用于 Prompt 库填入等） */
  value?: string
  /** 受控输入变更回调 */
  onChange?: (value: string) => void
  /** 提交问题回调 */
  onSubmit: (question: string, dateRange?: DateRange) => void
  /** 重新提问回调 */
  onReset?: () => void
}

export function QuestionInput({
  loading = false,
  disabled = false,
  value,
  onChange,
  onSubmit,
  onReset,
}: QuestionInputProps) {
  const [innerValue, setInnerValue] = useState('')
  const [dateRange, setDateRange] = useState<DateRange>([
    dayjs().subtract(7, 'day'),
    dayjs(),
  ])
  const senderRef = useRef<SenderRef>(null)

  const mergedValue = value ?? innerValue
  const setMergedValue = onChange ?? setInnerValue

  const handleSubmit = async (content: string) => {
    const trimmed = content.trim()
    if (!trimmed) return

    onSubmit(trimmed, dateRange)
  }

  const handleReset = () => {
    setMergedValue('')
    setDateRange(null)
    onReset?.()
  }

  const handleDateChange = (dates: DateRange) => {
    setDateRange(dates)
  }

  // 已有回答时，显示重新提问按钮
  if (disabled) {
    return <QuestionInputDisabledState loading={loading} onReset={handleReset} />
  }

  const headerNode = (
    <QuestionInputDateRangeHeader
      dateRange={dateRange}
      loading={loading}
      onDateChange={handleDateChange}
      onClearDateRange={() => setDateRange(null)}
    />
  )

  return (
    <div className="w-full">
      {/* 主输入框卡片 */}
      <div className="relative group">
        {/* 背景光晕效果 */}
        <div className="absolute transition-opacity duration-500 rounded-lg -inset-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 opacity-15 blur-xl group-hover:opacity-25" />

        {/* 输入框容器 - 单一边框 */}
        <div className="relative overflow-hidden transition-all duration-300 border rounded-md shadow-lg shadow-slate-200/40 hover:shadow-xl hover:shadow-teal-200/30 bg-white/95 backdrop-blur-xl border-slate-200/60 hover:border-teal-300/50">
          <Sender
            ref={senderRef}
            value={mergedValue}
            onChange={setMergedValue}
            onSubmit={handleSubmit}
            onCancel={() => setMergedValue('')}
            loading={loading}
            placeholder="输入您想问的问题，让多个 AI 模型为您解答..."
            autoSize={{ minRows: 3, maxRows: 8 }}
            header={headerNode}
            className="!border-0 !rounded-none !bg-transparent [&_.ant-sender-content]:!bg-transparent [&_.ant-sender-header]:!border-0"
            suffix={(_, { components: { SendButton, LoadingButton } }) => {
              if (loading) {
                return (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 animate-pulse">正在思考...</span>
                    <LoadingButton className="!rounded" />
                  </div>
                )
              }
              return (
                <Tooltip title="发送问题 (Enter)">
                  <SendButton
                    icon={<SendOutlined className="rotate-[-45deg] text-lg" />}
                    className="!w-11 !h-11 !rounded !bg-gradient-to-br !from-teal-500 !via-emerald-500 !to-cyan-500 hover:!from-teal-600 hover:!via-emerald-600 hover:!to-cyan-600 !border-0 !shadow-lg !shadow-teal-500/25 hover:!shadow-xl hover:!shadow-teal-500/35 hover:scale-105 transition-all duration-300"
                  />
                </Tooltip>
              )
            }}
          />
        </div>
      </div>

      {/* 底部提示 */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <kbd className="px-2 py-1 bg-white/80 rounded text-slate-600 font-mono text-[11px] shadow-sm border border-slate-200">
            Enter
          </kbd>
          <span>发送</span>
        </div>
        <div className="w-px h-3 bg-slate-200" />
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <kbd className="px-2 py-1 bg-white/80 rounded text-slate-600 font-mono text-[11px] shadow-sm border border-slate-200">
            Shift + Enter
          </kbd>
          <span>换行</span>
        </div>
      </div>
    </div>
  )
}
