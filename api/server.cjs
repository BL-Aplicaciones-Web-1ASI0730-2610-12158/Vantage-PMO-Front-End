const jsonServer = require('json-server');
const db = require('../server/db.json');
const routes = require('../server/routes.json');

const server = jsonServer.create();
const rewriter = jsonServer.rewriter(routes);
const router = jsonServer.router(db);

server.use(jsonServer.defaults());

server.use((req, _res, next) => {
  const url = new URL(req.url, 'http://localhost');
  const route = url.searchParams.get('route');

  if (route) {
    url.searchParams.delete('route');
    const query = url.searchParams.toString();
    req.url = `/api/v1/${route}${query ? `?${query}` : ''}`;
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
