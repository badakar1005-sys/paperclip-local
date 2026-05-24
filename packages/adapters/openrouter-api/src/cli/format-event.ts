import pc from "picocolors";

export function printOpenRouterStreamEvent(raw: string, debug: boolean): void {
  const line = raw.trim();
  if (!line) return;

  // Handle SSE format (data: {...})
  let jsonStr = line;
  if (line.startsWith("data: ")) {
    jsonStr = line.slice(6);
  }

  if (jsonStr === "[DONE]") {
    console.log(pc.blue("OpenRouter streaming complete"));
    return;
  }

  let parsed: Record<string, unknown> | null = null;
  try {
    parsed = JSON.parse(jsonStr) as Record<string, unknown>;
  } catch {
    console.log(line);
    return;
  }

  // OpenAI-compatible streaming format
  const choices = Array.isArray(parsed.choices) ? parsed.choices : [];
  
  for (const choiceRaw of choices) {
    if (typeof choiceRaw !== "object" || choiceRaw === null || Array.isArray(choiceRaw)) continue;
    const choice = choiceRaw as Record<string, unknown>;
    
    const delta =
      typeof choice.delta === "object" && choice.delta !== null && !Array.isArray(choice.delta)
        ? (choice.delta as Record<string, unknown>)
        : {};
    
    const content = typeof delta.content === "string" ? delta.content : "";
    const finishReason = typeof choice.finish_reason === "string" ? choice.finish_reason : "";
    
    if (content) {
      console.log(pc.green(`assistant: ${content}`));
    }
    
    if (finishReason) {
      console.log(pc.blue(`finish_reason: ${finishReason}`));
    }
  }

  // Usage info (only in final chunk)
  const usage =
    typeof parsed.usage === "object" && parsed.usage !== null && !Array.isArray(parsed.usage)
      ? (parsed.usage as Record<string, unknown>)
      : {};
  
  if (Object.keys(usage).length > 0) {
    const promptTokens = Number(usage.prompt_tokens ?? 0);
    const completionTokens = Number(usage.completion_tokens ?? 0);
    const totalTokens = Number(usage.total_tokens ?? 0);
    console.log(
      pc.blue(
        `tokens: prompt=${promptTokens} completion=${completionTokens} total=${totalTokens}`,
      ),
    );
  }

  if (debug) {
    const id = typeof parsed.id === "string" ? parsed.id : "";
    const model = typeof parsed.model === "string" ? parsed.model : "";
    if (id || model) {
      console.log(pc.gray(`[id: ${id || "unknown"}] [model: ${model || "unknown"}]`));
    }
  }
}
