(function() {
  var options = {};
  var headers = {};
  var isCors = false;
  var isPreflight = false;

  var start = function(res, resp) {
  };

  var middleware = {
    'allowOrigins': function(res, resp) {
      return true;
    },

    'allowCredentials': function(res, resp) {
      return true;
    },

    'allowMethods': function(res, resp) {
      return true;
    },

    'allowHeaders': function(res, resp) {
      return true;
    },

    'maxAge': function(res, resp) {
      return true;
    },

    'exposeHeaders': function(res, resp) {
      return true;
    },

  };

  module.exports = function(o) {
    options = o || {};
    return function(res, resp, next) {
      start(res, resp);
      for (var name in middleware) {
        var status = middleware[name].call(this, res, resp);
        if (!status) {
          break;
        }
      }
      for (var name in headers) {
        resp[name] = headers[name];
      }
      next();
    };
  };
})();
