const http = require('http');
const app = require('node-screenlogic-rest/app');

const port = process.env.PORT || 80;

const server = http.createServer(app);

server.listen(port);