import type { AdapterModelProfileDefinition } from "@paperclipai/adapter-utils";

export const type = "ollama_local";
export const label = "Ollama (local)";

export const DEFAULT_OLLAMA_LOCAL_MODEL = "llama3.2";

export const models = [
  { id: DEFAULT_OLLAMA_LOCAL_MODEL, label: "Llama 3.2" },
  { id: "llama3.1", label: "Llama 3.1" },
  { id: "llama3", label: "Llama 3" },
  { id: "mistral", label: "Mistral" },
  { id: "gemma2", label: "Gemma 2" },
  { id: "qwen2.5", label: "Qwen 2.5" },
  { id: "codellama", label: "Code Llama" },
  { id: "deepseek-coder-v2", label: "DeepSeek Coder V2" },
];

export const modelProfiles: AdapterModelProfileDefinition[] = [
  {
    key: "cheap",
    label: "Cheap",
    description: "Use a smaller Ollama model for budget-friendly local inference.",
    adapterConfig: {
      model: "llama3.2",
    },
    source: "adapter_default",
  },
];

export const agentConfigurationDoc = `# ollama_local agent configuration

Adapter: ollama_local

Use when:
- You want to run Ollama models locally on your machine
- You have Ollama installed and running (default: http://localhost:11434)
- You want offline/local AI coding assistance

Don't use when:
- You need cloud-based models with larger context windows
- Ollama is not installed on your machine

Core fields:
- cwd (string, optional): default absolute working directory fallback for the agent process
- instructionsFilePath (string, optional): absolute path to a markdown instructions file
- promptTemplate (string, optional): run prompt template
- model (string, optional): Ollama model name. Defaults to llama3.2
- baseUrl (string, optional): Ollama API base URL. Defaults to http://localhost:11434
- command (string, optional): defaults to "ollama"
- extraArgs (string[], optional): additional CLI args
- env (object, optional): KEY=VALUE environment variables

Operational fields:
- timeoutSec (number, optional): run timeout in seconds
- graceSec (number, optional): SIGTERM grace period in seconds

Notes:
- Requires Ollama to be installed and running locally
- Models must be pulled beforehand using \`ollama pull <model>\`
- Uses OpenAI-compatible API format for chat completions
`;
