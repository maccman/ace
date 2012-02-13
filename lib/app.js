(function() {
  var App, context, fibers, filter, format, fs, method, methods, path, static, strata, templates, type,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __slice = Array.prototype.slice;

  fs = require('fs');

  path = require('path');

  strata = require('strata');

  fibers = require('./fibers');

  context = require('./context');

  static = require('./static');

  filter = require('./filter');

  templates = require('./templates');

  format = require('./format');

  App = (function(_super) {

    __extends(App, _super);

    App.prototype.defaults = {
      static: true,
      sessions: true,
      port: 1982,
      bind: '0.0.0.0',
      root: process.cwd(),
      views: './views',
      assets: './assets',
      public: './public',
      layout: 'layout',
      logging: true
    };

    App.prototype.context = context;

    App.prototype.resolve = templates.resolve;

    function App() {
      App.__super__.constructor.call(this);
      this.settings = {};
      this.set(this.defaults);
      this.settings.layout = this.resolve(this.settings.layout, false);
      if (!fs.existsSync(this.settings.public)) this.settings.static = false;
      this.pool = new fibers.Pool;
      this.router = new strata.Router;
    }

    App.prototype.before = function(conditions, callback) {
      if (!callback) {
        callback = conditions;
        conditions = true;
      }
      this.beforeFilters || (this.beforeFilters = []);
      return this.beforeFilters.push([conditions, callback]);
    };

    App.prototype.rewrite = function(pattern, replacement) {
      return this.use(strata.rewrite, pattern, replacement);
    };

    App.prototype.root = function(replacement) {
      return this.rewrite('/', replacement);
    };

    App.prototype.route = function(pattern, app, methods) {
      return this.router.route(pattern, context.wrap(app, this), methods);
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

    App.prototype.toApp = function() {
      var options,
        _this = this;
      this.use(strata.contentType, 'text/html');
      this.use(strata.contentLength);
      if (this.settings.logging) this.use(strata.commonLogger);
      if (options = this.settings.sessions) {
        if (options === true) options = {};
        this.use(strata.sessionCookie, options);
      }
      if (this.settings.static) {
        this.use(static, this.settings.public, ['index.html']);
      }
      this.use(format);
      if (this.beforeFilters) this.use(filter, this.beforeFilters, this);
      this.run(function(env, callback) {
        return _this.pool.wrap(_this.router.toApp())(env, callback);
      });
      return App.__super__.toApp.apply(this, arguments);
    };

    App.prototype.serve = function(options) {
      var key, value;
      if (options == null) options = {};
      for (key in options) {
        value = options[key];
        if (value != null) this.settings[key] = value;
      }
      return strata.run(this, this.settings);
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

  for (type in methods) {
    method = methods[type];
    App.prototype[type] = (function(method) {
      return function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return this.route.apply(this, __slice.call(args).concat([method]));
      };
    })(method);
  }

  module.exports = App;

}).call(this);
