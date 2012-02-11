path    = require('path')
fs      = require('fs')
context = require('../context')
less    = require('less')

compile = (path) ->
  fiber = Fiber.current
  fs.readFile path, 'utf8', (err, data) ->
    fiber.throwInto(err) if err

    less.render data, (err, css) ->
      fiber.throwInto(err) if err
      fiber.run(css)
  yield()

view = (name) ->
  @contentType = 'text/css'
  path         = @resolve(name)
  compile(path)

require.extensions['.less'] or= (module, filename) ->

context.include
  less: view

module.exports = compile
