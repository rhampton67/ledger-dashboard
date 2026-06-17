exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const body = JSON.parse(event.body || '{}');
  const userId = body.userId || 'default-user';

  try {
    const res = await fetch(`https://${process.env.PLAID_ENV || 'sandbox'}.plaid.com/link/token/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.PLAID_CLIENT_ID,
        secret:    process.env.PLAID_SECRET,
        user: { client_user_id: userId },
        client_name: 'Ledger Dashboard',
        products: ['transactions'],
        country_codes: ['US'],
        language: 'en',
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error_message || `Plaid error ${res.status}`);
    return { statusCode: 200, headers, body: JSON.stringify({ link_token: data.link_token }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
