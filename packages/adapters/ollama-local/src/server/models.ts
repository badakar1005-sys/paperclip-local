export const models = [
  { id: "llama3.2", label: "Llama 3.2" },
  { id: "llama3.1", label: "Llama 3.1" },
  { id: "llama3", label: "Llama 3" },
  { id: "mistral", label: "Mistral" },
  { id: "gemma2", label: "Gemma 2" },
  { id: "qwen2.5", label: "Qwen 2.5" },
  { id: "codellama", label: "Code Llama" },
  { id: "deepseek-coder-v2", label: "DeepSeek Coder V2" },
];

export async function listOllamaModels(baseUrl?: string): Promise<typeof models> {
  const host = baseUrl ?? "http://localhost:11434";
  try {
    const response = await fetch(`${host}/api/tags`);
    if (!response.ok) return models;
    const data = (await response.json()) as { models?: Array<{ name: string }> };
    const installed = data.models?.map((m) => m.name) ?? [];
    
    // Return installed models first, then available models
    return [
      ...models.filter((m) => installed.includes(m.id)),
      ...models.filter((m) => !installed.includes(m.id)),
    ];
  } catch {
    return models;
  }
}
