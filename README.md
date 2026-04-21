# Nomi research prototype starter (Airtable version)

This starter keeps your sequential research flow intact:
1. collect one post task
2. generate Version A directly
3. shape one social self
4. generate Version B through that self
5. capture comparison answers and open feedback
6. optionally capture a Nyla waitlist email

## Stack
- Vercel for hosting and serverless API routes
- OpenAI for content generation
- Airtable for storage

## Files
- `index.html` — prototype UI, wired to real APIs
- `api/generate-a.js` — calls OpenAI for direct generation
- `api/generate-b.js` — calls OpenAI for self-shaped generation
- `api/save-response.js` — stores ratings, forced-choice answers, and feedback in Airtable
- `api/join-waitlist.js` — stores the Nyla waitlist email in Airtable
- `.env.example` — environment variables you need in Vercel

## Deploy steps
1. Create an Airtable base named `Nomi Research`.
2. Add a table named `responses` and a table named `waitlist`.
3. Add the columns listed below.
4. Create an Airtable personal access token with access to that base.
5. Create a Vercel project from this folder.
6. Add the environment variables from `.env.example` in Vercel.
7. Deploy.

## Airtable columns
### responses
- `session_id` (single line text)
- `task` (long text)
- `notes` (long text)
- `version_a_generation_id` (single line text)
- `version_b_generation_id` (single line text)
- `version_a_selected_index` (number)
- `version_b_selected_index` (number)
- `version_a_selected_draft` (long text)
- `version_b_selected_draft` (long text)
- `version_a_edit_score` (number)
- `version_a_match_score` (number)
- `version_b_edit_score` (number)
- `version_b_match_score` (number)
- `self_mode` (single line text)
- `self_tone` (number)
- `self_polish` (number)
- `self_energy` (number)
- `self_feel` (long text)
- `self_vibes` (single line text)
- `compare_match` (single line text)
- `compare_post` (single line text)
- `compare_edit` (single line text)
- `compare_ease` (single line text)
- `compare_next_time` (single line text)
- `action_selections` (long text)
- `save_self_intent` (single line text)
- `variation_intent` (single line text)
- `open_feedback` (long text)
- `nyla_interest_score` (number)
- `nyla_waitlist_intent` (single line text)
- `created_at` (single line text)

### waitlist
- `email` (email)
- `session_id` (single line text)
- `source` (single line text)
- `created_at` (single line text)

## Local development
```bash
npm install
npm run dev
```

## Notes
- If OpenAI is not configured or errors, the UI falls back to demo drafts so the flow still works.
- The current design preserves your fixed order: A first, then B.
