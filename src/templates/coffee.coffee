path    = require('path')
fs      = require('fs')
context = require('../context')
coffee  = require('coffee-script')

view = (template, context) ->
  fiber = Fiber.current
  fs.readFile template, 'utf8', (err, data) ->
    fiber.throwInto(err) if err

    headers = {'Content-Type': 'text/javascript'}
    result  = coffee.compile(data)
    fiber.run([200, headers, result])
  yield()

context.include
  coffee: view

module.exports =
  coffee: view