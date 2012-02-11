path    = require('path')
fs      = require('fs')
context = require('../context')
eco     = require('eco')

compile = (path, context) ->
  fiber = Fiber.current
  fs.readFile path, 'utf8', (err, data) ->
    fiber.throwInto(err) if err

    fiber.run eco.render(data, context)
  yield()

view = (name, context) ->
  path = @resolve(name)
  compile(path, context)

context.include
  eco: view

module.exports = compile