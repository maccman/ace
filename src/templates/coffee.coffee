Fiber   = require('fibers')
path    = require('path')
fs      = require('fs')
context = require('../context')
coffee  = require('coffee-script')

compile = (path) ->
  fiber = Fiber.current
  fs.readFile path, 'utf8', (err, data) ->
    fiber.throwInto(err) if err

    fiber.run coffee.compile(data)
  Fiber.yield()

view = (name) ->
  @contentType = 'text/javascript'
  path = @resolve(name)
  compile(path)

context.include
  coffee: view

module.exports = compile