# services

## 目的
提供业务服务层，隔离 UI 与具体的数据获取方式（一次性/流式）。

## 模块概述
- **职责:** Arena 域请求、用户域请求、对外接口适配与演进
- **状态:** 🚧开发中
- **最后更新:** 2025-12-24

## 规范

### 需求: Arena 服务接口
**模块:** services
对 UI 提供稳定的函数级 API（`submitQuestion`、`submitQuestionStream`、`submitVote`、`getStats`）。

#### 场景: 流式回答
当 UI 选择流式模式时，服务层以 `text/event-stream` 接收并增量产出答案。
- 网络异常可感知并上报到 UI
- 流式结束后收敛为最终答案结构

## API接口
### submitQuestion
**描述:** 非流式提问接口（函数级）
**输入/输出:** 以 `src/types/arena.ts` 为准

### submitQuestionStream
**描述:** 流式提问接口（函数级）
**输入/输出:** 以 `src/types/arena.ts` 为准

### submitVote
**描述:** 投票提交接口（函数级）
**输入/输出:** 以 `VoteRequest` / `VoteResponse` 为准

### getStats
**描述:** 统计获取接口（函数级）
**输入/输出:** 以 `StatsResponse` 为准

## 依赖
- lib
- types

