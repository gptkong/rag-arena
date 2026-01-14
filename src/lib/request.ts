/**
 * HTTP 请求工具
 * 
 * 当前为 Mock 模式，此模块暂未使用
 * 后续对接真实接口时启用
 * 
 * @example
 * ```ts
 * import { get, post } from '@/lib/request'
 * 
 * // GET 请求
 * const data = await get<UserData>('/api/user/1')
 * 
 * // POST 请求
 * const result = await post<Response>('/api/user', { name: 'test' })
 * ```
 */

import axios, { type AxiosRequestConfig } from 'axios'

// 开发环境强制使用相对路径，确保走 Vite proxy
// 生产环境可以通过环境变量配置绝对路径
const getBaseURL = () => {
  const envURL = import.meta.env.VITE_API_BASE_URL
  // 开发环境（dev）强制使用相对路径，走 proxy
  if (import.meta.env.DEV) {
    return ''
  }
  // 生产环境使用环境变量配置的 URL，如果没有则使用相对路径
  return envURL || ''
}

const request = axios.create({
  baseURL: getBaseURL(),
  // AI 回答可能需要较长时间，设置 60 秒超时
  timeout: 60000,
})

// 开发环境下打印 baseURL，方便调试
if (import.meta.env.DEV) {
  console.log('[Request] baseURL:', request.defaults.baseURL || '(empty, will use relative path)')
}

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  (res) => res.data,
  (error) => {
    const message = error.response?.data?.message || error.message
    return Promise.reject(new Error(message))
  }
)

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return request.get(url, config)
}

export async function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return request.post(url, data, config)
}

export async function put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return request.put(url, data, config)
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return request.delete(url, config)
}

export default request
