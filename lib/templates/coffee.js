(function() {
  var coffee, context, fs, path, view;

  path = require('path');

  fs = require('fs');

  context = require('../context');

  coffee = require('coffee-script');

  view = function(template, context) {
    var fiber;
    fiber = Fiber.current;
    fs.readFile(template, 'utf8', function(err, data) {
      var headers, result;
      if (err) fiber.throwInto(err);
      headers = {
        'Content-Type': 'text/javascript'
      };
      result = coffee.compile(data);
      return fiber.run([200, headers, result]);
    });
    return yield();
  };

  context.include({
    coffee: view
  });

  module.exports = {
    coffee: view
  };

}).call(this);
