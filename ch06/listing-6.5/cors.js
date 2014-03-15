(function() {
  var options = {};
  var headers = {};
  var isCors = false;
  var isPreflight = false;

  var middleware = {
    'start': function(req, resp) {
      var hasOriginHeader = req.headers['origin'];
      if (hasOriginHeader) {
        isCors = true;
        var isHttpOptions = req.method === 'OPTIONS';
        var hasRequestMethod = req.headers['access-control-request-method'];
        if (isHttpOptions && hasRequestMethod) {
          isPreflight = true;
        }
      }
      return true;
    },

    'allowOrigins': function(req, resp) {
      var acaoValue = null;
      if (options.originValidator) {
        var origin = resp.getHeader('origin');
        if (options.originValidator(origin)) {
          acaoValue = origin;
        }
      } else {
        acaoValue = '*';
      }
      headers['Access-Control-Allow-Origin'] = acaoValue;
      return true;
    },

    'allowCredentials': function(req, resp) {
      // TODO
      return true;
    },

    'allowMethods': function(req, resp) {
      // TODO
      return true;
    },

    'allowHeaders': function(req, resp) {
      // TODO
      return true;
    },

    'maxAge': function(req, resp) {
      // TODO
      return true;
    },

    'exposeHeaders': function(req, resp) {
      // TODO
      return true;
    },

  };

  module.exports = function(o) {
    options = o || {};
    return function(req, resp, next) {
      for (var name in middleware) {
        var status = middleware[name].call(this, req, resp);
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
