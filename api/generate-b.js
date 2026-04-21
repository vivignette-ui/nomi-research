import { randomUUID } from 'crypto';
import { buildVersionBPrompt } from '../lib/prompts.js';
import { generateDrafts } from '../lib/generation.js';

const fallbackByMode = {
  'Thoughtful diarist': [
    { title: 'What I did not say for three weeks', body: 'I had been doing the same thing every morning for 21 days before I felt ready to write about it. Not a routine. More like a slow return to something I had forgotten.', tone: 'Reflective · Slow-burn' },
    { title: 'A small thing that changed how I start', body: 'It is embarrassing how simple it is. But I think that is why it works. It does not ask anything of me. It just gives.', tone: 'Intimate · Honest' },
    { title: 'Morning, quietly', body: 'There is a version of morning I had forgotten about. This year I found it again. I want to describe it without making it sound like a transformation, because it is softer than that.', tone: 'Considered · Personal' },
  ],
  'Polished lifestyle sharer': [
    { title: 'My non-negotiable morning ritual', body: 'I used to overcomplicate my mornings. Now I protect the first hour like it is the most important meeting of the day, because it is.', tone: 'Curated · Aspirational' },
    { title: 'What changed everything about my mornings', body: 'One ritual. Consistent for 90 days. Here is exactly what I do and why it works. No fluff, just what actually made a difference.', tone: 'Clear · Refined' },
    { title: 'The morning upgrade I was not expecting', body: 'I did not set out to build a ritual. I just started doing one small thing. Three months later it is the foundation everything else rests on.', tone: 'Polished · Confident' },
  ],
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { sessionId, task, notes, selfProfile } = req.body || {};
    if (!sessionId || !task || !selfProfile) {
      return res.status(400).json({ error: 'sessionId, task, and selfProfile are required' });
    }
    const prompt = buildVersionBPrompt({ task, notes, selfProfile });
    let drafts;
    try {
      drafts = await generateDrafts(prompt);
    } catch (error) {
      console.warn('OpenAI unavailable for Version B, using fallback drafts.', error?.message || error);
      drafts = fallbackByMode[selfProfile.mode] || fallbackByMode['Thoughtful diarist'];
    }
    return res.status(200).json({ generationId: randomUUID(), drafts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Failed to generate Version B' });
  }
}
