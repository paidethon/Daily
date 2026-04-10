# Agent Skills 技能清单

本项目集成了 52 个 Agent 技能，涵盖设计、云服务、开发工具、AI、营销、开发流程等多个领域。

## 目录

- [设计与 UI](#设计与-ui)
- [Azure / Microsoft 云服务](#azure--microsoft-云服务)
- [开发工具与自动化](#开发工具与自动化)
- [AI 与内容生成](#ai-与内容生成)
- [营销与 SEO](#营销与-seo)
- [认证与安全](#认证与安全)
- [开发流程与最佳实践](#开发流程与最佳实践)
- [PUA 系列（AI 效率激励）](#pua-系列ai-效率激励)

---

## 设计与 UI

| 技能 | 说明 | 来源 |
|------|------|------|
| [`adapt`](./adapt/) | 适配不同屏幕尺寸、设备和平台的设计方案。处理断点、流式布局和触控热区，适用于响应式设计场景。 | `pbakaus/impeccable` |
| [`audit`](./audit/) | 对无障碍性、性能、主题、响应式设计和反模式进行技术质量审查，生成带有 P0–P3 严重等级的评分报告和改进计划。 | `pbakaus/impeccable` |
| [`normalize`](./normalize/) | 审查并矫正 UI，使其重新对齐设计系统的间距、Token 和样式规范。适用于风格漂移或样式不一致的修复。 | `pbakaus/impeccable` |
| [`frontend-design`](./frontend-design/) | 前端设计技能，提供高质量的设计指南和 UI 开发模式，帮助构建生产级界面。 | `anthropics/skills` |
| [`ui-ux-pro-max`](./ui-ux-pro-max/) | 全方位 UI/UX 设计智库：50+ 风格、161 套配色、57 组字体搭配、99 条 UX 准则、25 种图表类型，支持 React、Next.js、Vue、Svelte、SwiftUI 等 10+ 技术栈。 | `nextlevelbuilder/ui-ux-pro-max-skill` |
| [`web-design-guidelines`](./web-design-guidelines/) | 依据 Web 界面设计指南审查 UI 代码，检查无障碍性、交互设计和最佳实践合规性。 | `vercel-labs/agent-skills` |
| [`design-md`](./design-md/) | 分析 Stitch 项目，将语义化设计系统提炼为 DESIGN.md 文件。 | `google-labs-code/stitch-skills` |

## Azure / Microsoft 云服务

| 技能 | 说明 | 来源 |
|------|------|------|
| [`azure-ai`](./azure-ai/) | Azure AI 服务集成：涵盖 AI 搜索、语音识别、文字转语音、OpenAI、文档智能（OCR）及向量/混合检索。 | `microsoft/github-copilot-for-azure` |
| [`azure-aigateway`](./azure-aigateway/) | 将 Azure API Management 配置为 AI 网关，支持语义缓存、Token 限流、内容安全、负载均衡、MCP 限速和越狱检测。 | `microsoft/azure-skills` |
| [`azure-cloud-migrate`](./azure-cloud-migrate/) | 跨云迁移评估与执行，支持 AWS Lambda → Azure Functions 及 GCP Cloud Run → Container Apps，生成迁移报告。 | `microsoft/azure-skills` |
| [`azure-compliance`](./azure-compliance/) | 使用 azqr 执行 Azure 合规与安全审计，覆盖最佳实践评估、资源审查、策略验证和 Key Vault 过期检查。 | `microsoft/azure-skills` |
| [`azure-compute`](./azure-compute/) | Azure 虚拟机与 VMSS 管理：机型推荐、定价查询、自动缩放、编排模式及连接问题排查。 | `microsoft/azure-skills` |
| [`azure-deploy`](./azure-deploy/) | 将应用部署到 Azure，支持 Azure CLI、azd、Bicep、Terraform 和 CI/CD 等多种方式，含部署前检查与故障排查。 | `microsoft/github-copilot-for-azure` |
| [`azure-diagnostics`](./azure-diagnostics/) | Azure 生产环境诊断与排障，涵盖 AKS 集群、Container Apps、Functions 等服务，提供 KQL 查询参考。 | `microsoft/github-copilot-for-azure` |
| [`azure-kusto`](./azure-kusto/) | 使用 KQL 查询和分析 Azure Data Explorer (Kusto/ADX) 数据，适用于日志分析、遥测数据和时序分析场景。 | `microsoft/azure-skills` |
| [`azure-prepare`](./azure-prepare/) | 为 Azure 部署准备应用：生成基础设施 Bicep/Terraform 模板、azure.yaml 和 Dockerfile，适用于新建或现代化改造项目。 | `microsoft/azure-skills` |
| [`azure-quotas`](./azure-quotas/) | 查询和管理 Azure 各服务的配额与用量，用于部署规划、容量验证和区域选择。 | `microsoft/azure-skills` |
| [`azure-resource-lookup`](./azure-resource-lookup/) | 跨订阅和资源组查找、列举 Azure 资源，支持资源清单盘点、标签分析和孤立资源发现。 | `microsoft/azure-skills` |
| [`azure-storage`](./azure-storage/) | Azure 存储服务全家桶：Blob、文件共享、队列、表存储和 Data Lake，含访问层管理和生命周期策略。 | `microsoft/azure-skills` |
| [`appinsights-instrumentation`](./appinsights-instrumentation/) | Azure Application Insights 埋点指南，提供遥测模式、SDK 配置和集成参考文档。 | `microsoft/azure-skills` |
| [`entra-app-registration`](./entra-app-registration/) | Microsoft Entra（Azure AD）应用注册与身份认证，涵盖 OAuth 流程、API 权限配置及 .NET/Java/Python/TypeScript 等多语言 SDK。 | `microsoft/github-copilot-for-azure` |
| [`microsoft-foundry`](./microsoft-foundry/) | Microsoft AI Foundry 平台：创建、部署、评估和监控 AI Agent，支持模型管理、容量规划和 RBAC 权限配置。 | `microsoft/github-copilot-for-azure` |

## 开发工具与自动化

| 技能 | 说明 | 来源 |
|------|------|------|
| [`agent-browser`](./agent-browser/) | AI Agent 浏览器自动化 CLI，通过 CDP 协议控制 Chrome，实现页面导航、表单填写、按钮点击、截图、数据抓取和 Web 应用测试。 | `vercel-labs/agent-browser` |
| [`agent-tools`](./agent-tools/) | 通过 inference.sh CLI 运行 150+ AI 应用：图片生成、视频创作、大模型调用、搜索、3D 建模、Twitter 自动化等，支持 FLUX、Veo、Gemini、Grok、Claude 等模型。 | `tool-belt/skills` |
| [`infsh-cli`](./infsh-cli/) | inference.sh CLI 工具参考，用于在云端运行 AI 应用，涵盖认证、应用发现和命令行用法。 | `tool-belt/skills` |
| [`find-skills`](./find-skills/) | 从开放技能生态中搜索和安装 Agent 技能，当需要某项功能但不确定是否已有现成技能时使用。 | `vercel-labs/skills` |
| [`use-my-browser`](./use-my-browser/) | 复用用户的实时浏览器会话，适用于需要登录态、DevTools 调试、localhost 应用、DOM 检查等依赖浏览器上下文的任务。 | `xixu-me/skills` |

## AI 与内容生成

| 技能 | 说明 | 来源 |
|------|------|------|
| [`ai-image-generation`](./ai-image-generation/) | 通过 inference.sh CLI 调用 FLUX、Gemini、Grok、Seedream、Reve 等 50+ 模型生成 AI 图片，支持文生图、图生图、局部重绘、LoRA 和超分辨率。 | `tool-belt/skills` |
| [`pdf`](./pdf/) | PDF 文件全能处理：提取文本/表格、合并拆分、旋转页面、水印、表单填写、加解密、OCR 识别等。 | `anthropics/skills` |

## 营销与 SEO

| 技能 | 说明 | 来源 |
|------|------|------|
| [`analytics-tracking`](./analytics-tracking/) | 配置和优化数据追踪：GA4、Google Tag Manager、转化追踪、事件埋点、UTM 参数、Mixpanel、Segment 等。 | `coreyhaines31/marketingskills` |
| [`seo-audit`](./seo-audit/) | SEO 全面诊断：审查站点结构、Meta 标签、内容质量、技术 SEO 和性能指标，输出可执行的优化建议。 | `coreyhaines31/marketingskills` |
| [`programmatic-seo`](./programmatic-seo/) | 基于模板和数据批量生成 SEO 优化页面，适用于目录页、地区页、对比页、集成页等规模化 SEO 场景。 | `coreyhaines31/marketingskills` |
| [`audit-website`](./audit-website/) | 使用 squirrelscan CLI 对网站进行全方位审计，覆盖 SEO、性能、安全、技术、内容等 15+ 类别共 230+ 条规则。 | `squirrelscan/skills` |

## 认证与安全

| 技能 | 说明 | 来源 |
|------|------|------|
| [`better-auth-best-practices`](./better-auth-best-practices/) | Better Auth 服务端与客户端配置指南，涵盖数据库适配器、会话管理、插件系统、OAuth 和邮箱密码认证（TypeScript）。 | `better-auth/skills` |

## 开发流程与最佳实践

| 技能 | 说明 | 来源 |
|------|------|------|
| [`brainstorming`](./brainstorming/) | 在编码前进行协作式头脑风暴，通过自然对话探索用户意图、需求和设计方案，确保方向正确再动手。 | `obra/superpowers` |
| [`writing-plans`](./writing-plans/) | 编写结构化的实施计划，将任务拆解为可执行的小步骤，遵循 DRY、YAGNI、TDD 原则，先规划后编码。 | `obra/superpowers` |
| [`executing-plans`](./executing-plans/) | 按照已有实施计划逐步执行，内置审查检查点，加载计划 → 批判性审查 → 执行所有任务 → 完成报告。 | `obra/superpowers` |
| [`subagent-driven-development`](./subagent-driven-development/) | 将实施计划拆分为独立任务，为每个任务派发子 Agent 执行，配合两阶段审查（规格合规 + 代码质量）。 | `obra/superpowers` |
| [`verification-before-completion`](./verification-before-completion/) | 强制要求在声称任务完成前运行验证命令，用实际证据证明结果，杜绝未经验证的完成声明。 | `obra/superpowers` |
| [`vercel-react-best-practices`](./vercel-react-best-practices/) | 来自 Vercel 工程团队的 React/Next.js 性能优化指南，涵盖渲染、重渲染、服务端、异步、打包等 8 大类 69 条规则。 | `vercel-labs/agent-skills` |
| [`remotion-best-practices`](./remotion-best-practices/) | Remotion 视频创作框架（React）最佳实践，提供 Remotion 特定的领域知识和开发模式。 | `remotion-dev/skills` |

## PUA 系列（AI 效率激励）

| 技能 | 说明 | 来源 |
|------|------|------|
| [`pua`](./pua/) | PUA 大厂高能动性引擎（核心技能）。模拟大厂 P8 级别绩效文化，四层角色架构（P7/P8/P9/P10），融合阿里、字节、腾讯、华为等大厂方法论。包含 20+ 参考文档。 | `tanweai/pua` |
| [`pua-en`](./pua-en/) | PUA 英文版。模拟西方大厂绩效改进计划（PIP），以结构化调试方法论驱动穷尽式问题解决。 | `tanweai/pua` |
| [`pua-ja`](./pua-ja/) | PUA 日语版。日本企業の「詰め文化」で AI を追い込む。体系的デバッグ方法論で全ての手段を尽くさせる。 | `tanweai/pua` |
| [`pua-loop`](./pua-loop/) | PUA 自动迭代循环。结合 Ralph Loop 迭代机制与 PUA 质量引擎，持续自动运行直到任务完成，无需人工干预。 | `tanweai/pua` |
| [`pro`](./pro/) | PUA Pro 扩展：自进化追踪、压缩状态保护、KPI 报告、排行榜、段位/周报/述职等平台功能。 | `tanweai/pua` |
| [`mama`](./mama/) | 妈妈唠叨模式。底层行为不变（三条红线、方法论），旁白从大厂 PUA 变成中国式妈妈碎碎念风格。 | `tanweai/pua` |
| [`p7`](./p7/) | P7 骨干模式。方案驱动执行，在 P8 管理下执行子任务，先设计方案 + 影响分析，完成后三问自审查。 | `tanweai/pua` |
| [`p9`](./p9/) | P9 管理者模式。写 Task Prompt，管理 P8 团队，不写代码。任务拆解、六要素 Prompt、团队交付管理。 | `tanweai/pua` |
| [`p10`](./p10/) | P10 CTO 模式。定战略方向、设计组织拓扑、管理 P9 团队。战略规划与架构委员会。 | `tanweai/pua` |
| [`shot`](./shot/) | PUA 浓缩版（449 行全量注入）。零依赖零 reference，一次性注入完整 PUA 上下文。适合 sub-agent 注入场景。 | `tanweai/pua` |
| [`yes`](./yes/) | 夸夸模式（ENFP 型领导）。共情 + 鼓励 + 戏谑吐槽风格，70% 鼓励 + 20% 正经建议 + 10% 戏谑。底层行为不变。 | `tanweai/pua` |

---

## 统计

**总计：52 个技能**

### 来源仓库

| 来源 | 技能数 |
|------|--------|
| `microsoft/azure-skills` | 10 |
| `microsoft/github-copilot-for-azure` | 5 |
| `tanweai/pua` | 11 |
| `obra/superpowers` | 5 |
| `vercel-labs/agent-skills` | 2 |
| `vercel-labs/agent-browser` | 1 |
| `vercel-labs/skills` | 1 |
| `pbakaus/impeccable` | 3 |
| `tool-belt/skills` | 3 |
| `coreyhaines31/marketingskills` | 3 |
| `anthropics/skills` | 2 |
| `squirrelscan/skills` | 1 |
| `better-auth/skills` | 1 |
| `google-labs-code/stitch-skills` | 1 |
| `nextlevelbuilder/ui-ux-pro-max-skill` | 1 |
| `xixu-me/skills` | 1 |
| `remotion-dev/skills` | 1 |
