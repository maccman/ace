path    = require('path')
Mu      = require('mu')
Mu.root = path.join(__dirname, 'examples')

mustache = (template, context) ->
  fiber = Fiber.current
  Mu.compile template, (err, parsed) ->
    fiber.throwInto(err) if err

    headers = {'Transfer-Encoding': 'chunked'}
    fiber.run([200, headers, Mu.render(template, context)])
  yield()

module.exports =
  mustache: mustache