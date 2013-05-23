Q       = require('q')
path    = require('path')
fs      = require('fs')
context = require('../context')
less    = require('less')

compile = (path) ->
  deffered = Q.defer()

  fs.readFile path, 'utf8', (err, data) ->
    return deffered.fail(err) if err

    less.render data, (err, css) ->
      return deffered.fail(err) if err
      deffered.resolve(css)

  deffered.promise

view = (name) ->
  @contentType = 'text/css'
  path         = @resolve(name)
  compile(path)

require.extensions['.less'] or= (module, filename) ->

context.include
  less: view

module.exports = compile
