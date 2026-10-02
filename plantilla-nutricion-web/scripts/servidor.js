// Servidor estático mínimo que imita a GitHub Pages: sirve la carpeta padre,
// de modo que la web vive bajo /plantilla-psicologia-web/, y responde 404 con
// el 404.html propio. node scripts/servidor.js [puerto]
const http = require('http');
const fs = require('fs');
const path = require('path');
const RAIZ = path.join(__dirname, '..', '..');
const PREFIJO = '/' + path.basename(path.join(__dirname, '..')) + '/';
const TIPOS = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json', '.woff2': 'font/woff2' };
http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0]);
  if (u.endsWith('/')) u += 'index.html';
  const f = path.join(RAIZ, path.normalize(u));
  if (f.startsWith(RAIZ) && fs.existsSync(f) && fs.statSync(f).isFile()) {
    res.writeHead(200, { 'content-type': TIPOS[path.extname(f)] || 'application/octet-stream' });
    return fs.createReadStream(f).pipe(res);
  }
  res.writeHead(404, { 'content-type': TIPOS['.html'] });
  fs.createReadStream(path.join(RAIZ, PREFIJO, '404.html')).pipe(res);
}).listen(+process.argv[2] || 8765);
