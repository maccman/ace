(function() {
  var sleep, task;

  require('fibers');

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

  module.exports = {
    task: task,
    sleep: sleep
  };

}).call(this);
