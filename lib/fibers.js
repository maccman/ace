(function() {
  var Pool, context, sleep, task;

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

  Pool = (function() {

    function Pool(size) {
      this.size = size != null ? size : 100;
      this.queue = [];
      this.count = 0;
      if (Fiber.poolSize < this.size) Fiber.poolSize = this.size;
    }

    Pool.prototype.call = function(callback) {
      console.log(this.count);
      this.queue.push(callback);
      if (this.count < this.size) this.addFiber();
      return this;
    };

    Pool.prototype.addFiber = function() {
      var _this = this;
      return Fiber(function() {
        var callback;
        _this.count++;
        while (callback = _this.queue.shift()) {
          callback();
        }
        return _this.count--;
      }).run();
    };

    Pool.prototype.wrap = function(callback) {
      var _this = this;
      return function() {
        var args;
        args = arguments;
        return _this.call(function() {
          return callback.apply(null, args);
        });
      };
    };

    return Pool;

  })();

  context.include({
    sleep: sleep
  });

  module.exports = {
    task: task,
    wrap: task,
    sleep: sleep,
    Pool: Pool
  };

}).call(this);
