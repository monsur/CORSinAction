var express = require('express');
var cookieParser = require('cookie-parser');

var POSTS = {
  '1': {'post': 'This is the first blog post.'},
  '2': {'post': 'This is the second blog post.'},
  '3': {'post': 'This is the third blog post.'}
};

var isPreflight = function(req) {
  var isHttpOptions = req.method === 'OPTIONS';
  var hasOriginHeader = req.headers['origin'];
  var hasRequestMethod = req.headers['access-control-request-method'];
  return isHttpOptions && hasOriginHeader && hasRequestMethod;
};

var handleCors = function(req, res, next) {
  res.set('Access-Control-Allow-Origin', 'http://localhost:1111');
  if (isPreflight(req)) {
    res.set('Access-Control-Allow-Methods', 'GET, DELETE');
    res.set('Access-Control-Allow-Headers',
            'Timezone-Offset, Sample-Source');
    res.set('Access-Control-Max-Age', '120');
    res.status(204).end();
    return;
  }
  next();
};

var SERVER_PORT = 9999;
var serverapp = express();
serverapp.use(cookieParser());
serverapp.use(express.static(__dirname));
serverapp.use(handleCors);
serverapp.get('/api/posts', function(req, res) {
  res.json(POSTS);
});
serverapp.delete('/api/posts/:id', function(req, res) {
  if (req.cookies['username'] === 'owner') {
    delete POSTS[req.params.id];
    res.status(204).end();
  } else {
    res.status(403).end();
  }
});
serverapp.listen(SERVER_PORT, function() {
  console.log('Started server at http://127.0.0.1:' + SERVER_PORT);
});

var CLIENT_PORT = 1111;
var clientapp = express();
clientapp.use(express.static(__dirname));
clientapp.listen(CLIENT_PORT, function() {
  console.log('Started client at http://localhost:' + CLIENT_PORT);
});
