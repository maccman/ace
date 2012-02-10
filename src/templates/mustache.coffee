path    = require('path')
context = require('../context')
Mu      = require('mu')

mustache = (template, context) ->
  fiber = Fiber.current
  Mu.compile template, (err, parsed) ->
    fiber.throwInto(err) if err

    headers = {'Transfer-Encoding': 'chunked', 'Content-Type': 'text/html'}
    fiber.run([200, headers, Mu.render(template, context)])
  yield()

context.include
  mustache: mustache

module.exports =
  mustache: mustache