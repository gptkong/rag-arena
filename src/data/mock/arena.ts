/**
 * Arena Mock 数据
 * 用于前端开发阶段的模拟数据，后续对接真实接口时可替换
 */

import type { Answer, Citation, ArenaResponse, VoteResponse, StatsResponse } from '@/types/arena'

// ============================================================================
// Mock 配置
// ============================================================================

/** 模拟网络延迟配置 (毫秒) */
export const MOCK_DELAY = {
  /** 提问请求延迟 */
  question: 1500,
  /** 投票请求延迟 */
  vote: 500,
  /** 统计请求延迟 */
  stats: 300,
  /** SSE 流式响应初始延迟 */
  streamInit: 200,
}

// ============================================================================
// 引用数据模板
// ============================================================================

/** 技术文档风格引用 */
const TECH_DOC_CITATIONS: Omit<Citation, 'id'>[] = [
  {
    title: 'RAG 系统架构设计指南',
    content: '检索增强生成（RAG）是一种结合了信息检索和文本生成的混合架构，通过从外部知识库检索相关文档来增强语言模型的生成能力，有效解决了大模型的幻觉问题。',
    source: 'https://docs.example.com/rag-architecture',
    relevanceScore: 0.95,
    location: '第 3 章 - 核心架构',
    docType: 'webpage',
  },
  {
    title: '向量数据库性能优化白皮书.pdf',
    content: '在大规模向量检索场景中，HNSW 算法相比传统的暴力搜索可以将查询延迟从 O(n) 降低到 O(log n)，同时保持 95% 以上的召回率。',
    source: 'https://papers.example.com/vector-db-optimization.pdf',
    relevanceScore: 0.87,
    location: '第 12 页',
    docType: 'pdf',
  },
  {
    title: '知识图谱构建最佳实践',
    content: '结合 RAG 和知识图谱可以提供更精确的语义理解，知识图谱的实体关系能够帮助模型更好地理解查询意图。',
    relevanceScore: 0.72,
    docType: 'database',
  },
]

/** 学术论文风格引用 */
const ACADEMIC_CITATIONS: Omit<Citation, 'id'>[] = [
  {
    title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
    content: 'We propose RAG models where the parametric memory is a pre-trained seq2seq model and the non-parametric memory is a dense vector index of Wikipedia, accessed with a pre-trained neural retriever.',
    source: 'https://arxiv.org/abs/2005.11401',
    relevanceScore: 0.92,
    location: 'Abstract',
    docType: 'pdf',
  },
  {
    title: 'Dense Passage Retrieval for Open-Domain QA',
    content: '密集向量检索在开放域问答任务中显著优于传统的 BM25 稀疏检索方法，Top-20 检索准确率提升了 9-19 个百分点。',
    source: 'https://aclanthology.org/2020.emnlp-main.550/',
    relevanceScore: 0.85,
    location: 'Section 4.2 - Experimental Results',
    docType: 'pdf',
  },
]

/** 内部文档风格引用 */
const INTERNAL_DOC_CITATIONS: Omit<Citation, 'id'>[] = [
  {
    title: '企业知识库接入指南 v2.3',
    content: '本文档描述了如何将企业内部知识库与 RAG 系统集成，包括数据预处理、向量化配置、检索策略等关键步骤。',
    relevanceScore: 0.88,
    location: '技术规范 - 第 5 节',
    docType: 'file',
  },
  {
    title: '产品 FAQ 数据库',
    content: '基于用户反馈和客服记录整理的常见问题解答，覆盖产品使用、故障排查、功能介绍等多个维度共计 2,847 条记录。',
    source: 'internal://knowledge-base/faq',
    relevanceScore: 0.79,
    docType: 'database',
  },
  {
    title: 'API 文档 - 检索服务',
    content: 'POST /api/v1/search 接口支持语义检索和关键词检索的混合模式，可通过 hybrid_weight 参数调整两者的权重比例。',
    source: 'https://api.example.com/docs/search',
    relevanceScore: 0.68,
    location: 'API Reference',
    docType: 'api',
  },
  {
    title: '系统运维手册',
    content: '推荐的硬件配置：CPU 16核+，内存 64GB+，SSD 存储 500GB+。对于百万级向量库，建议使用 GPU 加速检索。',
    relevanceScore: 0.55,
    docType: 'file',
  },
]

/** 混合风格引用 */
const MIXED_CITATIONS: Omit<Citation, 'id'>[] = [
  {
    title: 'LangChain RAG 实战教程',
    content: 'LangChain 提供了完整的 RAG 工具链，包括文档加载器、文本分割器、向量存储、检索器等组件，支持快速构建生产级 RAG 应用。',
    source: 'https://python.langchain.com/docs/tutorials/rag/',
    relevanceScore: 0.91,
    docType: 'webpage',
  },
  {
    title: '大模型应用开发实战.pdf',
    content: '第8章详细介绍了 RAG 系统的评估方法，包括检索质量评估（召回率、精确率）和生成质量评估（BLEU、ROUGE、人工评价）。',
    source: 'https://books.example.com/llm-app-dev.pdf',
    relevanceScore: 0.83,
    location: '第 8 章第 3 节',
    docType: 'pdf',
  },
]

/** 所有引用模板集合 */
const CITATION_TEMPLATES = [
  TECH_DOC_CITATIONS,
  ACADEMIC_CITATIONS,
  INTERNAL_DOC_CITATIONS,
  MIXED_CITATIONS,
]

// ============================================================================
// 回答模板
// ============================================================================

/** 回答模板生成函数类型 */
type AnswerTemplateGenerator = (question: string) => string

/** 模型 A 回答模板 */
const MODEL_A_TEMPLATE: AnswerTemplateGenerator = (question) => `## 模型 A 的回答

针对您的问题「${question}」，我的分析如下：

1. **核心观点**：这是一个很好的问题，需要从多个角度来分析。[1]
2. **详细解释**：根据我的知识库，这个问题涉及到以下几个方面...[2]
3. **建议**：建议您可以进一步了解相关领域的最新研究。[3]

\`\`\`python
# 示例代码
def example():
    return "Hello from Model A"
\`\`\`

希望这个回答对您有帮助！`

/** 模型 B 回答模板 */
const MODEL_B_TEMPLATE: AnswerTemplateGenerator = (question) => `## 模型 B 的回答

关于「${question}」这个问题：

我认为可以从以下几点来理解：

- **第一点**：基础概念的理解非常重要 [1]
- **第二点**：实践经验同样不可或缺
- **第三点**：持续学习是关键 [2]

> 引用：知识就是力量。

| 维度 | 说明 |
|------|------|
| 理论 | 扎实的理论基础 |
| 实践 | 丰富的实战经验 |

这是我的看法，供您参考。`

/** 模型 C 回答模板 */
const MODEL_C_TEMPLATE: AnswerTemplateGenerator = (question) => `## 模型 C 的回答

您好！针对「${question}」，我来分享一下我的见解：

### 背景分析
这个问题在当前环境下非常有意义，因为... [1][2]

### 解决方案
1. 首先，我们需要明确目标 [3]
2. 其次，制定详细的计划
3. 最后，执行并持续优化 [4]

### 代码示例
\`\`\`javascript
const solution = {
  step1: "分析问题",
  step2: "设计方案",
  step3: "实施执行"
};
\`\`\`

如有疑问，欢迎继续探讨！`

/** 模型 D 回答模板 */
const MODEL_D_TEMPLATE: AnswerTemplateGenerator = (question) => `## 模型 D 的回答

**问题**：${question}

**简短回答**：这是一个值得深入探讨的话题。[1]

**详细分析**：

从技术角度来看，这个问题可以分解为几个子问题：

1. 🎯 **目标定义** - 明确我们要解决什么
2. 🔍 **现状分析** - 了解当前的情况 [2]
3. 💡 **方案设计** - 提出可行的解决方案
4. ✅ **验证测试** - 确保方案有效

**总结**：综合以上分析，我建议采取循序渐进的方式来处理这个问题。

---
*以上是我的分析，希望能够帮到您。*`

/** 所有回答模板 */
const ANSWER_TEMPLATES = [
  { providerId: 'A', template: MODEL_A_TEMPLATE },
  { providerId: 'B', template: MODEL_B_TEMPLATE },
  { providerId: 'C', template: MODEL_C_TEMPLATE },
  { providerId: 'D', template: MODEL_D_TEMPLATE },
]

// ============================================================================
// Mock 数据生成器
// ============================================================================

/**
 * 生成唯一 ID
 */
function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

/**
 * 生成模拟引用数据
 * @param prefix ID 前缀
 * @returns 引用列表
 */
export function generateMockCitations(prefix: string): Citation[] {
  const templateIndex = Math.floor(Math.random() * CITATION_TEMPLATES.length)
  const template = CITATION_TEMPLATES[templateIndex]
  
  return template.map((citation, index) => ({
    ...citation,
    id: `${prefix}_c${index + 1}`,
  }))
}

/**
 * 生成单个模拟回答
 * @param questionId 问题 ID
 * @param providerId 供应商 ID
 * @param question 问题内容
 * @param template 回答模板生成器
 * @returns 回答对象
 */
export function generateMockAnswer(
  questionId: string,
  providerId: string,
  question: string,
  template: AnswerTemplateGenerator,
): Answer {
  const answerId = `${questionId}_${providerId.toLowerCase()}`
  return {
    id: answerId,
    providerId,
    content: template(question),
    citations: generateMockCitations(answerId),
  }
}

/**
 * 生成完整的模拟回答响应
 * @param question 用户问题
 * @returns ArenaResponse 对象
 */
export function generateMockArenaResponse(question: string): ArenaResponse {
  const questionId = generateId('q')
  
  const answers: Answer[] = ANSWER_TEMPLATES.map(({ providerId, template }) =>
    generateMockAnswer(questionId, providerId, question, template)
  )

  return {
    questionId,
    question,
    answers,
  }
}

/**
 * 生成模拟投票响应
 * @returns VoteResponse 对象
 */
export function generateMockVoteResponse(): VoteResponse {
  return { success: true }
}

/**
 * 生成模拟统计数据
 * @returns StatsResponse 对象
 */
export function generateMockStatsResponse(): StatsResponse {
  return {
    openai: Math.floor(Math.random() * 20) + 10,
    deepseek: Math.floor(Math.random() * 15) + 8,
    claude: Math.floor(Math.random() * 12) + 5,
    gemini: Math.floor(Math.random() * 10) + 3,
  }
}

// ============================================================================
// Mock 工具函数
// ============================================================================

/**
 * 模拟网络延迟
 * @param ms 延迟毫秒数
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 将文本分割为 chunks，用于模拟流式输出
 * @param text 原始文本
 * @param chunkSize 每个 chunk 的大小
 * @returns chunk 数组
 */
export function splitTextToChunks(text: string, chunkSize: number = 64): string[] {
  return text.match(new RegExp(`.{1,${chunkSize}}`, 'gs')) ?? []
}

