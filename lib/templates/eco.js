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

  view = function(name, context) {
    path = this.resolve(name);
    return compile(path, context);
  };

  context.include({
    eco: view
  });

  module.exports = compile;

}).call(this);
