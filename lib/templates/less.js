(function() {
  var context, fs, less, path, view;

  path = require('path');

  fs = require('fs');

  context = require('../context');

  less = require('less');

  view = function(template, context) {
    var fiber;
    fiber = Fiber.current;
    fs.readFile(template, 'utf8', function(err, data) {
      var headers;
      if (err) fiber.throwInto(err);
      headers = {
        'Content-Type': 'text/css'
      };
      return less.render(data, function(err, css) {
        if (err) fiber.throwInto(err);
        return fiber.run([200, headers, css]);
      });
    });
    return yield();
  };

  context.include({
    less: view
  });

  module.exports = {
    less: view
  };

}).call(this);
