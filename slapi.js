const http = require('http');
const app = require('node-screenlogic-rest/app');

const port = process.env.PORT || 80;

const server = http.createServer(app);

server.listen(port);

var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;

console.log(dateTime + ' - slapid started');