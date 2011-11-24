(function() {
  var context, sleep, task;

  require('fibers');

  context = require('./context');

  task = function(callback) {
    return function() {
      var args;
      args = arguments;
      return Fiber(function() {
        return callback.apply(null, args);
      }).run();
    };
  };

  sleep = function(ms) {
    var fiber;
    fiber = Fiber.current;
    setTimeout(function() {
      return fiber.run();
    }, ms);
    return yield();
  };

  context.include({
    sleep: sleep
  });

  module.exports = {
    task: task,
    sleep: sleep
  };

}).call(this);
