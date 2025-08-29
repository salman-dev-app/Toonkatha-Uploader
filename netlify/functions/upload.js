const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Pass the headers and body from the client directly to Catbox
    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      headers: {
        // Let node-fetch set the Content-Type header with the correct boundary
        // 'Content-Type': event.headers['content-type'], 
      },
      body: event.body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Catbox API Error: ${response.status} - ${errorText}`);
    }

    const responseText = await response.text();

    return {
      statusCode: 200,
      body: responseText,
    };
  } catch (error) {
    console.error('Proxy Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
