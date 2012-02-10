(function() {
  var compile, context, fs, path, stylus, view;

  path = require('path');

  fs = require('fs');

  context = require('../context');

  stylus = require('stylus');

  compile = function(path, context) {
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

  view = function(name, context) {
    var headers;
    headers = {
      'Content-Type': 'text/css'
    };
    path = this.resolve(name);
    return [200, headers, compile(path, context)];
  };

  require.extensions['.styl'] = function(module, filename) {};

  context.include({
    stylus: view,
    styl: view
  });

  module.exports = {
    stylus: view,
    compile: compile
  };

}).call(this);
