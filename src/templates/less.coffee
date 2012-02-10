path    = require('path')
fs      = require('fs')
context = require('../context')
less    = require('less')

view = (template, context) ->
  fiber = Fiber.current
  fs.readFile template, 'utf8', (err, data) ->
    fiber.throwInto(err) if err

    headers = {'Content-Type': 'text/css'}
    less.render data, (err, css) ->
      fiber.throwInto(err) if err
      fiber.run([200, headers, css])
  yield()

context.include
  less: view

module.exports =
  less: view