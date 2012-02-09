(function() {
  var App, context, fibers, method, methods, strata,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __slice = Array.prototype.slice;

  strata = require('strata');

  fibers = require('./fibers');

  context = require('./context');

  App = (function(_super) {

    __extends(App, _super);

    function App() {
      App.__super__.constructor.apply(this, arguments);
      this.pool = new fibers.Pool;
      this.router = new strata.Router;
      this.use(strata.commonLogger);
      this.use(strata.contentType, 'text/html');
      this.use(strata.contentLength);
      this.run(this.router);
    }

    App.prototype.route = function(pattern, app, methods) {
      app = context.wrap(app);
      app = this.pool.wrap(app);
      return this.router.route(pattern, app, methods);
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
