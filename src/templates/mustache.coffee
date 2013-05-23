Q       = require('q')
path    = require('path')
mu      = require('mu')
context = require('../context')

compile = (path, context) ->
  deffered = Q.defer()

  fs.readFile path, 'utf8', (err, data) ->
    return deffered.fail(err) if err

    buffer = ''
    stream = mu.compileText(data)(context)
    stream.addListener 'data', (c) -> buffer += c
    stream.addListener 'end', -> deffered.resolve(buffer)

  deffered.promise

view = (name, options = {}) ->
  path   = @resolve(name)
  result = compile(path, this)

  layout = options.layout
  layout ?= @settings.layout
  result = compile(layout, body: result) if layout

  result

# So require.resolve works correctly
require.extensions['.mustache'] = (module, filename) ->
require.extensions['.mu'] = (module, filename) ->

context.include
  mustache: view
  mu: view

module.exports = compile
