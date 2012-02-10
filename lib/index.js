(function() {
  var App, context, helpers, name, _i, _len, _ref;

  require('./ext');

  App = require('./app');

  context = require('./context');

  helpers = require('./helpers');

  _ref = ['coffee', 'eco', 'less', 'mustache'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    name = _ref[_i];
    try {
      require("./templates/" + name);
    } catch (_error) {}
  }

  module.exports = {
    App: App,
    context: context,
    helpers: helpers
  };

}).call(this);
