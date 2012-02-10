path    = require('path')
fs      = require('fs')
context = require('../context')
eco     = require('eco')

view = (template, context) ->
  fiber = Fiber.current
  fs.readFile template, 'utf8', (err, data) ->
    fiber.throwInto(err) if err

    headers = {'Content-Type': 'text/html'}
    result  = eco.render(data, projects)
    fiber.run([200, headers, result])
  yield()

context.include
  eco: view

module.exports =
  eco: view