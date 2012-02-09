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
      if (size == null) size = 100;
      this.queue = [];
      this.count = 0;
      this.setSize(size);
    }

    Pool.prototype.call = function(callback) {
      this.queue.push(callback);
      if (this.count < this.size) this.addFiber();
      return this;
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

    Pool.prototype.setSize = function(size) {
      this._size = size;
      if (Fiber.poolSize < this._size) return Fiber.poolSize = this._size;
    };

    Pool.prototype.__defineGetter__('size', function() {
      return this._size;
    });

    Pool.prototype.__defineSetter__('size', Pool.prototype.setSize);

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
