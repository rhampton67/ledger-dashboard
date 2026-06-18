const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  try {
    const { profile, items } = JSON.parse(event.body || '{}');
    if (!profile) throw new Error('profile is required');
    if (!Array.isArray(items)) throw new Error('items must be an array');

    const store = getStore('ledger-tokens');
    await store.setJSON(profile, items);

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, count: items.length }) };
  } catch (e) {
    console.error('save-tokens error:', e.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
