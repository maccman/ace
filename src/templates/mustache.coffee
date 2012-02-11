path    = require('path')
mu      = require('mu')
context = require('../context')

compile = (path, context) ->
  fiber = Fiber.current
  fs.readFile path, 'utf8', (err, data) ->
    fiber.throwInto(err) if err

    fiber.run mu.compileText(data)(context)
  yield()

view = (name, context) ->
  @headers['Transfer-Encoding'] = 'chunked'
  @headers['Content-Type']      = 'text/html'
  path = @resolve(name)
  compile(path, context)

# So require.resolve works correctly
require.extensions['.mustache'] = (module, filename) ->
require.extensions['.mu'] = (module, filename) ->

context.include
  mustache: view

module.exports = compile