import OpenAI from 'openai';
import { buildCharacterPrompt, parseDraftsFromText, fallbackDraftsB } from '../lib/prompts.js';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { task, notes, platform, platformOther, selfProfile } = req.body || {};
    if (!task) {
      return res.status(400).json({ error: 'task is required' });
    }
    if (!selfProfile?.mode) {
      return res.status(400).json({ error: 'selfProfile.mode is required' });
    }

    const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
    const resolvedPlatform = platform === 'Other' ? (platformOther || 'social media') : (platform || 'social media');

    const prompt = buildCharacterPrompt({
      platform: resolvedPlatform,
      task,
      notes: notes || '',
      mode: selfProfile.mode || '',
      tone: selfProfile.tone || '',
      polish: selfProfile.polish || '',
      energy: selfProfile.energy || '',
      selfFeel: selfProfile.selfFeel || '',
      vibes: selfProfile.vibes || [],
    });

    const response = await client.responses.create({
      model,
      input: prompt,
    });

    const text = response.output_text || '';
    const drafts = parseDraftsFromText(
      text,
      fallbackDraftsB(task, resolvedPlatform, selfProfile.mode || 'Thoughtful diarist')
    );

    return res.status(200).json({
      generationId: response.id || '',
      drafts,
    });
  } catch (error) {
    console.error('GENERATE B ERROR', error);
    return res.status(500).json({ error: error.message || 'Failed to generate Version B' });
  }
}
