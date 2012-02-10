(function() {
  var Context, strata;

  strata = require('strata');

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
      this.request = new strata.Request(this.env);
    }

    Context.prototype.response = function(response) {
      if (response === false) return false;
      if (this.served) return false;
      this.served = true;
      if (Array.isArray(response)) {
        return this.callback.apply(this, response);
      } else if ((response != null ? response.body : void 0) != null) {
        return this.callback(response.status || 200, response.headers || {}, response.body || '');
      } else {
        return this.callback(200, {}, response || '');
      }
    };

    Context.prototype.__defineGetter__('cookies', function() {
      return this.request.cookies.bind(this.request).wait();
    });

    Context.prototype.__defineGetter__('params', function() {
      return this.request.params.bind(this.request).wait();
    });

    Context.prototype.__defineGetter__('query', function() {
      return this.request.query.bind(this.request).wait();
    });

    Context.prototype.__defineGetter__('body', function() {
      return this.request.body.bind(this.request).wait();
    });

    Context.prototype.__defineGetter__('route', function() {
      return this.env.route;
    });

    Context.prototype.__defineGetter__('session', function() {
      return this.env.session;
    });

    Context.prototype.__defineSetter__('session', function(value) {
      return this.env.session = value;
    });

    Context.wrap = function(app) {
      return function(env, callback) {
        var context, result;
        context = new Context(env, callback);
        result = app.call(context, env, callback);
        return context.response(result);
      };
    };

    return Context;

  })();

  module.exports = Context;

}).call(this);
