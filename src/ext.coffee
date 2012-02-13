require('fibers')
future = require('fibers/future')

Function::wait = ->
  future.wrap(@).apply(@, arguments).wait()

EventEmitter = require('events').EventEmitter
EventEmitter::wait = (success = 'success', failure = 'failure') ->
  fiber = Fiber.current
  @on success, -> fiber.run(arguments...)
  @on failure, -> fiber.throwInto(arguments...)
  yield()