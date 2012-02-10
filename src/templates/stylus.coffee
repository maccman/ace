path    = require('path')
fs      = require('fs')
context = require('../context')
stylus  = require('stylus')

compile = (path, context) ->
  fiber = Fiber.current
  fs.readFile path, 'utf8', (err, data) ->
    fiber.throwInto(err) if err

    stylus.render data, {filename: path}, (err, css) ->
      fiber.throwInto(err) if err
      fiber.run(css)
  yield()

view = (name, context) ->
  headers = {'Content-Type': 'text/css'}
  path    = @resolve(name)

  [200, headers, compile(path, context)]

# So require.resolve works correctly
require.extensions['.styl'] = (module, filename) ->

context.include
  stylus: view
  styl: view

module.exports =
  stylus: view
  compile: compile