import type { TranscriptEntry } from "@paperclipai/adapter-utils";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function parseOllamaStdoutLine(line: string, ts: string): TranscriptEntry[] {
  const parsed = asRecord(safeJsonParse(line));
  if (!parsed) {
    return [{ kind: "stdout", ts, text: line }];
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
    return [
      {
        kind: "result",
        ts,
        text: `Generation complete. Tokens: ${evalCount}, Prompt tokens: ${promptEvalCount}, Duration: ${Math.round(totalDuration)}ms`,
        inputTokens: promptEvalCount,
        outputTokens: evalCount,
      },
    ];
  }

  if (content) {
    return [{ kind: "assistant", ts, text: content }];
  }

  // If we have model info but no content yet, it's a system/init event
  if (model) {
    return [
      {
        kind: "init",
        ts,
        model,
        sessionId: createdAt || "",
      },
    ];
  }

  return [{ kind: "stdout", ts, text: line }];
}
