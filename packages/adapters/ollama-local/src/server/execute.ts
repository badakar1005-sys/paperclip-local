import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import type { ExecuteOptions, ExecuteResult } from "@paperclipai/adapter-utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function ollamaSessionCwdMatchesExecutionTarget(
  sessionParams: Record<string, unknown> | null,
  targetCwd: string | null,
): Promise<boolean> {
  if (!sessionParams || !targetCwd) return true;
  const sessionCwd =
    typeof sessionParams.cwd === "string"
      ? sessionParams.cwd
      : typeof sessionParams.workdir === "string"
        ? sessionParams.workdir
        : typeof sessionParams.folder === "string"
          ? sessionParams.folder
          : null;
  if (!sessionCwd) return true;
  return sessionCwd === targetCwd;
}

export async function execute(options: ExecuteOptions): Promise<ExecuteResult> {
  const { cwd, prompt, adapterConfig, signal } = options;
  const model =
    typeof adapterConfig.model === "string" && adapterConfig.model.trim()
      ? adapterConfig.model.trim()
      : "llama3.2";
  const baseUrl =
    typeof adapterConfig.baseUrl === "string" && adapterConfig.baseUrl.trim()
      ? adapterConfig.baseUrl.trim()
      : "http://localhost:11434";
  const command =
    typeof adapterConfig.command === "string" && adapterConfig.command.trim()
      ? adapterConfig.command.trim()
      : "ollama";
  const extraArgs = Array.isArray(adapterConfig.extraArgs)
    ? adapterConfig.extraArgs.filter((arg) => typeof arg === "string")
    : [];

  return new Promise((resolve, reject) => {
    const args = ["run", model];
    if (extraArgs.length > 0) {
      args.push(...extraArgs);
    }

    const proc = spawn(command, args, {
      cwd,
      env: { ...process.env, OLLAMA_HOST: baseUrl },
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    proc.stdin.write(prompt);
    proc.stdin.end();

    proc.on("close", (code) => {
      if (code === 0) {
        resolve({
          kind: "success",
          output: stdout,
          exitCode: code ?? 0,
        });
      } else {
        resolve({
          kind: "failure",
          error: stderr || `Process exited with code ${code}`,
          exitCode: code ?? 1,
        });
      }
    });

    proc.on("error", (err) => {
      resolve({
        kind: "failure",
        error: err.message,
        exitCode: -1,
      });
    });

    if (signal) {
      signal.addEventListener("abort", () => {
        proc.kill("SIGTERM");
      });
    }
  });
}

export async function listOllamaModels(baseUrl?: string): Promise<string[]> {
  const host = baseUrl ?? "http://localhost:11434";
  try {
    const response = await fetch(`${host}/api/tags`);
    if (!response.ok) return [];
    const data = (await response.json()) as { models?: Array<{ name: string }> };
    return data.models?.map((m) => m.name) ?? [];
  } catch {
    return [];
  }
}

export async function testEnvironment(): Promise<{ ok: boolean; errors: string[] }> {
  const errors: string[] = [];

  try {
    const response = await fetch("http://localhost:11434/api/tags");
    if (!response.ok) {
      errors.push(`Ollama API returned status ${response.status}`);
    }
  } catch (err) {
    errors.push(`Cannot connect to Ollama at http://localhost:11434: ${(err as Error).message}`);
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}
