(function() {
  var Context, Request;

  Request = require('./request');

  Context = (function() {

    Context.include = function(obj) {
      var key, value, _results;
      _results = [];
      for (key in obj) {
        value = obj[key];
        _results.push(this.prototype[key] = value);
      }
      return _results;
    };

    function Context(env, callback) {
      this.env = env;
      this.callback = callback;
      this.request = new Request(env);
    }

    Context.prototype.response = function(response) {
      if (this.served) return false;
      this.served = true;
      if (Array.isArray(response)) {
        return this.callback.apply(this, response);
      } else if (response.body != null) {
        return this.callback(response.status || 200, response.headers || {}, response.body || '');
      } else {
        return this.callback(200, {}, response || '');
      }
    };

    Context.prototype.__defineGetter__('cookies', function() {
      return this.request.cookies;
    });

    Context.prototype.__defineGetter__('params', function() {
      return this.request.params;
    });

    Context.prototype.__defineGetter__('query', function() {
      return this.request.query;
    });

    Context.prototype.__defineGetter__('body', function() {
      return this.request.body;
    });

    return Context;

  })();

  module.exports = Context;

}).call(this);
