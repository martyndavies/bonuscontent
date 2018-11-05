const Koa = require('koa');
const router = require('koa-route');
const bodyParser = require('koa-bodyparser');
const handler = require('./handler');
const port = process.env.PORT || 3000;

const server = new Koa();

server.use(bodyParser());

server.use(router.post('/inbound', handler.inbound));

server.listen(port, () => console.log(`Server listening on ${port}`));
