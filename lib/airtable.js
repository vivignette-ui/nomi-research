const API_ROOT = 'https://api.airtable.com/v0';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

export function getAirtableConfig() {
  return {
    token: requireEnv('AIRTABLE_TOKEN'),
    baseId: requireEnv('AIRTABLE_BASE_ID'),
    responsesTable: process.env.AIRTABLE_RESPONSES_TABLE || 'responses',
    waitlistTable: process.env.AIRTABLE_WAITLIST_TABLE || 'waitlist',
  };
}

export async function createRecord(table, fields) {
  const { token, baseId } = getAirtableConfig();
  const response = await fetch(`${API_ROOT}/${baseId}/${encodeURIComponent(table)}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || `Airtable request failed with ${response.status}`);
  }
  return data;
}
