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

    App.prototype.config = {
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

    App.prototype.route = function(pattern, app, methods) {
      app = context.wrap(app);
      app = this.pool.wrap(app);
      return this.router.route(pattern, app, methods);
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
        return this.config[key] = value;
      }
    };

    App.prototype.addSessions = function() {
      var options;
      options = {};
      if (typeof this.config.sessions === 'object') options = this.config.sessions;
      return this.use(strata.sessionCookie, options);
    };

    App.prototype.addStatic = function() {
      if (fs.existsSync(this.config.public)) {
        return this.use(static, this.config.public, ['index.html']);
      }
    };

    App.prototype.toApp = function() {
      if (this.config.sessions) this.addSessions();
      if (this.config.static) this.addStatic();
      this.run(this.router);
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
