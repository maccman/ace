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
  constructor: (size = 100) ->
    @queue = []
    @count = 0
    @setSize(size)

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

  setSize: (size) ->
    @_size = size
    if Fiber.poolSize < @_size
      Fiber.poolSize = @_size

  @::__defineGetter__ 'size',  -> @_size
  @::__defineSetter__ 'size',  @::setSize

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