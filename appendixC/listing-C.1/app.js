var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var csrf = require('csurf');

var app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(session({
  secret: 'CORSInAction',
  saveUninitialized: true,
  resave: true}));
app.use(csrf());

app.get('/csrftest', function(req, res) {
  var form = '<html><body><form action="/csrftest" method="post">\r\n';
  form += '<input type="text" name="_csrf" \r\n';
  form += '\tvalue="' + req.csrfToken() + '" />\r\n';
  form += '<input type="submit" value="Submit" />\r\n';
  form += '</form></body></html>';
  res.send(form);
});
app.post('/csrftest', function(req, res) {
  res.send('Successfully received CSRF token!');
});

app.use(function(err, req, res, next) {
  res.status(403).send('ERROR parsing CSRF token!');
});

app.listen(2468);
