(function() {
  var options = {};
  var headers = {};
  var isPreflight = false;

  var start = function(req, resp) {
    var isHttpOptions = req.method === 'OPTIONS';
    var hasOriginHeader = req.headers['origin'];
    var hasRequestMethod = req.headers['access-control-request-method'];
    isPreflight = isHttpOptions && hasOriginHeader && hasRequestMethod;
    return true;
  };

  var allowOrigins = function(req, resp) {
    if (options.originValidator) {
      var origin = req.headers['origin'];
      if (options.originValidator(origin)) {
        headers['Access-Control-Allow-Origin'] = origin;
        headers['Vary'] = 'Origin';
      }
    } else {
      headers['Access-Control-Allow-Origin'] = '*';
    }
    return true;
  };

  var allowCredentials = function(req, resp) {
    return true;
  };

  var allowMethods = function(req, resp) {
    return true;
  };

  var allowHeaders = function(req, resp) {
    return true;
  };

  var maxAge = function(req, resp) {
    return true;
  };

  var exposeHeaders = function(req, resp) {
    return true;
  };

  var corsFunctions = [start, allowOrigins, allowCredentials,
      allowMethods, allowHeaders, maxAge, exposeHeaders];

  module.exports = function(o) {
    options = o || {};
    return function(req, resp, next) {
      headers = {};
      for (var i = 0; i < corsFunctions.length; i++) {
        var func = corsFunctions[i];
        var status = func(req, resp);
        if (!status) {
          break;
        }
      }
      for (var name in headers) {
        resp.set(name, headers[name]);
      }
      next();
    };
  };
})();
