(function() {
  var compile, context, ejs, fs, path, view;

  path = require('path');

  fs = require('fs');

  context = require('../context');

  ejs = require('ejs');

  compile = function(path, context) {
    var fiber;
    fiber = Fiber.current;
    fs.readFile(path, 'utf8', function(err, data) {
      if (err) fiber.throwInto(err);
      return fiber.run(ejs.render(data, context));
    });
    return yield();
  };

  view = function(name) {
    path = this.resolve(name);
    return compile(path, this);
  };

  context.include({
    ejs: view
  });

  module.exports = compile;

}).call(this);
