// CitationCard - 引用摘要卡片组件

import { Tooltip } from 'antd'
import {
  FileTextOutlined,
  LinkOutlined,
  FilePdfOutlined,
  GlobalOutlined,
  DatabaseOutlined,
  ApiOutlined,
  FileOutlined,
  BookOutlined,
} from '@ant-design/icons'
import type { Citation } from '@/types/arena'

interface CitationCardProps {
  /** 引用数据 */
  citation: Citation
  /** 序号 */
  index: number
}

// 文档类型配置
const docTypeConfig: Record<
  string,
  {
    icon: React.ReactNode
    label: string
    gradient: string
    bgColor: string
    borderColor: string
    textColor: string
  }
> = {
  pdf: {
    icon: <FilePdfOutlined />,
    label: 'PDF',
    gradient: 'from-rose-500 to-red-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-l-rose-500',
    textColor: 'text-rose-600',
  },
  webpage: {
    icon: <GlobalOutlined />,
    label: '网页',
    gradient: 'from-sky-500 to-blue-600',
    bgColor: 'bg-sky-50',
    borderColor: 'border-l-sky-500',
    textColor: 'text-sky-600',
  },
  database: {
    icon: <DatabaseOutlined />,
    label: '数据库',
    gradient: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-l-emerald-500',
    textColor: 'text-emerald-600',
  },
  api: {
    icon: <ApiOutlined />,
    label: 'API',
    gradient: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-l-violet-500',
    textColor: 'text-violet-600',
  },
  file: {
    icon: <FileOutlined />,
    label: '文件',
    gradient: 'from-slate-500 to-gray-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-l-slate-400',
    textColor: 'text-slate-600',
  },
  other: {
    icon: <FileTextOutlined />,
    label: '其他',
    gradient: 'from-gray-400 to-gray-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-l-gray-400',
    textColor: 'text-gray-500',
  },
}

// 相关性分数配置
const getRelevanceConfig = (score: number) => {
  if (score >= 85)
    return {
      label: '高度相关',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      barColor: 'bg-gradient-to-r from-emerald-400 to-green-500',
    }
  if (score >= 70)
    return {
      label: '较为相关',
      color: 'text-sky-600',
      bgColor: 'bg-sky-100',
      barColor: 'bg-gradient-to-r from-sky-400 to-blue-500',
    }
  if (score >= 50)
    return {
      label: '一般相关',
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      barColor: 'bg-gradient-to-r from-amber-400 to-orange-500',
    }
  return {
    label: '弱相关',
    color: 'text-slate-500',
    bgColor: 'bg-slate-100',
    barColor: 'bg-gradient-to-r from-slate-300 to-gray-400',
  }
}

export function CitationCard({ citation, index }: CitationCardProps) {
  const docType = citation.docType || 'other'
  const config = docTypeConfig[docType] || docTypeConfig.other

  const relevancePercent = citation.relevanceScore
    ? Math.round(citation.relevanceScore * 100)
    : null
  const relevanceConfig = relevancePercent
    ? getRelevanceConfig(relevancePercent)
    : null

  return (
    <div
      className={`
        group relative overflow-hidden rounded-xl
        bg-white border border-slate-200/80
        border-l-4 ${config.borderColor}
        hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300
        transition-all duration-300 ease-out
      `}
    >
      {/* 悬停时的微光效果 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />

      <div className="relative p-4">
        {/* 头部区域 */}
        <div className="flex items-start gap-3">
          {/* 序号 + 图标组合 */}
          <div className="flex-shrink-0 relative">
            <div
              className={`
                w-10 h-10 rounded-xl ${config.bgColor}
                flex items-center justify-center
                text-lg ${config.textColor}
                shadow-sm
                group-hover:scale-110 transition-transform duration-300
              `}
            >
              {config.icon}
            </div>
            {/* 序号徽章 */}
            <div
              className={`
                absolute -top-1.5 -right-1.5
                w-5 h-5 rounded-full
                bg-gradient-to-br ${config.gradient}
                text-white text-[10px] font-bold
                flex items-center justify-center
                shadow-md ring-2 ring-white
              `}
            >
              {index + 1}
            </div>
          </div>

          {/* 标题和元信息 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                {/* 文档类型标签 */}
                <span
                  className={`
                    inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                    text-[10px] font-medium uppercase tracking-wide
                    ${config.bgColor} ${config.textColor}
                    mb-1
                  `}
                >
                  {config.label}
                </span>

                {/* 标题 */}
                <h4 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-slate-900 transition-colors">
                  {citation.title}
                </h4>

                {/* 位置信息 */}
                {citation.location && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <BookOutlined className="text-slate-400 text-xs" />
                    <span className="text-xs text-slate-500 font-medium">
                      {citation.location}
                    </span>
                  </div>
                )}
              </div>

              {/* 相关性分数 */}
              {relevancePercent !== null && relevanceConfig && (
                <Tooltip
                  title={`${relevanceConfig.label} - ${relevancePercent}%`}
                  placement="top"
                >
                  <div className="flex-shrink-0 text-right">
                    <div
                      className={`
                        inline-flex items-center gap-1 px-2 py-1 rounded-lg
                        ${relevanceConfig.bgColor}
                      `}
                    >
                      <span
                        className={`text-xs font-bold ${relevanceConfig.color}`}
                      >
                        {relevancePercent}%
                      </span>
                    </div>
                    {/* 相关性进度条 */}
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${relevanceConfig.barColor} transition-all duration-500`}
                        style={{ width: `${relevancePercent}%` }}
                      />
                    </div>
                  </div>
                </Tooltip>
              )}
            </div>
          </div>
        </div>

        {/* 摘要内容 */}
        <div className="mt-3 ml-13">
          <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-2 pl-[52px]">
            {citation.content}
          </p>
        </div>

        {/* 来源链接 */}
        {citation.source && (
          <div className="mt-3 pl-[52px]">
            <a
              href={citation.source}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                bg-slate-50 hover:bg-slate-100
                text-xs text-slate-600 hover:text-slate-800
                border border-slate-200 hover:border-slate-300
                transition-all duration-200
                group/link
              `}
            >
              <LinkOutlined className="text-slate-400 group-hover/link:text-indigo-500 transition-colors" />
              <span className="truncate max-w-[220px] font-medium">
                {citation.source.replace(/^https?:\/\//, '').split('/')[0]}
              </span>
              <span className="text-slate-300">→</span>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

interface CitationListProps {
  /** 引用列表 */
  citations: Citation[]
}

export function CitationList({ citations }: CitationListProps) {
  if (!citations || citations.length === 0) {
    return null
  }

  return (
    <div className="mt-4 pt-4 border-t border-slate-200">
      <div className="flex items-center gap-2 mb-3">
        <FileTextOutlined className="text-indigo-500" />
        <span className="text-sm font-medium text-slate-700">
          参考来源 ({citations.length})
        </span>
      </div>
      <div className="space-y-3">
        {citations.map((citation, index) => (
          <CitationCard key={citation.id} citation={citation} index={index} />
        ))}
      </div>
    </div>
  )
}
