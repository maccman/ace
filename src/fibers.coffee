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

class Pool
  constructor: (@size = 100) ->
    @queue = []
    @count = 0
    if Fiber.poolSize < @size
      Fiber.poolSize = @size

  call: (callback) ->
    @queue.push(callback)
    if @count < @size
      @addFiber()
    this

  wrap: (callback) ->
    =>
      args = arguments
      @call ->
        callback(args...)

  # Private
  addFiber: ->
    Fiber(=>
      @count++
      while callback = @queue.shift()
        callback()
      @count--
    ).run()

context.include
  sleep: sleep

module.exports =
  task: task
  wrap: task
  sleep: sleep
  Pool: Pool