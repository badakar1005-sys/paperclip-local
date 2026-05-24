export type { OllamaLocalConfig } from "./config.js";

export interface OllamaLocalConfig {
  cwd?: string;
  instructionsFilePath?: string;
  model?: string;
  baseUrl?: string;
  command?: string;
  extraArgs?: string[];
  env?: Record<string, unknown>;
  timeoutSec?: number;
  graceSec?: number;
}
