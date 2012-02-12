(function() {
  var compile, context, eco, fs, path, view;

  path = require('path');

  fs = require('fs');

  context = require('../context');

  eco = require('eco');

  compile = function(path, context) {
    var fiber;
    fiber = Fiber.current;
    fs.readFile(path, 'utf8', function(err, data) {
      if (err) fiber.throwInto(err);
      return fiber.run(eco.render(data, context));
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

  context.include({
    eco: view
  });

  module.exports = compile;

}).call(this);
