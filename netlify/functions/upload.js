const fetch = require('node-fetch');
const FormData = require('form-data');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const form = new FormData();
    // The file data is base64 encoded in the event body
    const fileData = Buffer.from(event.body, 'base64');
    
    // We need to get the content-type from the headers
    const contentType = event.headers['content-type'];
    const boundary = contentType.split('boundary=')[1];

    // This is a simplified way to re-construct the multipart form data.
    // It assumes the file is the only part of the form.
    const reconstructedBody = Buffer.concat([
      Buffer.from(`--${boundary}\r\n`),
      Buffer.from(`Content-Disposition: form-data; name="fileToUpload"; filename="image.jpg"\r\n`),
      Buffer.from(`Content-Type: image/jpeg\r\n\r\n`),
      fileData,
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ]);

    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body: event.body, // Pass the original body directly
    });

    if (!response.ok) {
      throw new Error(`Catbox API error: ${response.statusText}`);
    }

    const responseText = await response.text();

    return {
      statusCode: 200,
      body: responseText,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
