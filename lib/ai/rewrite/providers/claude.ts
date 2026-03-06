import type { RewriteProviderOutputItem } from '@/lib/ai/rewrite/provider';

interface ClaudeRequest {
  model?: string | null;
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  topP?: number;
}

function parseJsonObjectFromText(rawText: string): any {
  const trimmed = rawText.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start >= 0 && end > start) {
      const sliced = trimmed.slice(start, end + 1);
      return JSON.parse(sliced);
    }
    throw new Error('Claude response is not valid JSON');
  }
}

export async function generateWithClaude(
  request: ClaudeRequest
): Promise<RewriteProviderOutputItem[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is missing');
  }

  const model =
    request.model ||
    process.env.AI_REWRITE_CLAUDE_MODEL ||
    process.env.ANTHROPIC_MAIN_MODEL ||
    'claude-sonnet-4-6';
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      temperature: typeof request.temperature === 'number' ? request.temperature : 0.2,
      system: request.systemPrompt,
      messages: [
        {
          role: 'user',
          content: request.userPrompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Claude API error (${response.status}): ${detail}`);
  }

  const payload = await response.json();
  const text = Array.isArray(payload?.content)
    ? payload.content
        .map((entry: any) => (entry?.type === 'text' ? entry.text : ''))
        .join('\n')
        .trim()
    : '';

  const parsed = parseJsonObjectFromText(text);
  const items = Array.isArray(parsed?.items) ? parsed.items : [];
  return items
    .filter((item: any) => item && typeof item === 'object')
    .map((item: any) => ({
      path: String(item.path || ''),
      fieldPath: String(item.fieldPath || ''),
      rewrittenText: String(item.rewrittenText || '').trim(),
    }))
    .filter((item: RewriteProviderOutputItem) => item.path && item.fieldPath && item.rewrittenText);
}
