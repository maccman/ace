path    = require('path')
fs      = require('fs')
context = require('../context')
coffee  = require('coffee-script')

compile = (path) ->
  fiber = Fiber.current
  fs.readFile path, 'utf8', (err, data) ->
    fiber.throwInto(err) if err

    fiber.run coffee.compile(data)
  yield()

view = (name, context) ->
  @contentType = 'text/javascript'
  path = @resolve(name)
  compile(path, context)

context.include
  coffee: view

module.exports = compile