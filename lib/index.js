(function() {
  var App, context, ext, helpers, templates;

  require('./ext');

  App = require('./app');

  context = require('./context');

  helpers = require('./helpers');

  templates = require('./templates');

  ext = require('./ext');

  module.exports = {
    App: App,
    context: context,
    helpers: helpers,
    templates: templates,
    ext: ext
  };

}).call(this);
