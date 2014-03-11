(function() {
  var options = {};
  var headers = {};
  var isCors = false;
  var isPreflight = false;

  var start = function(req, resp) {
  };

  var middleware = {
    'allowOrigins': function(req, resp) {
      return true;
    },

    'allowCredentials': function(req, resp) {
      return true;
    },

    'allowMethods': function(req, resp) {
      return true;
    },

    'allowHeaders': function(req, resp) {
      return true;
    },

    'maxAge': function(req, resp) {
      return true;
    },

    'exposeHeaders': function(req, resp) {
      return true;
    },

  };

  module.exports = function(o) {
    options = o || {};
    return function(req, resp, next) {
      start(res, resp);
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
