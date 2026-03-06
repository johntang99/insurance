import type { RewriteProviderOutputItem } from '@/lib/ai/rewrite/provider';

interface OpenAIRequest {
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
    throw new Error('OpenAI response is not valid JSON');
  }
}

export async function generateWithOpenAI(
  request: OpenAIRequest
): Promise<RewriteProviderOutputItem[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is missing');
  }

  const model =
    request.model ||
    process.env.AI_REWRITE_OPENAI_MODEL ||
    process.env.OPENAI_MAIN_MODEL ||
    'gpt-5.2';
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: typeof request.temperature === 'number' ? request.temperature : 0.2,
      top_p: typeof request.topP === 'number' ? request.topP : 0.95,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: request.systemPrompt },
        { role: 'user', content: request.userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${detail}`);
  }

  const payload = await response.json();
  const text = String(payload?.choices?.[0]?.message?.content || '').trim();
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
