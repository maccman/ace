path    = require('path')
fs      = require('fs')
context = require('../context')
less    = require('less')

compile = (path, context) ->
  fiber = Fiber.current
  fs.readFile path, 'utf8', (err, data) ->
    fiber.throwInto(err) if err

    less.render data, (err, css) ->
      fiber.throwInto(err) if err
      fiber.run(css)
  yield()

view: (name, context) ->
  headers = {'Content-Type': 'text/css'}
  path    = @resolve(name)

  [200, headers, compile(path, context)]

require.extensions['.less'] = (module, filename) ->

context.include
  less: view

module.exports =
  less: view
  compile: compile