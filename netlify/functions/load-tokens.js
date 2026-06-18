const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  try {
    const { profile } = JSON.parse(event.body || '{}');
    if (!profile) throw new Error('profile is required');

    const store = getStore({
      name: 'ledger-tokens',
      consistency: 'strong',
      siteID: process.env.SITE_ID,
      token: process.env.NETLIFY_BLOBS_TOKEN || process.env.TOKEN,
    });

    let items = [];
    try {
      items = await store.get(profile, { type: 'json' }) || [];
    } catch (e) {
      // Key doesn't exist yet — return empty array
      items = [];
    }

    console.log(`Loaded ${items.length} items for profile: ${profile}`);
    return { statusCode: 200, headers, body: JSON.stringify({ items }) };
  } catch (e) {
    console.error('load-tokens error:', e.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message, items: [] }) };
  }
};
