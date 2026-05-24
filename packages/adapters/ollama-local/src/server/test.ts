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
