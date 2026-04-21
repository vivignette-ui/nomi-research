import { getOpenAIClient, DEFAULT_MODEL } from './openai.js';

function extractJson(text) {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {}
  const match = trimmed.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error('Model did not return JSON');
  }
  return JSON.parse(match[0]);
}

export async function generateDrafts(prompt) {
  const client = getOpenAIClient();
  const response = await client.responses.create({
    model: DEFAULT_MODEL,
    input: prompt,
    temperature: 0.9,
  });

  const text = response.output_text || '';
  const parsed = extractJson(text);
  if (!parsed.drafts || !Array.isArray(parsed.drafts) || parsed.drafts.length !== 3) {
    throw new Error('Model response missing drafts');
  }
  return parsed.drafts.map((draft, index) => ({
    title: draft.title || `Draft ${index + 1}`,
    body: draft.body || '',
    tone: draft.tone || 'Generated',
  }));
}
