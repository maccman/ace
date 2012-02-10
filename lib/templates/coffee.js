(function() {
  var coffee, compile, context, fs, path, view;

  path = require('path');

  fs = require('fs');

  context = require('../context');

  coffee = require('coffee-script');

  compile = function(path) {
    var fiber;
    fiber = Fiber.current;
    fs.readFile(path, 'utf8', function(err, data) {
      if (err) fiber.throwInto(err);
      return fiber.run(coffee.compile(data));
    });
    return yield();
  };

  view = function(name, context) {
    var headers;
    headers = {
      'Content-Type': 'text/javascript'
    };
    path = this.resolve(name);
    return [200, headers, compile(path, context)];
  };

  context.include({
    coffee: view
  });

  module.exports = {
    coffee: view,
    compile: compile
  };

}).call(this);
