(function() {
  var App, Request, strata, task;
  var __slice = Array.prototype.slice;

  strata = require('strata');

  task = require('./fibers').task;

  Request = require('./request');

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
      return this.app[type](route, task(function(env, returns) {
        var request, response;
        request = new Request(env);
        request.response = function() {
          request.served = true;
          return returns.apply(null, arguments);
        };
        response = callback.call(_this, request);
        if (request.served) return;
        if (Array.isArray(response)) {
          return returns.apply(returns, response);
        } else if (response.body != null) {
          return returns(response.status || 200, response.headers || {}, response.body || '');
        } else {
          return returns(200, {}, response || '');
        }
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
