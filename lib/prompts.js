function clampText(value) {
  return String(value || '').trim();
}

export function buildDirectPrompt({ platform, task, notes }) {
  return `
You are helping write a post for ${platform}.

Write exactly 3 distinct post drafts.
The drafts should feel natural, human, and specific.
Avoid generic AI phrasing, clichés, and filler.
Do not use emojis unless they feel unavoidable for the platform.
Do not use hashtags unless they feel necessary.
Return only valid JSON in this shape:
{
  "drafts": [
    { "title": "Short option name", "body": "Post text", "tone": "Tone label" },
    { "title": "Short option name", "body": "Post text", "tone": "Tone label" },
    { "title": "Short option name", "body": "Post text", "tone": "Tone label" }
  ]
}

User task:
${clampText(task)}

Notes:
${clampText(notes)}
`.trim();
}

export function buildCharacterPrompt({ platform, task, notes, mode, tone, polish, energy, selfFeel, vibes }) {
  return `
You are helping write a post for ${platform}.

Write exactly 3 distinct post drafts.
These drafts must be shaped by the user's intended social character.
Make the differences between the 3 options meaningful but keep them aligned to the same core intention.
Avoid generic AI phrasing, clichés, and filler.
Do not mention the sliders, settings, or "character" in the output.
Return only valid JSON in this shape:
{
  "drafts": [
    { "title": "Short option name", "body": "Post text", "tone": "Tone label" },
    { "title": "Short option name", "body": "Post text", "tone": "Tone label" },
    { "title": "Short option name", "body": "Post text", "tone": "Tone label" }
  ]
}

Platform:
${clampText(platform)}

User task:
${clampText(task)}

Notes:
${clampText(notes)}

Character mode:
${clampText(mode)}

Tone slider:
${clampText(tone)}

Polish slider:
${clampText(polish)}

Energy slider:
${clampText(energy)}

How they want to come across:
${clampText(selfFeel)}

Vibes:
${(vibes || []).join(', ')}
`.trim();
}

export function parseDraftsFromText(text, fallback) {
  try {
    const parsed = JSON.parse(text);
    if (parsed && Array.isArray(parsed.drafts) && parsed.drafts.length) {
      return parsed.drafts.slice(0, 3).map((d, i) => ({
        title: d.title || `Option ${i + 1}`,
        body: d.body || '',
        tone: d.tone || 'Generated',
      }));
    }
  } catch (e) {}

  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      const parsed = JSON.parse(match[0]);
      if (parsed && Array.isArray(parsed.drafts) && parsed.drafts.length) {
        return parsed.drafts.slice(0, 3).map((d, i) => ({
          title: d.title || `Option ${i + 1}`,
          body: d.body || '',
          tone: d.tone || 'Generated',
        }));
      }
    } catch (e) {}
  }

  return fallback;
}

export function fallbackDraftsA(task, platform) {
  return [
    {
      title: 'Direct opening',
      body: `I wanted to write something honest about ${task} for ${platform}. This is the most direct version: what happened, why it mattered, and what I actually think now.`,
      tone: 'Direct · Clear',
    },
    {
      title: 'What changed for me',
      body: `This post is really about ${task}. I want it to feel natural and readable, without sounding overworked. Here is the version I would probably publish first.`,
      tone: 'Honest · Conversational',
    },
    {
      title: 'Simple reflection',
      body: `Lately I have been thinking about ${task} and how it shifted something in my day-to-day life. I wanted to write it in a way that still feels like me.`,
      tone: 'Reflective · Natural',
    },
  ];
}

export function fallbackDraftsB(task, platform, mode) {
  return [
    {
      title: `${mode} option 1`,
      body: `For ${platform}, this version of me would talk about ${task} with more intention and more control over how I come across, while still keeping the post usable and natural.`,
      tone: 'Character-shaped · Coherent',
    },
    {
      title: `${mode} option 2`,
      body: `This keeps the same topic, ${task}, but filters it through the social character I chose first. The result should feel more specific and more aligned to the version of me I want to project.`,
      tone: 'Intentional · Specific',
    },
    {
      title: `${mode} option 3`,
      body: `I still want to say something real about ${task}, but in a way that feels closer to the version of me I meant to express on ${platform}.`,
      tone: 'Persona-led · Natural',
    },
  ];
}
