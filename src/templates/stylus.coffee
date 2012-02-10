path    = require('path')
fs      = require('fs')
context = require('../context')
stylus  = require('stylus')

view = (template, context) ->
  fiber = Fiber.current
  fs.readFile template, 'utf8', (err, data) ->
    fiber.throwInto(err) if err

    headers = {'Content-Type': 'text/css'}
    stylus.render data, {filename: template}, (err, css) ->
      fiber.throwInto(err) if err
      fiber.run([200, headers, css])
  yield()

context.include
  stylus: view
  styl: view

module.exports =
  stylus: view