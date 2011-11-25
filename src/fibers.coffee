require('fibers')
context = require('./context')

task = (callback) ->
  ->
    args = arguments
    Fiber ->
      callback(args...)
    .run()

sleep = (ms) ->
  fiber = Fiber.current
  setTimeout ->
    fiber.run()
  , ms
  yield()
  
context.include
  sleep: sleep

module.exports =
  task: task
  wrap: task
  sleep: sleep