(function() {
  var compile, context, fs, path, stylus, view, _base;

  path = require('path');

  fs = require('fs');

  context = require('../context');

  stylus = require('stylus');

  compile = function(path) {
    var fiber;
    fiber = Fiber.current;
    fs.readFile(path, 'utf8', function(err, data) {
      if (err) fiber.throwInto(err);
      return stylus.render(data, {
        filename: path
      }, function(err, css) {
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

  (_base = require.extensions)['.styl'] || (_base['.styl'] = function(module, filename) {});

  context.include({
    stylus: view,
    styl: view
  });

  module.exports = compile;

}).call(this);
