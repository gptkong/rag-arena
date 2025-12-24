# API 手册

## 概述
本项目当前以“前端应用 + 内部服务层”为主，未提供对外稳定的后端 HTTP API。本文档将“内部服务接口”作为 API 进行约定，便于未来对接真实后端或替换数据源。

---

## 认证方式
- **当前实现:** `src/lib/request.ts` 从 `localStorage` 读取 `token`，并在请求中附带（具体 Header 以实现为准）
- **建议约定:** Bearer Token（`Authorization: Bearer <token>`）

---

## 接口列表

### lib/request（基础请求封装）

#### `get`
**描述:** 发起 GET 请求（axios 封装）

#### `post`
**描述:** 发起 POST 请求（axios 封装）

#### `put`
**描述:** 发起 PUT 请求（axios 封装）

#### `del`
**描述:** 发起 DELETE 请求（axios 封装）

---

### services/api（用户相关）

#### `userApi`
**描述:** 用户域 API 聚合对象（具体子接口随实现演进）

---

### services/arena（RAG Arena 示例域）

#### `submitQuestion`
**描述:** 提交问题并获取答案（非流式）

#### `submitQuestionStream`
**描述:** 提交问题并以流式方式接收答案（`text/event-stream`）

#### `submitVote`
**描述:** 提交投票（用于答案对比/偏好反馈）

#### `getStats`
**描述:** 获取统计信息（例如投票统计/模型得分等）

#### `arenaApi`
**描述:** Arena 域 API 聚合对象

