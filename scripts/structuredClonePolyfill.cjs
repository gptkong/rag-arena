// structuredClonePolyfill - 为旧版 Node 提供 structuredClone（供 ESLint 运行时使用）

if (typeof globalThis.structuredClone !== 'function') {
  // 使用 v8 序列化实现深拷贝，覆盖 ESLint 对 structuredClone 的依赖
  // 参考：Node 内置模块，无需额外依赖
  const v8 = require('node:v8')
  globalThis.structuredClone = (value) => v8.deserialize(v8.serialize(value))
}

// Node 旧版本缺少 AbortSignal#throwIfAborted（ESLint 9 依赖）
if (
  typeof globalThis.AbortSignal !== 'undefined' &&
  typeof globalThis.AbortSignal.prototype.throwIfAborted !== 'function'
) {
  globalThis.AbortSignal.prototype.throwIfAborted = function throwIfAborted() {
    if (this.aborted) {
      const error = new Error('The operation was aborted')
      error.name = 'AbortError'
      throw error
    }
  }
}

// Node 旧版本缺少 util.stripVTControlCharacters（ESLint formatter 依赖）
const util = require('node:util')
if (typeof util.stripVTControlCharacters !== 'function') {
  util.stripVTControlCharacters = (value) => String(value)
}
