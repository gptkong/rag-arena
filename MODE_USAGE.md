# 项目模式使用说明

本项目支持三种运行模式：**mock 模式**、**dev 模式**和**正式模式**。

## 模式说明

### 1. Mock 模式
- **用途**：使用 mock 数据代替真实接口，用于前端开发和测试
- **特点**：
  - 不发起真实 HTTP 请求
  - 使用本地 mock 数据
  - 不启用 Vite proxy
  - 适合前端独立开发和 UI 测试

### 2. Dev 模式
- **用途**：连接开发环境接口
- **特点**：
  - 通过 Vite proxy 代理到开发服务器
  - 使用相对路径，自动走 proxy
  - 适合与后端开发环境联调

### 3. 正式模式（Production）
- **用途**：打包后部署到正式环境
- **特点**：
  - 使用环境变量配置的正式环境 API 地址
  - 不启用 proxy（生产环境不需要）
  - 适合生产环境部署

## 使用方法

### 启动开发服务器

```bash
# Mock 模式（使用 mock 数据）
npm run dev:mock

# Dev 模式（连接开发环境接口，默认）
npm run dev:dev
# 或简写
npm run dev
```

### 打包

```bash
# 打包为正式环境（使用正式环境 API）
npm run build:prod
# 或简写
npm run build
```

## 环境变量配置

### Mock 模式配置（.env.mock）

```env
VITE_API_MODE=mock
VITE_USE_MOCK=1
VITE_API_BASE_URL=
VITE_DEV_PROXY_TARGET=
```

### Dev 模式配置（.env.dev）

```env
VITE_API_MODE=dev
VITE_USE_MOCK=0
VITE_API_BASE_URL=
VITE_DEV_PROXY_TARGET=http://192.168.157.104:8901
```

### 正式模式配置（.env.production）

```env
VITE_API_MODE=prod
VITE_USE_MOCK=0
VITE_API_BASE_URL=https://api.example.com
VITE_DEV_PROXY_TARGET=
```

> **注意**：正式环境的 `VITE_API_BASE_URL` 需要根据实际部署环境修改。

## 环境变量说明

| 变量名 | 说明 | 可选值 |
|--------|------|--------|
| `VITE_API_MODE` | API 模式 | `mock` / `dev` / `prod` |
| `VITE_USE_MOCK` | 是否使用 mock 数据 | `1` / `0` 或 `true` / `false` |
| `VITE_API_BASE_URL` | API 基础地址 | 正式环境需要配置完整 URL |
| `VITE_DEV_PROXY_TARGET` | 开发服务器代理目标 | Dev 模式需要配置 |

## 工作原理

1. **模式判断**：通过 `VITE_API_MODE` 或 `VITE_USE_MOCK` 环境变量判断当前模式
2. **请求处理**：
   - Mock 模式：服务层直接返回 mock 数据，不发起 HTTP 请求
   - Dev 模式：使用相对路径，通过 Vite proxy 转发到开发服务器
   - 正式模式：使用 `VITE_API_BASE_URL` 配置的完整 API 地址
3. **Proxy 配置**：只在 Dev 模式下启用 Vite proxy

## 切换模式

### 开发时切换

修改对应的 `.env.*` 文件，或使用不同的启动命令：

```bash
# 使用 mock 模式
npm run dev:mock

# 使用 dev 模式
npm run dev:dev
```

### 打包时切换

修改 `.env.production` 文件中的 `VITE_API_BASE_URL`，然后执行：

```bash
npm run build:prod
```

## 注意事项

1. **环境变量优先级**：
   - `VITE_USE_MOCK` 明确设置时，优先使用该值
   - 否则根据 `VITE_API_MODE` 判断

2. **Mock 数据**：
   - Mock 数据位于 `src/data/mock/` 目录
   - 可以根据需要修改 mock 数据以匹配测试场景

3. **接口对接**：
   - 新增接口时，需要在 `src/services/arena.ts` 中添加模式判断
   - 使用 `shouldUseMock()` 函数判断是否使用 mock 数据

4. **调试**：
   - 控制台会输出当前 API 模式和 baseURL，方便调试
   - 格式：`[Request] API Mode: {mode}, baseURL: {url}`
