(function() {
  var EventEmitter, future;

  require('fibers');

  future = require('fibers/future');

  Function.prototype.wait = function() {
    return future.wrap(this).apply(this, arguments).wait();
  };

  EventEmitter = require('events').EventEmitter;

  EventEmitter.prototype.wait = function(success, failure) {
    var fiber;
    if (success == null) success = 'success';
    if (failure == null) failure = 'failure';
    fiber = Fiber.current;
    this.on(success, function() {
      return fiber.run.apply(fiber, arguments);
    });
    this.on(failure, function() {
      return fiber.throwInto.apply(fiber, arguments);
    });
    return yield();
  };

}).call(this);
