require('fibers')

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

module.exports =
  task: task
  sleep: sleep