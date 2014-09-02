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

var createWhitelistValidator = function(whitelist) {
  return function(val) {
    for (var i = 0; i < whitelist.length; i++) {
      if (val === whitelist[i]) {
        return true;
      }
    }
    return false;
  }
};

var originWhitelist = [
  'null',
  'http://localhost:1111'
];

var corsOptions = {
  allowOrigin: createWhitelistValidator(originWhitelist),
  allowCredentials: true,
  shortCircuit: true,
  allowMethods: ['GET', 'DELETE'],
  allowHeaders: function(req) {
    return req.headers['access-control-request-headers'];
  }
};

var handleCors = function(options) {
  return function(req, res, next) {

    if (options.allowOrigin) {
      var origin = req.headers['origin'];
      if (options.allowOrigin(origin)) {
        res.set('Access-Control-Allow-Origin', origin);
      } else if (options.shortCircuit) {
        res.status(403).end();
        return;
      }
      res.set('Vary', 'Origin');
    } else {
      res.set('Access-Control-Allow-Origin', '*');
    }

    if (options.allowCredentials) {
      res.set('Access-Control-Allow-Credentials', 'true');
    }

    if (isPreflight(req)) {
      if (options.allowMethods) {
        res.set('Access-Control-Allow-Methods',
            options.allowMethods.join(','));
      }
      if (typeof(options.allowHeaders) === 'function') {
        var headers = options.allowHeaders(req);
        if (headers) {
          res.set('Access-Control-Allow-Headers', headers);
        }
      } else if (options.allowHeaders) {
        res.set('Access-Control-Allow-Headers',
            options.allowHeaders.join(','));
      }
      res.set('Access-Control-Max-Age', '120');
      res.status(204).end();
      return;
    } else {
      res.set('Access-Control-Expose-Headers', 'X-Powered-By');
    }
    next();
  }
};

var SERVER_PORT = 9999;
var serverapp = express();
serverapp.use(cookieParser());
serverapp.use(express.static(__dirname));
serverapp.use(handleCors(corsOptions));
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
