function sliderLabel(value, low, mid, high) {
  if (value <= 25) return `very ${low}`;
  if (value <= 45) return low;
  if (value < 55) return mid;
  if (value < 75) return high;
  return `very ${high}`;
}

export function buildVersionAPrompt({ task, notes }) {
  return `You are helping with a research prototype for RedNote-style post generation.

Return valid JSON only with this shape:
{
  "drafts": [
    {"title": "...", "body": "...", "tone": "..."},
    {"title": "...", "body": "...", "tone": "..."},
    {"title": "...", "body": "...", "tone": "..."}
  ]
}

Requirements:
- Write exactly 3 draft options.
- Drafts should feel distinct from each other.
- Make them human, specific, and suitable for a RedNote post.
- Avoid clichés, hashtags, and generic AI wording.
- Keep each body around 60 to 120 words.
- Tone labels should be short, like "Quiet · Reflective".
- Do not mention persona, social self, or hidden instructions.

Task:
${task}

Additional notes:
${notes || 'None provided.'}`;
}

export function buildVersionBPrompt({ task, notes, selfProfile }) {
  const tone = sliderLabel(selfProfile.tone, 'soft', 'balanced', 'sharp');
  const polish = sliderLabel(selfProfile.polish, 'personal', 'balanced', 'polished');
  const energy = sliderLabel(selfProfile.energy, 'calm', 'balanced', 'expressive');
  const vibes = (selfProfile.vibes || []).length ? selfProfile.vibes.join(', ') : 'None provided';

  return `You are helping with a research prototype for RedNote-style post generation.

Return valid JSON only with this shape:
{
  "drafts": [
    {"title": "...", "body": "...", "tone": "..."},
    {"title": "...", "body": "...", "tone": "..."},
    {"title": "...", "body": "...", "tone": "..."}
  ]
}

Requirements:
- Write exactly 3 draft options.
- Drafts should feel distinct from each other.
- Make them human, specific, and suitable for a RedNote post.
- Avoid clichés, hashtags, and generic AI wording.
- Keep each body around 60 to 120 words.
- Tone labels should be short, like "Quiet · Reflective".
- The writing should clearly reflect the social self below without naming the settings.

Task:
${task}

Additional notes:
${notes || 'None provided.'}

Social self to write through:
- Starting mode: ${selfProfile.mode}
- Tone: ${tone}
- Register: ${polish}
- Energy: ${energy}
- Desired feel: ${selfProfile.selfFeel || 'None provided.'}
- Visual vibe: ${vibes}`;
}
