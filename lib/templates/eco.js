(function() {
  var context, eco, fs, path, view;

  path = require('path');

  fs = require('fs');

  context = require('../context');

  eco = require('eco');

  view = function(template, context) {
    var fiber;
    fiber = Fiber.current;
    fs.readFile(template, 'utf8', function(err, data) {
      var headers, result;
      if (err) fiber.throwInto(err);
      headers = {
        'Content-Type': 'text/html'
      };
      result = eco.render(data, projects);
      return fiber.run([200, headers, result]);
    });
    return yield();
  };

  context.include({
    eco: view
  });

  module.exports = {
    eco: view
  };

}).call(this);
