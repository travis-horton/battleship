#!/user/bin/env nodejs
const http = require('http');
const express = require('express');

const app = express();
const server = http.Server(app);
const port = 80;

server.listen(port, function() {
	console.log(`Battleship server listening on ${port}`);
});

app.use(express.static('battleship'));

app.get('/index', function(req, res) {
	res.sendFile(__dirname + 'battleship/index.html');
});
app.get('/', function(req, res) {
	res.sendFile(__dirname + 'battleship/index.html');
});
