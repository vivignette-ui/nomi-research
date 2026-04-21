import { randomUUID } from 'crypto';
import { buildVersionAPrompt } from '../lib/prompts.js';
import { generateDrafts } from '../lib/generation.js';

const fallbackDrafts = [
  { title: 'Started noticing something small', body: 'Three weeks ago I changed one thing about my mornings and did not tell anyone. Not because it was dramatic, just because I wanted to see if it would last first. It did.', tone: 'Quiet · Observational' },
  { title: 'The habit nobody talks about', body: 'Everyone posts about cold showers and 5am wake-ups. My morning ritual is quieter. And it is the thing that has actually been helping.', tone: 'Relatable · Direct' },
  { title: 'Mornings used to stress me out', body: 'I used to check my phone before my eyes were fully open. Now I do not touch it for the first 40 minutes. Here is what changed, honestly.', tone: 'Honest · Conversational' },
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { sessionId, task, notes } = req.body || {};
    if (!sessionId || !task) {
      return res.status(400).json({ error: 'sessionId and task are required' });
    }
    const prompt = buildVersionAPrompt({ task, notes });
    let drafts;
    try {
      drafts = await generateDrafts(prompt);
    } catch (error) {
      console.warn('OpenAI unavailable for Version A, using fallback drafts.', error?.message || error);
      drafts = fallbackDrafts;
    }
    return res.status(200).json({ generationId: randomUUID(), drafts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Failed to generate Version A' });
  }
}
