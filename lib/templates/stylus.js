(function() {
  var context, fs, path, stylus, view;

  path = require('path');

  fs = require('fs');

  context = require('../context');

  stylus = require('stylus');

  view = function(template, context) {
    var fiber;
    fiber = Fiber.current;
    fs.readFile(template, 'utf8', function(err, data) {
      var headers;
      if (err) fiber.throwInto(err);
      headers = {
        'Content-Type': 'text/css'
      };
      return stylus.render(data, {
        filename: template
      }, function(err, css) {
        if (err) fiber.throwInto(err);
        return fiber.run([200, headers, css]);
      });
    });
    return yield();
  };

  context.include({
    stylus: view,
    styl: view
  });

  module.exports = {
    stylus: view
  };

}).call(this);
