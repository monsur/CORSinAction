var express = require('express');
var cors = require('./cors');

var POSTS = {
  '1': {'post': 'This is the first blog post.'},
  '2': {'post': 'This is the second blog post.'},
  '3': {'post': 'This is the third blog post.'}
};

var createWhitelistValidator = function(whitelist) {
  return function(val) {
    for (var i = 0; i < whitelist.length; i++) {
      if (val == whitelist[i]) {
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
  originValidator: createWhitelistValidator(originWhitelist)
};

var SERVER_PORT = 9999;
var serverapp = express();
serverapp.use(express.cookieParser());
serverapp.use(express.static(__dirname));
serverapp.use(cors(corsOptions));
serverapp.get('/api/posts', function(req, res) {
  res.json(POSTS);
});
serverapp.delete('/api/posts/:id', function(req, res) {
  if (req.cookies['username'] === 'owner') {
    delete POSTS[req.params.id];
    res.send(204);
  } else {
    res.send(401);
  }
});
serverapp.listen(SERVER_PORT);
console.log('Started server at http://localhost:' + SERVER_PORT);

var CLIENT_PORT = 1111;
var clientapp = express();
clientapp.use(express.static(__dirname));
clientapp.listen(CLIENT_PORT);
console.log('Started client at http://localhost:' + CLIENT_PORT);
