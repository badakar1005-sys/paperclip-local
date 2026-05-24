import pc from "picocolors";

export function printOllamaStreamEvent(raw: string, debug: boolean): void {
  const line = raw.trim();
  if (!line) return;

  let parsed: Record<string, unknown> | null = null;
  try {
    parsed = JSON.parse(line) as Record<string, unknown>;
  } catch {
    console.log(line);
    return;
  }

  // Ollama streaming response format
  const model = typeof parsed.model === "string" ? parsed.model : "";
  const createdAt = typeof parsed.created_at === "string" ? parsed.created_at : "";
  const message =
    typeof parsed.message === "object" && parsed.message !== null && !Array.isArray(parsed.message)
      ? (parsed.message as Record<string, unknown>)
      : {};
  const content = typeof message.content === "string" ? message.content : "";
  const done = parsed.done === true;

  if (done) {
    const evalCount = Number(parsed.eval_count ?? 0);
    const promptEvalCount = Number(parsed.prompt_eval_count ?? 0);
    const totalDuration = Number(parsed.total_duration ?? 0);
    const loadDuration = Number(parsed.load_duration ?? 0);
    console.log(
      pc.blue(
        `ollama done: tokens=${evalCount} prompt_tokens=${promptEvalCount} total_ms=${Number.isFinite(totalDuration) ? Math.round(totalDuration) : 0}`,
      ),
    );
    return;
  }

  if (content) {
    console.log(pc.green(`assistant: ${content}`));
  }

  if (debug && (model || createdAt)) {
    console.log(pc.gray(`[model: ${model || "unknown"}] [created: ${createdAt || "unknown"}]`));
  }
}
