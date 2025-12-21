// Arena API - RAG 问答竞技场接口服务

import { get, post } from '@/lib/request'
import type { ArenaResponse, VoteRequest, VoteResponse, StatsResponse } from '@/types/arena'
import type { DateRange } from '@/components/arena'

// 模拟模式开关 - 设为 true 使用模拟数据，false 调用真实 API
const USE_MOCK = true

// 模拟延迟 (ms)
const MOCK_DELAY = 1500

import type { Citation } from '@/types/arena'

/**
 * 生成模拟引用摘要数据
 */
function generateMockCitations(prefix: string): Citation[] {
  const citationTemplates: Citation[][] = [
    // 模型 A 的引用 - 技术文档风格
    [
      {
        id: `${prefix}_c1`,
        title: 'RAG 系统架构设计指南',
        content: '检索增强生成（RAG）是一种结合了信息检索和文本生成的混合架构，通过从外部知识库检索相关文档来增强语言模型的生成能力，有效解决了大模型的幻觉问题。',
        source: 'https://docs.example.com/rag-architecture',
        relevanceScore: 0.95,
        location: '第 3 章 - 核心架构',
        docType: 'webpage',
      },
      {
        id: `${prefix}_c2`,
        title: '向量数据库性能优化白皮书.pdf',
        content: '在大规模向量检索场景中，HNSW 算法相比传统的暴力搜索可以将查询延迟从 O(n) 降低到 O(log n)，同时保持 95% 以上的召回率。',
        source: 'https://papers.example.com/vector-db-optimization.pdf',
        relevanceScore: 0.87,
        location: '第 12 页',
        docType: 'pdf',
      },
      {
        id: `${prefix}_c3`,
        title: '知识图谱构建最佳实践',
        content: '结合 RAG 和知识图谱可以提供更精确的语义理解，知识图谱的实体关系能够帮助模型更好地理解查询意图。',
        relevanceScore: 0.72,
        docType: 'database',
      },
    ],
    // 模型 B 的引用 - 学术论文风格
    [
      {
        id: `${prefix}_c1`,
        title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
        content: 'We propose RAG models where the parametric memory is a pre-trained seq2seq model and the non-parametric memory is a dense vector index of Wikipedia, accessed with a pre-trained neural retriever.',
        source: 'https://arxiv.org/abs/2005.11401',
        relevanceScore: 0.92,
        location: 'Abstract',
        docType: 'pdf',
      },
      {
        id: `${prefix}_c2`,
        title: 'Dense Passage Retrieval for Open-Domain QA',
        content: '密集向量检索在开放域问答任务中显著优于传统的 BM25 稀疏检索方法，Top-20 检索准确率提升了 9-19 个百分点。',
        source: 'https://aclanthology.org/2020.emnlp-main.550/',
        relevanceScore: 0.85,
        location: 'Section 4.2 - Experimental Results',
        docType: 'pdf',
      },
    ],
    // 模型 C 的引用 - 内部文档风格
    [
      {
        id: `${prefix}_c1`,
        title: '企业知识库接入指南 v2.3',
        content: '本文档描述了如何将企业内部知识库与 RAG 系统集成，包括数据预处理、向量化配置、检索策略等关键步骤。',
        relevanceScore: 0.88,
        location: '技术规范 - 第 5 节',
        docType: 'file',
      },
      {
        id: `${prefix}_c2`,
        title: '产品 FAQ 数据库',
        content: '基于用户反馈和客服记录整理的常见问题解答，覆盖产品使用、故障排查、功能介绍等多个维度共计 2,847 条记录。',
        source: 'internal://knowledge-base/faq',
        relevanceScore: 0.79,
        docType: 'database',
      },
      {
        id: `${prefix}_c3`,
        title: 'API 文档 - 检索服务',
        content: 'POST /api/v1/search 接口支持语义检索和关键词检索的混合模式，可通过 hybrid_weight 参数调整两者的权重比例。',
        source: 'https://api.example.com/docs/search',
        relevanceScore: 0.68,
        location: 'API Reference',
        docType: 'api',
      },
      {
        id: `${prefix}_c4`,
        title: '系统运维手册',
        content: '推荐的硬件配置：CPU 16核+，内存 64GB+，SSD 存储 500GB+。对于百万级向量库，建议使用 GPU 加速检索。',
        relevanceScore: 0.55,
        docType: 'file',
      },
    ],
    // 模型 D 的引用 - 混合风格
    [
      {
        id: `${prefix}_c1`,
        title: 'LangChain RAG 实战教程',
        content: 'LangChain 提供了完整的 RAG 工具链，包括文档加载器、文本分割器、向量存储、检索器等组件，支持快速构建生产级 RAG 应用。',
        source: 'https://python.langchain.com/docs/tutorials/rag/',
        relevanceScore: 0.91,
        docType: 'webpage',
      },
      {
        id: `${prefix}_c2`,
        title: '大模型应用开发实战.pdf',
        content: '第8章详细介绍了 RAG 系统的评估方法，包括检索质量评估（召回率、精确率）和生成质量评估（BLEU、ROUGE、人工评价）。',
        source: 'https://books.example.com/llm-app-dev.pdf',
        relevanceScore: 0.83,
        location: '第 8 章第 3 节',
        docType: 'pdf',
      },
    ],
  ]

  // 随机选择一组引用
  const index = Math.floor(Math.random() * citationTemplates.length)
  return citationTemplates[index].map((c, i) => ({
    ...c,
    id: `${prefix}_c${i + 1}`,
  }))
}

/**
 * 生成模拟回答数据
 */
function generateMockAnswers(question: string): ArenaResponse {
  const questionId = `q_${Date.now()}`

  const mockAnswers = [
    {
      id: `${questionId}_a`,
      providerId: 'A',
      content: `## 模型 A 的回答

针对您的问题「${question}」，我的分析如下：

1. **核心观点**：这是一个很好的问题，需要从多个角度来分析。[1]
2. **详细解释**：根据我的知识库，这个问题涉及到以下几个方面...[2]
3. **建议**：建议您可以进一步了解相关领域的最新研究。[3]

\`\`\`python
# 示例代码
def example():
    return "Hello from Model A"
\`\`\`

希望这个回答对您有帮助！`,
      citations: generateMockCitations(`${questionId}_a`),
    },
    {
      id: `${questionId}_b`,
      providerId: 'B',
      content: `## 模型 B 的回答

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

这是我的看法，供您参考。`,
      citations: generateMockCitations(`${questionId}_b`),
    },
    {
      id: `${questionId}_c`,
      providerId: 'C',
      content: `## 模型 C 的回答

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

如有疑问，欢迎继续探讨！`,
      citations: generateMockCitations(`${questionId}_c`),
    },
    {
      id: `${questionId}_d`,
      providerId: 'D',
      content: `## 模型 D 的回答

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
*以上是我的分析，希望能够帮到您。*`,
      citations: generateMockCitations(`${questionId}_d`),
    },
  ]

  return {
    questionId,
    question,
    answers: mockAnswers,
  }
}

/**
 * 提交问题，获取 4 个匿名回答
 * @param question 用户问题
 * @param dateRange 可选的时间范围
 * @returns 竞技场回答响应
 */
export async function submitQuestion(question: string, dateRange?: DateRange): Promise<ArenaResponse> {
  if (USE_MOCK) {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY))
    return generateMockAnswers(question)
  }

  const payload: Record<string, unknown> = { question }
  if (dateRange && dateRange[0] && dateRange[1]) {
    payload.startDate = dateRange[0].toISOString()
    payload.endDate = dateRange[1].toISOString()
  }

  return post<ArenaResponse>('/arena/ask', payload)
}

/**
 * 提交点赞
 * @param request 点赞请求
 * @returns 点赞响应
 */
export async function submitVote(request: VoteRequest): Promise<VoteResponse> {
  if (USE_MOCK) {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log('Mock vote:', request)
    return { success: true }
  }
  return post<VoteResponse>('/arena/vote', request)
}

/**
 * 获取投票统计数据
 * @returns 统计数据响应
 */
export async function getStats(): Promise<StatsResponse> {
  if (USE_MOCK) {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 300))
    return {
      openai: 15,
      deepseek: 12,
      claude: 8,
      gemini: 5,
    }
  }
  return get<StatsResponse>('/arena/stats')
}

export const arenaApi = {
  submitQuestion,
  submitVote,
  getStats,
}
