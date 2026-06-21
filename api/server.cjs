const fs = require('fs');
const path = require('path');
const jsonServer = require('json-server');

const dbPath = path.join(__dirname, '../server/db.json');
const routesPath = path.join(__dirname, '../server/routes.json');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const routes = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

const server = jsonServer.create();
const rewriter = jsonServer.rewriter(routes);
const router = jsonServer.router(db);

server.use(jsonServer.defaults());
server.use((req, _res, next) => {
  if (req.url.startsWith('/api/server')) {
    req.url = req.url.replace('/api/server', '/api/v1');
  }
  next();
});
server.use(rewriter);
server.use(router);

module.exports = (req, res) => {
  server(req, res, () => {
    res.status(404).json({ error: 'Not found' });
  });
};
