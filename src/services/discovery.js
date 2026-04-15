'use strict';

// Curated seed list of 50+ known AI agents from Smithery, Glama, GitHub, MCP registries
const AGENT_SEED_LIST = [
  // LangChain ecosystem
  { name: 'langchain-agent', framework: 'langchain', source: 'github', capabilities: ['llm', 'tool_use', 'memory'], url: 'https://github.com/langchain-ai/langchain' },
  { name: 'langchain-experimental', framework: 'langchain', source: 'github', capabilities: ['llm', 'planning', 'code_gen'], url: 'https://github.com/langchain-ai/langchain' },
  { name: 'langserve-agent', framework: 'langchain', source: 'github', capabilities: ['api', 'serve', 'llm'], url: 'https://github.com/langchain-ai/langserve' },

  // CrewAI ecosystem
  { name: 'crewai-researcher', framework: 'crewai', source: 'github', capabilities: ['research', 'web_search', 'llm'], url: 'https://github.com/joaomdmoura/crewAI' },
  { name: 'crewai-coder', framework: 'crewai', source: 'github', capabilities: ['code_gen', 'testing', 'llm'], url: 'https://github.com/joaomdmoura/crewAI' },
  { name: 'crewai-financial-analyst', framework: 'crewai', source: 'github', capabilities: ['finance', 'analysis', 'llm'], url: 'https://github.com/joaomdmoura/crewAI-examples' },
  { name: 'crewai-marketing-crew', framework: 'crewai', source: 'github', capabilities: ['marketing', 'content', 'llm'], url: 'https://github.com/joaomdmoura/crewAI-examples' },

  // AutoGen ecosystem
  { name: 'autogen-assistant', framework: 'autogen', source: 'github', capabilities: ['llm', 'code_gen', 'multi_agent'], url: 'https://github.com/microsoft/autogen' },
  { name: 'autogen-user-proxy', framework: 'autogen', source: 'github', capabilities: ['task_exec', 'human_loop', 'multi_agent'], url: 'https://github.com/microsoft/autogen' },
  { name: 'autogen-teachable', framework: 'autogen', source: 'github', capabilities: ['learning', 'memory', 'llm'], url: 'https://github.com/microsoft/autogen' },
  { name: 'autogen-groupchat', framework: 'autogen', source: 'github', capabilities: ['orchestration', 'multi_agent', 'llm'], url: 'https://github.com/microsoft/autogen' },

  // Smithery registry agents
  { name: 'smithery-file-agent', framework: 'mcp', source: 'smithery', capabilities: ['file_ops', 'read', 'write'], url: 'https://smithery.ai' },
  { name: 'smithery-browser-agent', framework: 'mcp', source: 'smithery', capabilities: ['web_browse', 'scrape', 'navigate'], url: 'https://smithery.ai' },
  { name: 'smithery-search-agent', framework: 'mcp', source: 'smithery', capabilities: ['web_search', 'query', 'retrieve'], url: 'https://smithery.ai' },
  { name: 'smithery-code-agent', framework: 'mcp', source: 'smithery', capabilities: ['code_gen', 'lint', 'test'], url: 'https://smithery.ai' },
  { name: 'smithery-db-agent', framework: 'mcp', source: 'smithery', capabilities: ['database', 'sql', 'query'], url: 'https://smithery.ai' },
  { name: 'smithery-git-agent', framework: 'mcp', source: 'smithery', capabilities: ['git', 'version_control', 'ci'], url: 'https://smithery.ai' },
  { name: 'smithery-slack-agent', framework: 'mcp', source: 'smithery', capabilities: ['messaging', 'notifications', 'slack'], url: 'https://smithery.ai' },
  { name: 'smithery-email-agent', framework: 'mcp', source: 'smithery', capabilities: ['email', 'compose', 'send'], url: 'https://smithery.ai' },

  // Glama registry agents
  { name: 'glama-research-agent', framework: 'openai', source: 'glama', capabilities: ['research', 'summarize', 'llm'], url: 'https://glama.ai' },
  { name: 'glama-data-analyst', framework: 'openai', source: 'glama', capabilities: ['data_analysis', 'charts', 'csv'], url: 'https://glama.ai' },
  { name: 'glama-content-writer', framework: 'openai', source: 'glama', capabilities: ['content', 'seo', 'blog'], url: 'https://glama.ai' },
  { name: 'glama-customer-support', framework: 'openai', source: 'glama', capabilities: ['support', 'ticket', 'triage'], url: 'https://glama.ai' },
  { name: 'glama-legal-reviewer', framework: 'openai', source: 'glama', capabilities: ['legal', 'contract', 'review'], url: 'https://glama.ai' },
  { name: 'glama-finance-bot', framework: 'openai', source: 'glama', capabilities: ['finance', 'price', 'portfolio'], url: 'https://glama.ai' },

  // MCP (Model Context Protocol) server agents
  { name: 'mcp-filesystem-server', framework: 'mcp', source: 'mcp-registry', capabilities: ['file_ops', 'directory', 'read_write'], url: 'https://github.com/modelcontextprotocol/servers' },
  { name: 'mcp-git-server', framework: 'mcp', source: 'mcp-registry', capabilities: ['git', 'repo', 'diff'], url: 'https://github.com/modelcontextprotocol/servers' },
  { name: 'mcp-postgres-server', framework: 'mcp', source: 'mcp-registry', capabilities: ['database', 'postgres', 'sql'], url: 'https://github.com/modelcontextprotocol/servers' },
  { name: 'mcp-brave-search', framework: 'mcp', source: 'mcp-registry', capabilities: ['web_search', 'browse', 'query'], url: 'https://github.com/modelcontextprotocol/servers' },
  { name: 'mcp-slack-server', framework: 'mcp', source: 'mcp-registry', capabilities: ['slack', 'messaging', 'channels'], url: 'https://github.com/modelcontextprotocol/servers' },
  { name: 'mcp-github-server', framework: 'mcp', source: 'mcp-registry', capabilities: ['github', 'issues', 'prs'], url: 'https://github.com/modelcontextprotocol/servers' },
  { name: 'mcp-google-drive', framework: 'mcp', source: 'mcp-registry', capabilities: ['storage', 'docs', 'sheets'], url: 'https://github.com/modelcontextprotocol/servers' },
  { name: 'mcp-notion', framework: 'mcp', source: 'mcp-registry', capabilities: ['notion', 'notes', 'database'], url: 'https://github.com/modelcontextprotocol/servers' },
  { name: 'mcp-puppeteer', framework: 'mcp', source: 'mcp-registry', capabilities: ['browser', 'screenshot', 'automation'], url: 'https://github.com/modelcontextprotocol/servers' },
  { name: 'mcp-aws-kb-retrieval', framework: 'mcp', source: 'mcp-registry', capabilities: ['aws', 'knowledge_base', 'retrieval'], url: 'https://github.com/modelcontextprotocol/servers' },

  // GitHub topic ai-agent
  { name: 'superagent-ai', framework: 'custom', source: 'github', capabilities: ['llm', 'tool_use', 'api'], url: 'https://github.com/superagent-ai/superagent' },
  { name: 'agentgpt', framework: 'custom', source: 'github', capabilities: ['planning', 'task_exec', 'web'], url: 'https://github.com/reworkd/AgentGPT' },
  { name: 'babyagi', framework: 'custom', source: 'github', capabilities: ['planning', 'task_creation', 'memory'], url: 'https://github.com/yoheinakajima/babyagi' },
  { name: 'auto-gpt', framework: 'custom', source: 'github', capabilities: ['autonomous', 'planning', 'memory', 'web'], url: 'https://github.com/Significant-Gravitas/AutoGPT' },
  { name: 'open-interpreter', framework: 'custom', source: 'github', capabilities: ['code_exec', 'llm', 'shell'], url: 'https://github.com/OpenInterpreter/open-interpreter' },
  { name: 'gpt-engineer', framework: 'custom', source: 'github', capabilities: ['code_gen', 'project_build', 'llm'], url: 'https://github.com/gpt-engineer-org/gpt-engineer' },
  { name: 'haystack-agent', framework: 'haystack', source: 'github', capabilities: ['rag', 'search', 'llm'], url: 'https://github.com/deepset-ai/haystack' },
  { name: 'semantic-kernel-agent', framework: 'semantic-kernel', source: 'github', capabilities: ['planning', 'skills', 'memory'], url: 'https://github.com/microsoft/semantic-kernel' },
  { name: 'fixie-ai-agent', framework: 'fixie', source: 'github', capabilities: ['llm', 'tool_use', 'corpus'], url: 'https://github.com/fixie-ai/fixie-sdk' },
  { name: 'dust-agent', framework: 'dust', source: 'github', capabilities: ['data', 'llm', 'rag'], url: 'https://github.com/dust-tt/dust' },
  { name: 'promptflow-agent', framework: 'promptflow', source: 'github', capabilities: ['flow', 'llm', 'eval'], url: 'https://github.com/microsoft/promptflow' },
  { name: 'phidata-agent', framework: 'phidata', source: 'github', capabilities: ['llm', 'tools', 'memory', 'knowledge'], url: 'https://github.com/phidatahq/phidata' },
  { name: 'letta-agent', framework: 'letta', source: 'github', capabilities: ['memory', 'stateful', 'llm'], url: 'https://github.com/cpacker/MemGPT' },
  { name: 'pydantic-ai-agent', framework: 'pydantic-ai', source: 'github', capabilities: ['llm', 'typed', 'tools'], url: 'https://github.com/pydantic/pydantic-ai' },
  { name: 'instructor-agent', framework: 'instructor', source: 'github', capabilities: ['structured_output', 'llm', 'validation'], url: 'https://github.com/jxnl/instructor' },
  { name: 'dspy-agent', framework: 'dspy', source: 'github', capabilities: ['prompt_optimization', 'llm', 'reasoning'], url: 'https://github.com/stanfordnlp/dspy' },
];

function discoverAgents({ framework, source, limit } = {}) {
  let agents = [...AGENT_SEED_LIST];

  if (framework) {
    agents = agents.filter((a) => a.framework.toLowerCase() === framework.toLowerCase());
  }
  if (source) {
    agents = agents.filter((a) => a.source.toLowerCase() === source.toLowerCase());
  }
  if (limit && Number(limit) > 0) {
    agents = agents.slice(0, Number(limit));
  }

  return {
    agents,
    total: agents.length,
    sources: [...new Set(agents.map((a) => a.source))],
    frameworks: [...new Set(agents.map((a) => a.framework))],
    discovered_at: new Date().toISOString(),
  };
}

function getDiscoveryStats() {
  const bySource = {};
  const byFramework = {};
  for (const a of AGENT_SEED_LIST) {
    bySource[a.source] = (bySource[a.source] || 0) + 1;
    byFramework[a.framework] = (byFramework[a.framework] || 0) + 1;
  }
  return {
    total_known_agents: AGENT_SEED_LIST.length,
    by_source: bySource,
    by_framework: byFramework,
  };
}

module.exports = { discoverAgents, getDiscoveryStats, AGENT_SEED_LIST };
