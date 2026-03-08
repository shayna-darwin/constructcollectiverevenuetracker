const https = require('https');

exports.handler = async function(event) {
  const endpoint = event.queryStringParameters?.endpoint || '/lead/';
  const apiKey   = 'api_4N1ISDKbAfmnk9Q8FAWobG.1vBLM0yUViFV0jT5qhwaOR';
  const auth     = Buffer.from(apiKey + ':').toString('base64');

  const url = 'https://api.close.com/api/v1' + endpoint;

  try {
    const data = await new Promise((resolve, reject) => {
      const req = https.get(url, {
        headers: {
          'Authorization': 'Basic ' + auth,
          'Content-Type': 'application/json'
        }
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try { resolve(JSON.parse(body)); }
          catch(e) { reject(new Error('Invalid JSON: ' + body)); }
        });
      });
      req.on('error', reject);
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch(e) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: e.message })
    };
  }
};
