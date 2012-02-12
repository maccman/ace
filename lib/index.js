(function() {
  var App, context, helpers, strata, templates;

  require('./ext');

  strata = require('strata');

  App = require('./app');

  context = require('./context');

  helpers = require('./helpers');

  templates = require('./templates');

  module.exports = {
    App: App,
    context: context,
    helpers: helpers,
    templates: templates,
    strata: strata
  };

}).call(this);
