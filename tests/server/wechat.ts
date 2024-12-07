import http, { IncomingMessage, ServerResponse } from 'http';
import crypto from 'crypto';
import { URL } from 'url';
import { wxSdk, RedisCacheProvider } from '../../src/lib/sdk';
import { Redis } from 'ioredis';

// Helper function to compute SHA-1 hash
function sha1(str: string): string {
  return crypto.createHash('sha1').update(str).digest('hex');
}

// Token for validation (replace with your actual token)
const TOKEN: string = process.env.wx_token || 'abcdef';


const routes = {
  '/wechat': (req, res)=> {
      // Parse the URL and query parameters
      const url = new URL(req.url, `http://${req.headers.host}`);
      const signature = url.searchParams.get('signature') || '';
      const timestamp = url.searchParams.get('timestamp') || '';
      const nonce = url.searchParams.get('nonce') || '';
      const echostr = url.searchParams.get('echostr') || '';

      // Validate token
      const str = [TOKEN, timestamp, nonce].sort().join('');
      const hash = sha1(str);

      if (hash === signature) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(echostr); // Return echostr on successful validation
      } else {
        res.writeHead(401, { 'Content-Type': 'text/plain' });
        res.end('Token validation failed');
      }
  },
  '/cgi-bin/token': async (req, res)=> {
    try {
      const sdkInstance = wxSdk({
        appId: 'wx95e5a58207fb5f67',
        appSecret: '282323a19761e2baba5e5b24ad60fa0f',
        cacheProvider: new RedisCacheProvider(new Redis()),
       });
      const response = await sdkInstance.authenticate();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  }
}

// Handle incoming requests
function handleRequest(req: IncomingMessage, res: ServerResponse): void {
  if (req.method === 'GET') {
    // Parse the URL and query parameters
    // loop through routes
    for (const [route, handler] of Object.entries(routes)) {
      if (req.url?.startsWith(route)) {
        handler(req, res);
        return;
      }
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  } else {
    // Handle non-GET requests or invalid paths
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}

// Create and start the server
const PORT: number = Number(process.env.PORT) || 3000;
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
