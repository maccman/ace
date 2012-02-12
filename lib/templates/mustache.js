(function() {
  var compile, context, mu, path, view;

  path = require('path');

  mu = require('mu');

  context = require('../context');

  compile = function(path, context) {
    var fiber;
    fiber = Fiber.current;
    fs.readFile(path, 'utf8', function(err, data) {
      var buffer, stream;
      if (err) fiber.throwInto(err);
      buffer = '';
      stream = mu.compileText(data)(context);
      stream.addListener('data', function(c) {
        return buffer += c;
      });
      return stream.addListener('end', function() {
        return fiber.run(buffer);
      });
    });
    return yield();
  };

  view = function(name, options) {
    var layout, result;
    if (options == null) options = {};
    path = this.resolve(name);
    result = compile(path, this);
    layout = options.layout;
    if (layout == null) layout = this.settings.layout;
    if (layout) {
      result = compile(layout, {
        body: result
      });
    }
    return result;
  };

  require.extensions['.mustache'] = function(module, filename) {};

  require.extensions['.mu'] = function(module, filename) {};

  context.include({
    mustache: view,
    mu: view
  });

  module.exports = compile;

}).call(this);
