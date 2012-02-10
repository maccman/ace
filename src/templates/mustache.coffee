path    = require('path')
context = require('../context')
Mu      = require('mu')

compile = (path, context) ->
  fiber = Fiber.current
  Mu.compile path, (err, parsed) ->
    fiber.throwInto(err) if err

    fiber.run(Mu.render(template, context))
  yield()

view = (name, context) ->
  headers = {'Transfer-Encoding': 'chunked', 'Content-Type': 'text/html'}
  path    = @resolve(name)

  [200, headers, compile(path, context)]

# So require.resolve works correctly
require.extensions['.mustache'] = (module, filename) ->

context.include
  mustache: view

module.exports =
  mustache: view
  compile: compile