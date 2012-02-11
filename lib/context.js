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

    Context.wrap = function(app, base) {
      return function(env, callback) {
        var context, result;
        context = new Context(env, callback, base);
        result = app.call(context, env, callback);
        return context.send(result);
      };
    };

    function Context(env, callback, app) {
      this.env = env;
      this.callback = callback;
      this.app = app != null ? app : {};
      this.request = new strata.Request(this.env);
      this.response = new strata.Response;
    }

    Context.prototype.send = function(result) {
      if (result === false) return false;
      if (this.served) return false;
      this.served = true;
      if (Array.isArray(result)) {
        this.response.status = result[0];
        this.response.headers = result[1];
        this.response.body = result[3];
      } else if (typeof result === 'integer') {
        this.response.status = result;
      } else if (result instanceof strata.Response) {
        this.response = result;
      } else {
        this.response.body = result;
      }
      return this.response.send(this.callback);
    };

    Context.prototype.setter = Context.prototype.__defineSetter__;

    Context.prototype.getter = Context.prototype.__defineGetter__;

    Context.prototype.getter('cookies', function() {
      return this.request.cookies.bind(this.request).wait();
    });

    Context.prototype.getter('params', function() {
      return this.request.params.bind(this.request).wait();
    });

    Context.prototype.getter('query', function() {
      return this.request.query.bind(this.request).wait();
    });

    Context.prototype.getter('body', function() {
      return this.request.body.bind(this.request).wait();
    });

    Context.prototype.getter('route', function() {
      return this.env.route;
    });

    Context.prototype.getter('settings', function() {
      return this.app.settings;
    });

    Context.prototype.getter('session', function() {
      var _base;
      return (_base = this.env).session || (_base.session = {});
    });

    Context.prototype.setter('session', function(value) {
      return this.env.session = value;
    });

    Context.prototype.getter('status', function() {
      return this.response.status;
    });

    Context.prototype.setter('status', function(value) {
      return this.response.status = value;
    });

    Context.prototype.getter('headers', function() {
      return this.response.headers;
    });

    Context.prototype.setter('contentType', function(value) {
      return this.response.headers['Content-Type'] = value;
    });

    Context.prototype.setter('body', function(value) {
      return this.response.body = value;
    });

    Context.prototype.accept = function(type) {
      return this.request.accept(type);
    };

    return Context;

  })();

  module.exports = Context;

}).call(this);
