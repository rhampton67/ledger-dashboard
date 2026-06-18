const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    const store = getStore('ledger-tokens');

    await store.setJSON('__test__', { ok: true, ts: Date.now() });
    const result = await store.get('__test__', { type: 'json' });
    await store.delete('__test__');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Blobs is working correctly', readBack: result })
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: e.message })
    };
  }
};
