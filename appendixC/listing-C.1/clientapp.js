var express = require('express');

var CLIENT_PORT = 1111;
var clientapp = express();
clientapp.set('views', __dirname);
clientapp.set('view engine', 'jade');
clientapp.use(express.static(__dirname));
clientapp.get('/newpost', function(req, res){
  res.render('newpost', { });
});
clientapp.listen(CLIENT_PORT, function() {
  console.log('Started client at http://localhost:' + CLIENT_PORT);
});
