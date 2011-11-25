(function() {
  var App, context, fibers, strata;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  strata = require('strata');

  fibers = require('./fibers');

  context = require('./context');

  App = (function() {

    __extends(App, strata.Builder);

    function App() {
      App.__super__.constructor.apply(this, arguments);
      this.use(strata.commonLogger);
      this.use(strata.contentType, 'text/html');
      this.use(strata.contentLength);
    }

    App.prototype.route = function(pattern, app, methods) {
      app = context.wrap(app);
      app = fibers.wrap(app);
      return App.__super__.route.call(this, pattern, app, methods);
    };

    return App;

  })();

  module.exports = App;

}).call(this);
