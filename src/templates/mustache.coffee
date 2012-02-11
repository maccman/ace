path    = require('path')
mu      = require('mu')
context = require('../context')

compile = (path, context) ->
  fiber = Fiber.current
  fs.readFile path, 'utf8', (err, data) ->
    fiber.throwInto(err) if err

    fiber.run mu.compileText(data)(context)
  yield()

view = (name) ->
  @headers['Transfer-Encoding'] = 'chunked'
  @headers['Content-Type']      = 'text/html'
  path = @resolve(name)
  compile(path, this)

# So require.resolve works correctly
require.extensions['.mustache'] = (module, filename) ->
require.extensions['.mu'] = (module, filename) ->

context.include
  mustache: view
  mu: view

module.exports = compile
