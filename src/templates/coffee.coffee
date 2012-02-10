path    = require('path')
fs      = require('fs')
context = require('../context')
coffee  = require('coffee-script')

compile = (path, context) ->
  fiber = Fiber.current
  fs.readFile path, 'utf8', (err, data) ->
    fiber.throwInto(err) if err

    fiber.run coffee.compile(data)
  yield()

view = (name, context) ->
  headers = {'Content-Type': 'text/javascript'}
  path    = @resolve(name)

  [200, headers, compile(path, context)]

context.include
  coffee: view

module.exports =
  coffee: view
  compile: compile