(function() {
  var App, Context, strata, task;
  var __slice = Array.prototype.slice;

  strata = require('strata');

  task = require('./fibers').task;

  Context = require('./context');

  App = (function() {

    function App() {
      this.app = new strata.Builder;
      this.app.use(strata.commonLogger);
      this.app.use(strata.contentType, 'text/html');
      this.app.use(strata.contentLength);
    }

    App.prototype.use = function() {
      return this.app.use.apply(this.app, arguments);
    };

    App.prototype.route = function(type, route, callback) {
      var _this = this;
      return this.app[type](route, task(function(env, callback) {
        var context, response;
        context = new Context(env, callback);
        response = callback.call(context);
        return context.response(response);
      }));
    };

    App.prototype.get = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.route.apply(this, ['get'].concat(__slice.call(args)));
    };

    App.prototype.post = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.route.apply(this, ['post'].concat(__slice.call(args)));
    };

    App.prototype.put = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.route.apply(this, ['put'].concat(__slice.call(args)));
    };

    App.prototype.del = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.route.apply(this, ['del'].concat(__slice.call(args)));
    };

    App.prototype.toApp = function() {
      return this.app.toApp();
    };

    App.prototype.run = function() {
      return strata.run(this);
    };

    return App;

  })();

  module.exports = App;

}).call(this);
