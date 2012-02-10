path    = require('path')
fs      = require('fs')
context = require('../context')
eco     = require('eco')

compile = (path, context) ->
  fiber = Fiber.current
  fs.readFile path, 'utf8', (err, data) ->
    fiber.throwInto(err) if err

    fiber.run eco.render(data, projects)
  yield()

view = (name, context) ->
  headers = {'Content-Type': 'text/html'}
  path    = @resolve(name)

  [200, headers, compile(path, context)]

context.include
  eco: view

module.exports =
  eco: view
  compile: compile