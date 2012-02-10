(function() {
  var Mu, compile, context, path, view;

  path = require('path');

  context = require('../context');

  Mu = require('mu');

  compile = function(path, context) {
    var fiber;
    fiber = Fiber.current;
    Mu.compile(path, function(err, parsed) {
      if (err) fiber.throwInto(err);
      return fiber.run(Mu.render(template, context));
    });
    return yield();
  };

  view = function(name, context) {
    var headers;
    headers = {
      'Transfer-Encoding': 'chunked',
      'Content-Type': 'text/html'
    };
    path = this.resolve(name);
    return [200, headers, compile(path, context)];
  };

  require.extensions['.mustache'] = function(module, filename) {};

  context.include({
    mustache: view
  });

  module.exports = {
    mustache: view,
    compile: compile
  };

}).call(this);
