import OpenAI from 'openai';
import { buildDirectPrompt, parseDraftsFromText, fallbackDraftsA } from '../lib/prompts.js';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { task, notes, platform, platformOther } = req.body || {};
    if (!task) {
      return res.status(400).json({ error: 'task is required' });
    }

    const model = process.env.OPENAI_MODEL || 'gpt-5.4-mini';
    const resolvedPlatform = platform === 'Other' ? (platformOther || 'social media') : (platform || 'social media');

    const prompt = buildDirectPrompt({
      platform: resolvedPlatform,
      task,
      notes: notes || '',
    });

    const response = await client.responses.create({
      model,
      input: prompt,
    });

    const text = response.output_text || '';
    const drafts = parseDraftsFromText(text, fallbackDraftsA(task, resolvedPlatform));

    return res.status(200).json({
      generationId: response.id || '',
      drafts,
    });
  } catch (error) {
    console.error('GENERATE A ERROR', error);
    return res.status(500).json({ error: error.message || 'Failed to generate Version A' });
  }
}
