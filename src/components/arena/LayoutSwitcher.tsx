// LayoutSwitcher - 布局切换组件

import { Segmented } from 'antd'
import {
  AppstoreOutlined,
  TableOutlined,
  UnorderedListOutlined,
  FolderOutlined,
} from '@ant-design/icons'

export type LayoutMode = 'four-col' | 'two-col' | 'one-col' | 'tabs'

interface LayoutSwitcherProps {
  value: LayoutMode
  onChange: (mode: LayoutMode) => void
}

const layoutOptions = [
  {
    value: 'four-col' as const,
    icon: <AppstoreOutlined />,
    label: '4列',
  },
  {
    value: 'two-col' as const,
    icon: <TableOutlined />,
    label: '2列',
  },
  {
    value: 'one-col' as const,
    icon: <UnorderedListOutlined />,
    label: '1列',
  },
  {
    value: 'tabs' as const,
    icon: <FolderOutlined />,
    label: 'Tabs',
  },
]

export function LayoutSwitcher({ value, onChange }: LayoutSwitcherProps) {
  return (
    <Segmented
      value={value}
      onChange={(val) => onChange(val as LayoutMode)}
      options={layoutOptions.map((opt) => ({
        value: opt.value,
        icon: opt.icon,
        label: opt.label,
      }))}
    />
  )
}
