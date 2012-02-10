(function() {
  var App, context, fibers, fs, method, methods, path, static, strata,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __slice = Array.prototype.slice;

  fs = require('fs');

  path = require('path');

  strata = require('strata');

  fibers = require('./fibers');

  context = require('./context');

  static = require('./static');

  App = (function(_super) {

    __extends(App, _super);

    App.prototype.settings = {
      static: true,
      sessions: true,
      port: 1982,
      bind: '0.0.0.0',
      root: process.cwd(),
      views: './views',
      public: './public'
    };

    function App() {
      App.__super__.constructor.call(this);
      this.pool = new fibers.Pool;
      this.router = new strata.Router;
      this.use(strata.commonLogger);
      this.use(strata.contentType, 'text/html');
      this.use(strata.contentLength);
    }

    App.prototype.before = function(filter) {
      filter = context.wrap(filter);
      return this.use(function(app) {
        return function(env, callback) {
          return app(env, function() {
            var original;
            original = arguments;
            return filter(env, function(status) {
              if (status === 200) {
                return callback.apply(null, original);
              } else {
                return callback.apply(null, arguments);
              }
            });
          });
        };
      });
    };

    App.prototype.route = function(pattern, app, methods) {
      return this.router.route(pattern, context.wrap(app), methods);
    };

    App.prototype.set = function(key, value) {
      var k, v, _results;
      if (typeof key === 'object') {
        _results = [];
        for (k in key) {
          v = key[k];
          _results.push(this.set(k, v));
        }
        return _results;
      } else {
        return this.settings[key] = value;
      }
    };

    App.prototype.useSessions = function() {
      var options;
      options = {};
      if (typeof this.settings.sessions === 'object') {
        options = this.settings.sessions;
      }
      return this.use(strata.sessionCookie, options);
    };

    App.prototype.useStatic = function() {
      if (fs.existsSync(this.settings.public)) {
        return this.use(static, this.settings.public, ['index.html']);
      }
    };

    App.prototype.toApp = function() {
      var _this = this;
      if (this.settings.sessions) this.useSessions();
      if (this.settings.static) this.useStatic();
      this.run(function(env, callback) {
        return _this.pool.wrap(_this.router.toApp())(env, callback);
      });
      return App.__super__.toApp.apply(this, arguments);
    };

    return App;

  })(strata.Builder);

  methods = {
    get: ['GET', 'HEAD'],
    post: 'POST',
    put: 'PUT',
    del: 'DELETE',
    head: 'HEAD',
    options: 'OPTIONS'
  };

  for (method in methods) {
    App.prototype[method] = (function(method) {
      return function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return this.route.apply(this, __slice.call(args).concat([method]));
      };
    })(method);
  }

  module.exports = App;

}).call(this);
