(function() {
  var compile, context, mu, path, view;

  path = require('path');

  mu = require('mu');

  context = require('../context');

  compile = function(path, context) {
    var fiber;
    fiber = Fiber.current;
    fs.readFile(path, 'utf8', function(err, data) {
      if (err) fiber.throwInto(err);
      return fiber.run(mu.compileText(data)(context));
    });
    return yield();
  };

  view = function(name) {
    this.headers['Transfer-Encoding'] = 'chunked';
    this.headers['Content-Type'] = 'text/html';
    path = this.resolve(name);
    return compile(path, this);
  };

  require.extensions['.mustache'] = function(module, filename) {};

  require.extensions['.mu'] = function(module, filename) {};

  context.include({
    mustache: view,
    mu: view
  });

  module.exports = compile;

}).call(this);
