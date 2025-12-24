# Dashboard Framework

> 本文件包含项目级别的核心信息。详细的模块文档见 `modules/` 目录。

---

## 1. 项目概述

### 目标与背景
本项目是一个基于 Vite + React + TypeScript 的仪表盘框架（Dashboard Framework），内置一组可复用的 UI/状态/路由基础设施，并包含一个“RAG Arena”示例模块，用于演示提问、答案展示、引用信息与投票统计等交互。

### 范围
- **范围内:** 前端路由与页面框架、组件库集成、服务层封装、状态管理、RAG Arena 示例交互
- **范围外:** 生产级后端 API、账号体系与权限系统、真实向量检索/索引构建（当前仅示例/占位）

### 干系人
- **负责人:** 项目维护者/团队（未在仓库内显式声明）

---

## 2. 模块索引

| 模块名称 | 职责 | 状态 | 文档 |
|---------|------|------|------|
| app | 应用入口、全局 Provider 与样式 | 🚧开发中 | [modules/app.md](modules/app.md) |
| routes | 路由与布局壳（TanStack Router） | 🚧开发中 | [modules/routes.md](modules/routes.md) |
| components | 通用 UI 组件与 Arena 组件 | 🚧开发中 | [modules/components.md](modules/components.md) |
| services | 业务服务层与数据获取（含流式） | 🚧开发中 | [modules/services.md](modules/services.md) |
| stores | 全局/业务状态（Zustand） | 🚧开发中 | [modules/stores.md](modules/stores.md) |
| lib | 通用工具：请求、存储、SSE 等 | 🚧开发中 | [modules/lib.md](modules/lib.md) |
| hooks | 组合式 Hooks 聚合/封装 | 🚧开发中 | [modules/hooks.md](modules/hooks.md) |
| types | 领域模型与通用类型 | 🚧开发中 | [modules/types.md](modules/types.md) |
| arena | RAG Arena 示例业务功能 | 🚧开发中 | [modules/arena.md](modules/arena.md) |

---

## 3. 快速链接
- [技术约定](../project.md)
- [架构设计](arch.md)
- [API 手册](api.md)
- [数据模型](data.md)
- [变更历史](../history/index.md)

