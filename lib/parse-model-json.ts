export function parseJsonFromModelText<T>(text: string): T | null {
  const stripped = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  const start = stripped.indexOf("{");
  const end = stripped.lastIndexOf("}");
  if (start === -1 || end <= start) return null;

  try {
    return JSON.parse(stripped.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}
