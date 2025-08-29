const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // This acts as a simple pass-through proxy.
    // It forwards the exact body and content-type header from the browser to Catbox.
    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      headers: {
        'Content-Type': event.headers['content-type'],
      },
      body: event.body,
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`Catbox API Error (${response.status}): ${responseText}`);
    }

    return {
      statusCode: 200,
      body: responseText,
    };
  } catch (error) {
    console.error('Proxy Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
