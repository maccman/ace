Q       = require('q')
path    = require('path')
fs      = require('fs')
context = require('../context')
eco     = require('eco')

compile = (path, context) ->
  deffered = Q.defer()

  fs.readFile path, 'utf8', (err, data) ->
    return deffered.fail(err) if err
    deffered.resolve(eco.render(data, context))

  deffered.promise

view = (name, options = {}) ->
  path   = @resolve(name)
  result = compile(path, this)

  layout = options.layout
  layout ?= @settings.layout
  result = compile(layout, body: result) if layout

  result

context.include
  eco: view

module.exports = compile