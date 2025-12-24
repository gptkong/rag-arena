# 数据模型

## 概述
本项目当前以前端状态与类型定义为主，数据模型主要用于：
1) UI 展示与交互（问题、答案、引用、投票）
2) 服务层请求/响应的结构约定
3) 状态持久化（例如 `app-store`）

---

## 核心类型（前端领域模型）

### 通用响应
- **`ApiResponse<T>`:** 通用响应包装（见 `src/types/index.ts`）
- **`PaginatedData<T>` / `PaginationParams`:** 分页相关结构（如未来需要列表数据）

### 用户
- **`User`:** 用户信息（当前用于前端占位/扩展）

### Arena 域
- **`Citation`:** 引用信息（来源、片段等）
- **`Answer`:** 单条答案（包含内容与引用等）
- **`ArenaResponse`:** Arena 提问返回结构
- **`VoteRequest` / `VoteResponse`:** 投票请求/响应
- **`StatsResponse`:** 统计返回结构（键值映射）

---

## 本地存储
- **localStorage:**
  - `token`: 请求层读取的认证令牌（如存在）
  - `app-store`: `src/stores/app.ts` 中持久化的应用状态
  - `arena-session-store`: `src/stores/arena.ts` 中持久化的 Arena 会话历史
    - 主要字段: `sessions[]`（问题/回答/投票结果）与 `activeSessionId`
    - 约束: 会话数量上限（例如 50），避免无限增长
