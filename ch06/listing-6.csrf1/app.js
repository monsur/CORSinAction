var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var csrf = require('csurf');

var app = express();
app.use(bodyParser());
app.use(cookieParser());
app.use(session({secret: 'CORSInAction'}));
app.use(csrf());
app.use(function(err, req, res, next) {
  res.send('ERROR parsing CSRF token!');
});
app.get('/csrftest', function(req, res) {
  var form = '<html><body><form action="/csrftest" method="post">';
  form += '<input type="text" name="_csrf" value="' + req.csrfToken() + '" />';
  form += '<input type="submit" value="Submit" />';
  form += '</form></body></html>';
  res.send(form);
});
app.post('/csrftest', function(req, res) {
  res.send('Successfully received CSRF token!');
});
app.listen(9999);
