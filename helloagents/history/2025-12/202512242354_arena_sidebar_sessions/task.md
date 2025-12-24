# 任务清单: Arena 侧边栏历史会话列表

目录: `helloagents/history/2025-12/202512242354_arena_sidebar_sessions/`

---

## 1. stores（会话状态与持久化）
- [√] 1.1 在 `src/stores/arena.ts` 中引入会话模型与 `persist`，实现 `sessions + activeSessionId`，并提供新建/切换/删除会话动作
- [√] 1.2 在 `src/stores/arena.ts` 中将流式写入与投票状态写入绑定到 active session（append/finalize/error/vote）
- [√] 1.3 在 `src/stores/arena.ts` 中加入最大会话数限制与空状态自愈（确保至少存在 1 个会话）

## 2. components（侧边栏 UI）
- [√] 2.1 新增 `src/components/arena/SessionSidebar.tsx`，使用 `@ant-design/x` 的 `Conversations` 渲染历史会话列表
- [√] 2.2 在 `src/components/arena/index.ts` 中导出 `SessionSidebar`

## 3. routes（页面集成）
- [√] 3.1 在 `src/routes/index.tsx` 集成侧边栏布局（桌面侧边栏 + 移动端可选抽屉），并联动 store 的会话切换
- [√] 3.2 确保 `QuestionInput` 在会话切换时不残留输入状态（使用 `key={activeSessionId}` 或改为受控）

## 4. 安全检查
- [√] 4.1 执行安全检查（按G9: 避免敏感信息落盘、避免跨会话串写、删除/切换逻辑安全）

## 5. 文档更新（知识库同步）
- [√] 5.1 更新 `helloagents/wiki/modules/arena.md`（新增规范/场景与变更历史）
- [√] 5.2 更新 `helloagents/wiki/modules/components.md`、`helloagents/wiki/modules/stores.md`（补充新能力说明）
- [√] 5.3 更新 `helloagents/wiki/data.md`（补充 localStorage key 与结构说明）
- [√] 5.4 更新 `helloagents/CHANGELOG.md`、`helloagents/project.md`

## 6. 质量检查
- [√] 6.1 运行 `npm run lint`（阻断性）
- [X] 6.2 运行 `npm run build`（阻断性）
  > 备注: 当前运行环境为 Node.js 16.10.0，Vite 要求 Node.js 20+，构建无法在该环境执行；已通过 `tsc -b` 完成 TypeScript 编译验证
