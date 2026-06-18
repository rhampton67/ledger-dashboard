const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    const store = getStore({
      name: 'ledger-tokens',
      consistency: 'strong',
      siteID: process.env.SITE_ID,
      token: process.env.NETLIFY_BLOBS_TOKEN || process.env.TOKEN,
    });

    // Write a test value
    await store.setJSON('__test__', { ok: true, ts: Date.now() });

    // Read it back
    const result = await store.get('__test__', { type: 'json' });

    // Clean up
    await store.delete('__test__');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Blobs is working correctly',
        readBack: result,
      })
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: e.message })
    };
  }
};
