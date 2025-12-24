# 项目技术约定

---

## 技术栈
- **运行时:** Node.js 20.19+（或 22.12+，用于 Vite 构建）
- **语言:** TypeScript
- **前端:** React + Vite
- **路由:** TanStack Router（文件路由生成 `routeTree.gen.ts`）
- **服务端状态:** TanStack React Query
- **本地状态:** Zustand（`app-store` 持久化）
- **UI:** Ant Design / @ant-design/x（含 Markdown 渲染相关组件）
- **样式:** Tailwind CSS + PostCSS
- **网络请求:** axios（封装于 `src/lib/request.ts`）
- **编辑器/富文本:** Tiptap / Slate（按需使用）

---

## 开发约定
- **代码规范:** ESLint（项目根目录 `eslint.config.js`）
- **命名约定:**
  - 文件/目录：与现有结构保持一致（`src/routes`、`src/services`、`src/stores`）
  - React 组件：PascalCase
  - 函数/变量：camelCase
- **模块边界:**
  - UI 组件放在 `src/components`
  - 业务服务放在 `src/services`
  - 状态管理放在 `src/stores`
  - 可复用工具放在 `src/lib`

---

## 错误与日志
- **策略:** 服务层返回统一响应结构（见 `src/types/index.ts`），UI 层进行用户提示与降级展示
- **日志:** 开发期使用浏览器控制台；生产期建议引入统一日志/监控（当前未内置）

---

## 测试与流程
- **测试:** 当前仓库未配置自动化测试；如新增关键逻辑，建议补齐最小可复现用例与回归清单
- **脚本:**
  - `dev`: 本地开发（Vite）
  - `build`: TypeScript 构建 + Vite 打包
  - `lint`: ESLint 全量检查
  - `preview`: 产物预览
