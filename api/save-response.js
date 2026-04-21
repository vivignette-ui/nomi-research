import { createRecord, getAirtableConfig } from '../lib/airtable.js';

function serialize(value) {
  if (value == null) return '';
  return typeof value === 'string' ? value : JSON.stringify(value);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const payload = req.body || {};
    const { sessionId, task, notes, versionA, versionB, comparison, persistence, nyla } = payload;
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    const { responsesTable } = getAirtableConfig();
    await createRecord(responsesTable, {
      session_id: sessionId,
      task: task || '',
      notes: notes || '',
      version_a_generation_id: versionA?.generationId || '',
      version_b_generation_id: versionB?.generationId || '',
      version_a_selected_index: versionA?.selectedDraftIndex ?? '',
      version_b_selected_index: versionB?.selectedDraftIndex ?? '',
      version_a_selected_draft: serialize(versionA?.selectedDraft),
      version_b_selected_draft: serialize(versionB?.selectedDraft),
      version_a_edit_score: versionA?.editScore ?? '',
      version_a_match_score: versionA?.matchScore ?? '',
      version_b_edit_score: versionB?.editScore ?? '',
      version_b_match_score: versionB?.matchScore ?? '',
      self_mode: versionB?.mode || '',
      self_tone: versionB?.tone ?? '',
      self_polish: versionB?.polish ?? '',
      self_energy: versionB?.energy ?? '',
      self_feel: versionB?.selfFeel || '',
      self_vibes: (versionB?.vibes || []).join(', '),
      compare_match: comparison?.betterMatch || '',
      compare_post: comparison?.moreLikelyToPost || '',
      compare_edit: comparison?.lessEditing || '',
      compare_ease: comparison?.easierResult || '',
      compare_next_time: comparison?.nextTimePath || '',
      action_selections: (persistence?.actionSelections || []).join(', '),
      save_self_intent: persistence?.saveSelfIntent || '',
      variation_intent: persistence?.variationIntent || '',
      open_feedback: persistence?.openFeedback || '',
      nyla_interest_score: nyla?.interestScore ?? '',
      nyla_waitlist_intent: nyla?.waitlistIntent || '',
      created_at: new Date().toISOString(),
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Failed to save response' });
  }
}
