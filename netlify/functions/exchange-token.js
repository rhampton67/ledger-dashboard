exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const { public_token } = JSON.parse(event.body || '{}');

  try {
    const res = await fetch(`https://${process.env.PLAID_ENV || 'sandbox'}.plaid.com/item/public_token/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.PLAID_CLIENT_ID,
        secret:    process.env.PLAID_SECRET,
        public_token,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error_message || `Plaid error ${res.status}`);
    return { statusCode: 200, headers, body: JSON.stringify({ access_token: data.access_token }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
