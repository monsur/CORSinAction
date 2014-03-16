var isSameOrigin = function(req) {
  var host = 'http://' + req.headers['host'];
  var origin = req.headers['origin'];
  return host === origin;
};

