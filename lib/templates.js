(function() {
  var Mu, context, mustache, path;

  path = require('path');

  context = require('./context');

  Mu = require('mu');

  Mu.root = path.join(__dirname, 'examples');

  mustache = function(template, context) {
    var fiber;
    fiber = Fiber.current;
    Mu.compile(template, function(err, parsed) {
      var headers;
      if (err) fiber.throwInto(err);
      headers = {
        'Transfer-Encoding': 'chunked'
      };
      return fiber.run([200, headers, Mu.render(template, context)]);
    });
    return yield();
  };

  context.include({
    mustache: mustache
  });

  module.exports = {
    mustache: mustache
  };

}).call(this);
