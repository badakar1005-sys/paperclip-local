import type { AdapterModelProfileDefinition } from "@paperclipai/adapter-utils";

export const type = "openrouter_api";
export const label = "OpenRouter API";

export const DEFAULT_OPENROUTER_MODEL = "auto";

export const models = [
  { id: DEFAULT_OPENROUTER_MODEL, label: "Auto (best available)" },
  { id: "anthropic/claude-sonnet-4-20250514", label: "Claude Sonnet 4" },
  { id: "anthropic/claude-3.7-sonnet", label: "Claude 3.7 Sonnet" },
  { id: "anthropic/claude-3.5-sonnet", label: "Claude 3.5 Sonnet" },
  { id: "openai/gpt-4o", label: "GPT-4o" },
  { id: "openai/gpt-4-turbo", label: "GPT-4 Turbo" },
  { id: "openai/o3-mini", label: "o3-mini" },
  { id: "google/gemini-pro-1.5", label: "Gemini Pro 1.5" },
  { id: "meta-llama/llama-3.3-70b-instruct", label: "Llama 3.3 70B" },
  { id: "mistralai/mistral-large", label: "Mistral Large" },
];

export const modelProfiles: AdapterModelProfileDefinition[] = [
  {
    key: "cheap",
    label: "Cheap",
    description: "Use a cost-effective model on OpenRouter while preserving the primary model.",
    adapterConfig: {
      model: "meta-llama/llama-3.3-70b-instruct",
    },
    source: "adapter_default",
  },
];

export const agentConfigurationDoc = `# openrouter_api agent configuration

Adapter: openrouter_api

Use when:
- You want access to multiple LLM providers through a single API
- You need flexibility to switch between different model providers
- You want unified billing across multiple AI providers

Don't use when:
- You only need a single provider's API directly
- You need the absolute lowest latency (additional proxy hop)

Core fields:
- cwd (string, optional): default absolute working directory fallback for the agent process
- instructionsFilePath (string, optional): absolute path to a markdown instructions file
- promptTemplate (string, optional): run prompt template
- model (string, optional): OpenRouter model ID. Defaults to auto
- baseUrl (string, optional): OpenRouter API base URL. Defaults to https://openrouter.ai/api/v1
- apiKey (string, optional): OpenRouter API key (or set OPENROUTER_API_KEY env var)
- extraArgs (string[], optional): additional request parameters
- env (object, optional): KEY=VALUE environment variables

Operational fields:
- timeoutSec (number, optional): run timeout in seconds
- graceSec (number, optional): SIGTERM grace period in seconds

Notes:
- Requires an OpenRouter API key (get one at https://openrouter.ai/keys)
- Supports models from Anthropic, OpenAI, Google, Meta, and more
- Uses OpenAI-compatible API format
- Set OPENROUTER_API_KEY environment variable or configure apiKey in adapter config
`;
