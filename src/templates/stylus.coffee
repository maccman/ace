path    = require('path')
fs      = require('fs')
context = require('../context')
stylus  = require('stylus')

compile = (path) ->
  fiber = Fiber.current
  fs.readFile path, 'utf8', (err, data) ->
    fiber.throwInto(err) if err

    stylus.render data, {filename: path}, (err, css) ->
      fiber.throwInto(err) if err
      fiber.run(css)
  yield()

view = (name) ->
  @contentType = 'text/css'
  path         = @resolve(name)
  compile(path)

# So require.resolve works correctly
require.extensions['.styl'] or= (module, filename) ->

context.include
  stylus: view
  styl: view

module.exports = compile
