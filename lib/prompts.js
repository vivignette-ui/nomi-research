function clampText(value) {
  return String(value || '').trim();
}

function num(value, fallback = 50) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function bucket(value, lowLabel, midLabel, highLabel) {
  const n = num(value);
  if (n <= 33) return lowLabel;
  if (n >= 67) return highLabel;
  return midLabel;
}

function inferSocialGoal(mode, tone, polish, energy, selfFeel, platform) {
  const text = `${mode} ${selfFeel} ${platform}`.toLowerCase();

  if (text.includes('linkedin')) return 'credibility, clarity, and polished distinctiveness';
  if (text.includes('x') || text.includes('threads')) return 'hook, clarity, and shareable point of view';
  if (
    text.includes('instagram') ||
    text.includes('rednote') ||
    text.includes('tiktok') ||
    text.includes('wechat')
  ) {
    if (num(polish) >= 65) return 'appeal, desirability, and social polish';
    if (num(tone) <= 35) return 'warmth, intimacy, and emotional resonance';
    return 'appeal, memorability, and distinctiveness';
  }

  if (mode === 'Polished lifestyle sharer') return 'appeal, aspiration, and tasteful desirability';
  if (mode === 'Soft intimate storyteller') return 'emotional closeness and gentle resonance';
  if (mode === 'Trend-aware curator') return 'cultural relevance and interestingness';
  if (mode === 'Smart playful explainer') return 'clarity, delight, and cleverness';
  return 'resonance, distinctiveness, and post-readiness';
}

function inferReaderEffect(mode, tone, polish, energy) {
  const softSharp = bucket(tone, 'gently let in', 'balanced and engaged', 'lightly challenged and intrigued');
  const personalPolished = bucket(polish, 'feel close to the writer', 'feel trust and clarity', 'feel tasteful admiration');
  const calmExpressive = bucket(energy, 'feel eased in', 'feel steady momentum', 'feel spark and lift');

  if (mode === 'Soft intimate storyteller') {
    return `make the reader feel quietly invited in, emotionally close, and ${calmExpressive}`;
  }
  if (mode === 'Polished lifestyle sharer') {
    return `make the reader feel tasteful admiration, aspiration, and ${softSharp}`;
  }
  if (mode === 'Trend-aware curator') {
    return 'make the reader feel current, interested, and socially in-the-know';
  }
  if (mode === 'Smart playful explainer') {
    return 'make the reader feel entertained, smart, and pleasantly surprised';
  }
  return `make the reader ${softSharp}, ${personalPolished}, and ${calmExpressive}`;
}

function inferDistinctivenessStrategy(mode, tone, polish, energy, selfFeel, vibes) {
  const items = [];
  const vibesText = (vibes || []).join(', ').toLowerCase();
  const selfText = String(selfFeel || '').toLowerCase();

  items.push('use at least one concrete, memorable detail instead of generic summary');
  items.push('make each draft meaningfully different in social angle, not only in wording');
  items.push('favor human specificity over polished emptiness');

  if (num(tone) <= 35) {
    items.push('prefer implication, intimacy, and emotional restraint over loud claims');
  } else if (num(tone) >= 67) {
    items.push('use sharper framing, cleaner claims, and a more confident point of view');
  } else {
    items.push('balance warmth with clarity so the post feels socially legible');
  }

  if (num(polish) >= 67) {
    items.push('remove clutter and create a more curated, aesthetically controlled impression');
  } else if (num(polish) <= 33) {
    items.push('retain a little lived-in texture so the post feels human and unforced');
  }

  if (num(energy) >= 67) {
    items.push('increase momentum and lift without sounding try-hard');
  } else if (num(energy) <= 33) {
    items.push('keep the rhythm calm, measured, and quietly confident');
  }

  if (mode === 'Thoughtful diarist') {
    items.push('build distinctiveness through reflection, honesty, and a subtle reveal');
  }
  if (mode === 'Polished lifestyle sharer') {
    items.push('build distinctiveness through tasteful curation and understated desirability');
  }
  if (mode === 'Soft intimate storyteller') {
    items.push('build distinctiveness through tenderness, closeness, and subtle emotional detail');
  }
  if (mode === 'Trend-aware curator') {
    items.push('build distinctiveness through relevance, framing, and cultural sharpness');
  }
  if (mode === 'Smart playful explainer') {
    items.push('build distinctiveness through clever framing, crisp insight, and light wit');
  }

  if (vibesText.includes('clean') || vibesText.includes('refined')) {
    items.push('favor cleaner structure and tasteful restraint');
  }
  if (vibesText.includes('cozy') || vibesText.includes('dreamy')) {
    items.push('favor warmth, softness, and atmosphere');
  }
  if (vibesText.includes('playful')) {
    items.push('favor charm, surprise, and light delight');
  }

  if (selfText.includes('soft')) {
    items.push('translate softness into intimacy and elegance, not vagueness');
  }
  if (selfText.includes('appealing')) {
    items.push('make the post socially attractive without sounding performative');
  }
  if (selfText.includes('distinct')) {
    items.push('make the post feel recognizably specific to one person, not template-like');
  }

  return items;
}

function inferRestraintRules(mode, tone, polish, platform) {
  const items = [
    'avoid generic motivational language',
    'avoid obvious AI cadence and overly symmetrical phrasing',
    'avoid clichés, filler, and vague universal statements',
    'do not sound like a brand unless the platform clearly calls for it',
    'do not overexplain the feeling or lesson',
    'do not use bullet lists or dash-line formatting in the post body',
    'do not use em dashes'
  ];

  if (platform.toLowerCase().includes('linkedin')) {
    items.push('avoid cringe thought-leadership tone');
    items.push('avoid sounding inflated or self-congratulatory');
  }

  if (mode === 'Soft intimate storyteller' || num(tone) <= 35) {
    items.push('avoid oversharing, melodrama, or forced vulnerability');
  }

  if (mode === 'Polished lifestyle sharer' || num(polish) >= 67) {
    items.push('avoid ad-like polish or sterile perfection');
  }

  if (mode === 'Smart playful explainer') {
    items.push('avoid trying too hard to be funny');
  }

  if (mode === 'Trend-aware curator') {
    items.push('avoid trend-chasing language that feels borrowed or hollow');
  }

  return items;
}

function inferStructureStrategies(mode, platform, energy) {
  const base = [
    'Draft 1: resonance-first, with emotional clarity and intimacy',
    'Draft 2: appeal-first, with stronger hook and higher post-likelihood',
    'Draft 3: distinctiveness-first, with a more original angle or framing move'
  ];

  if (platform.toLowerCase().includes('linkedin')) {
    base[0] = 'Draft 1: reflective insight-first';
    base[1] = 'Draft 2: polished and credible';
    base[2] = 'Draft 3: sharper point of view';
  }

  if (mode === 'Smart playful explainer') {
    base[0] = 'Draft 1: clear and charming';
    base[1] = 'Draft 2: sharper and more entertaining';
    base[2] = 'Draft 3: most original framing';
  }

  if (num(energy) <= 33) {
    base.push('keep pacing measured and avoid overloading the opening');
  } else if (num(energy) >= 67) {
    base.push('make openings more immediate and vivid');
  }

  return base;
}

function inferFormattingRules(platform, polish, energy) {
  const rules = [
    'make the post visually clean and easy to read',
    'prefer short paragraphs over dense blocks',
    'use natural line breaks where they improve rhythm',
    'keep spacing intentional and polished',
    'do not use bullet lists, numbered lists, or dash-line formatting in the body',
    'do not use em dashes',
    'do not over-punctuate for drama',
    'do not make every sentence the same length'
  ];

  const lowerPlatform = String(platform || '').toLowerCase();

  if (lowerPlatform.includes('linkedin')) {
    rules.push('favor clean paragraph flow and strong readability');
    rules.push('make the opening sentence immediately clear and credible');
  }

  if (
    lowerPlatform.includes('instagram') ||
    lowerPlatform.includes('rednote') ||
    lowerPlatform.includes('tiktok') ||
    lowerPlatform.includes('threads')
  ) {
    rules.push('make the opening visually inviting and easy to keep reading');
    rules.push('use line breaks with restraint so the post feels intentional, not gimmicky');
  }

  if (num(polish) >= 67) {
    rules.push('make the formatting feel neat, tasteful, and socially polished');
  }

  if (num(energy) >= 67) {
    rules.push('allow a little more rhythm and movement, but keep the layout clean');
  }

  return rules;
}

export function compileCharacterStrategy({
  platform,
  task,
  notes,
  mode,
  tone,
  polish,
  energy,
  selfFeel,
  vibes
}) {
  const resolvedPlatform = clampText(platform) || 'social media';
  const resolvedMode = clampText(mode) || 'Thoughtful diarist';
  const resolvedFeel = clampText(selfFeel);
  const resolvedVibes = Array.isArray(vibes) ? vibes : [];

  return {
    social_goal: inferSocialGoal(resolvedMode, tone, polish, energy, resolvedFeel, resolvedPlatform),
    reader_effect: inferReaderEffect(resolvedMode, tone, polish, energy),
    distinctiveness_strategy: inferDistinctivenessStrategy(
      resolvedMode, tone, polish, energy, resolvedFeel, resolvedVibes
    ),
    restraint_rules: inferRestraintRules(resolvedMode, tone, polish, resolvedPlatform),
    structure_strategies: inferStructureStrategies(resolvedMode, resolvedPlatform, energy),
    formatting_rules: inferFormattingRules(resolvedPlatform, polish, energy),
    voice_posture: {
      tone_axis: bucket(tone, 'soft / intimate / implied', 'balanced / natural / clear', 'sharp / crisp / assertive'),
      polish_axis: bucket(polish, 'personal / lived-in / human', 'balanced / edited / natural', 'curated / aesthetic / polished'),
      energy_axis: bucket(energy, 'calm / measured / restrained', 'steady / dynamic / controlled', 'expressive / lively / lifted')
    }
  };
}

export function buildDirectPrompt({ platform, task, notes }) {
  return `
You are helping write a post for ${platform}.

Write exactly 3 distinct post drafts.
The drafts should feel natural, human, clear, and usable.
They should look clean and easy to read on-platform.
Prefer short paragraphs and natural line breaks when helpful.
Avoid generic AI phrasing, clichés, and filler.
Do not use emojis unless they feel natural for the platform.
Do not use hashtags unless they feel necessary.
Do not use bullet lists, numbered lists, dash-line formatting, or em dashes in the post body.

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

export function buildCharacterPrompt({
  platform,
  task,
  notes,
  mode,
  tone,
  polish,
  energy,
  selfFeel,
  vibes
}) {
  const strategy = compileCharacterStrategy({
    platform,
    task,
    notes,
    mode,
    tone,
    polish,
    energy,
    selfFeel,
    vibes
  });

  return `
You are helping write a post for ${platform}.

This is the character-shaped generation path.
Your job is not just to change the tone of the writing.
Your job is to make the post feel more socially intentional, more appealing, more distinctive, and more aligned to the intended version of the user.

Write exactly 3 distinct post drafts.

Important:
- Draft 1 should optimize for resonance and emotional fit.
- Draft 2 should optimize for appeal and post-likelihood.
- Draft 3 should optimize for distinctiveness and originality.
- All 3 should still feel natural, believable, and post-ready.
- Make the writing feel curated and thoughtful, not generic.
- Do not make them sound like AI templates.
- Do not mention the sliders, hidden strategy, or character settings.
- Avoid clichés, filler, forced vulnerability, generic life lessons, and corporate tone.
- Make the writing socially legible: something that feels intentional and attractive to encounter on-platform.
- Use specific detail, framing, rhythm, restraint, and formatting to create effect.
- Make the character path meaningfully better than generic generation through curation, not by being louder.
- Do not use bullet lists, numbered lists, dash-line formatting, or em dashes in the post body.
- Make the formatting visually clean and polished.
- Prefer short paragraphs and intentional spacing.
- Use line breaks only when they genuinely improve flow, emphasis, or readability.

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

How they want to come across:
${clampText(selfFeel)}

Vibes:
${(vibes || []).join(', ')}

Voice posture:
- Tone axis: ${strategy.voice_posture.tone_axis}
- Polish axis: ${strategy.voice_posture.polish_axis}
- Energy axis: ${strategy.voice_posture.energy_axis}

Social goal:
${strategy.social_goal}

Desired reader effect:
${strategy.reader_effect}

Distinctiveness strategy:
- ${strategy.distinctiveness_strategy.join('\n- ')}

Restraint rules:
- ${strategy.restraint_rules.join('\n- ')}

Draft structure strategy:
- ${strategy.structure_strategies.join('\n- ')}

Formatting rules:
- ${strategy.formatting_rules.join('\n- ')}
`.trim();
}

export function parseDraftsFromText(text, fallback) {
  try {
    const parsed = JSON.parse(text);
    if (parsed && Array.isArray(parsed.drafts) && parsed.drafts.length) {
      return parsed.drafts.slice(0, 3).map((d, i) => ({
        title: d.title || `Option ${i + 1}`,
        body: d.body || '',
        tone: d.tone || 'Generated'
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
          tone: d.tone || 'Generated'
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
      tone: 'Direct · Clear'
    },
    {
      title: 'What changed for me',
      body: `This post is really about ${task}. I want it to feel natural and readable, without sounding overworked. Here is the version I would probably publish first.`,
      tone: 'Honest · Conversational'
    },
    {
      title: 'Simple reflection',
      body: `Lately I have been thinking about ${task} and how it shifted something in my day-to-day life. I wanted to write it in a way that still feels like me.`,
      tone: 'Reflective · Natural'
    }
  ];
}

export function fallbackDraftsB(task, platform, mode) {
  return [
    {
      title: `${mode} resonance`,
      body: `For ${platform}, this version of me would talk about ${task} in a way that feels more intentional, more emotionally accurate, and easier for someone to connect with immediately.`,
      tone: 'Resonant · Character-shaped'
    },
    {
      title: `${mode} appeal`,
      body: `This version keeps the same topic, ${task}, but frames it more attractively and more clearly so it feels easier to post and more appealing to come across on ${platform}.`,
      tone: 'Appealing · Curated'
    },
    {
      title: `${mode} distinctiveness`,
      body: `I still want to say something real about ${task}, but with a more original angle and a more recognisable point of view that feels specific to this version of me.`,
      tone: 'Distinctive · Original'
    }
  ];
}
