const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const publicDir = path.join(__dirname, 'public');
const types = { '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };

function createServer() {
  return http.createServer((request, response) => {
    const url = new URL(request.url, 'http://localhost');
    const route = url.pathname === '/' ? '/index.html' : url.pathname === '/products' || url.pathname.startsWith('/products/') || url.pathname === '/astronaut-application' ? `${url.pathname}.html` : url.pathname;
    const file = path.resolve(publicDir, `.${route}`);
    if (!file.startsWith(`${publicDir}${path.sep}`)) return response.writeHead(404).end('Not found');
    fs.readFile(file, (error, contents) => {
      if (error) return response.writeHead(404).end('Not found');
      response.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' });
      response.end(contents);
    });
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  createServer().listen(port, () => console.log(`Test Automation Sandbox running at http://localhost:${port}`));
}

module.exports = { createServer };
