import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Layout } from 'antd'
import { Header } from '../components/Header'
import type { QueryClient } from '@tanstack/react-query'

const { Content } = Layout

export interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <Layout className="min-h-screen">
      <Header />
      <Content className="mt-16 p-6 bg-gray-100 min-h-[calc(100vh-64px)]">
        <Outlet />
      </Content>
      <ReactQueryDevtools buttonPosition="bottom-left" />
      <TanStackRouterDevtools position="bottom-right" />
    </Layout>
  )
}
