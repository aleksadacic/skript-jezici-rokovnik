require("dotenv").config();

const http = require('http');

const app = require('./app');

const server = http.createServer(app);
const port = 3000;
server.listen(process.env.APP_PORT, function () {
    console.log('Started listening on http://localhost:' + process.env.APP_PORT);
});