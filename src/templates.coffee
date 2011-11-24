path    = require('path')
context = require('./context')
Mu      = require('mu')
Mu.root = path.join(__dirname, 'examples')

mustache = (template, context) ->
  fiber = Fiber.current
  Mu.compile template, (err, parsed) ->
    fiber.throwInto(err) if err

    headers = {'Transfer-Encoding': 'chunked'}
    fiber.run([200, headers, Mu.render(template, context)])
  yield()
  
context.include
  mustache: mustache

module.exports =
  mustache: mustache