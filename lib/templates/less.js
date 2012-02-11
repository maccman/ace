(function() {
  var compile, context, fs, less, path, view, _base;

  path = require('path');

  fs = require('fs');

  context = require('../context');

  less = require('less');

  compile = function(path) {
    var fiber;
    fiber = Fiber.current;
    fs.readFile(path, 'utf8', function(err, data) {
      if (err) fiber.throwInto(err);
      return less.render(data, function(err, css) {
        if (err) fiber.throwInto(err);
        return fiber.run(css);
      });
    });
    return yield();
  };

  view = function(name) {
    this.contentType = 'text/css';
    path = this.resolve(name);
    return compile(path);
  };

  (_base = require.extensions)['.less'] || (_base['.less'] = function(module, filename) {});

  context.include({
    less: view
  });

  module.exports = compile;

}).call(this);
