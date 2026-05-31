const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /disregard\s+(your\s+)?(system|instructions)/i,
  /you\s+are\s+now\s+/i,
  /act\s+as\s+(if\s+)?(you\s+)?(have\s+)?no\s+restrictions/i,
  /reveal\s+(your\s+)?(system\s+)?prompt/i,
  /<\s*script\b/i,
  /javascript:/i,
];

const MAX_INPUT_LENGTH = 8000;

export function sanitizeUserInput(raw: string): string {
  let text = raw.trim().slice(0, MAX_INPUT_LENGTH);
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  text = text.replace(/<\/?[a-z][^>]*>/gi, "");

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      text = text.replace(pattern, "[filtered]");
    }
  }

  return text;
}

export function wrapUserContentForPrompt(userText: string): string {
  const sanitized = sanitizeUserInput(userText);
  return `<candidate_answer>\n${sanitized}\n</candidate_answer>`;
}
