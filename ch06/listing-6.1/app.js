var express = require('express');
var cors = require('./cors');

var SERVER_PORT = 9999;
var serverapp = express();
serverapp.use(cors({}));
serverapp.get('*', function(res, resp) {resp.send(200);});
serverapp.listen(SERVER_PORT);
console.log('Started server at http://localhost:' + SERVER_PORT);
