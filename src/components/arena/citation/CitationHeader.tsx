import { PhoneOutlined, ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons'
import { Tag } from 'antd'
import type { Citation } from '@/types/arena'
import { formatDuration } from './utils'

interface CitationHeaderProps {
  citation: Citation
}

export function CitationHeader({ citation }: CitationHeaderProps) {
  return (
    <div className="px-6 py-3 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
      <div className="flex items-center gap-3 flex-wrap text-xs">
        {/* 主号码 */}
        {citation.callnumber && (
          <span className="inline-flex items-center gap-1 text-slate-600">
            <PhoneOutlined className="text-[10px] text-slate-400" />
            <span className="font-mono">{citation.callnumber}</span>
          </span>
        )}
        
        {/* 被号码 */}
        {citation.callednumber && (
          <>
            <span className="text-slate-300">→</span>
            <span className="inline-flex items-center gap-1 text-slate-600">
              <span className="font-mono">{citation.callednumber}</span>
            </span>
          </>
        )}

        {/* 分隔符 */}
        {(citation.callnumber || citation.callednumber) && (citation.duration || citation.start_time) && (
          <span className="text-slate-300">•</span>
        )}

        {/* 时长 */}
        {citation.duration && (
          <span className="inline-flex items-center gap-1 text-slate-600">
            <ClockCircleOutlined className="text-[10px] text-slate-400" />
            <span>{formatDuration(citation.duration)}</span>
          </span>
        )}

        {/* 分隔符 */}
        {citation.duration && citation.start_time && (
          <span className="text-slate-300">•</span>
        )}

        {/* 日期时间 */}
        {citation.start_time && (
          <span className="inline-flex items-center gap-1 text-slate-600">
            <CalendarOutlined className="text-[10px] text-slate-400" />
            <span>{citation.start_time}</span>
          </span>
        )}

        {/* 标签 */}
        {citation.labels && (
          <>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {citation.labels.split('|').map((label, i) => (
                <Tag key={i} color="blue" className="m-0 !text-[10px] !px-1.5 !py-0.5">
                  {label}
                </Tag>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
