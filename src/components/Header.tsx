import { Layout, Menu } from 'antd'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { HomeOutlined, InfoCircleOutlined } from '@ant-design/icons'

const { Header: AntHeader } = Layout

const menuItems = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: '首页',
  },
  {
    key: '/about',
    icon: <InfoCircleOutlined />,
    label: '关于',
  },
]

export function Header() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate({ to: key })
  }

  return (
    <AntHeader className="fixed top-0 left-0 right-0 z-50 flex items-center px-6">
      <div className="text-white text-lg font-bold mr-10">
        Dashboard
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        className="flex-1 min-w-0"
      />
    </AntHeader>
  )
}
