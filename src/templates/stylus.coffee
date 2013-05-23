Q       = require('q')
path    = require('path')
fs      = require('fs')
context = require('../context')
stylus  = require('stylus')

compile = (path, context) ->
  deffered = Q.defer()

  fs.readFile path, 'utf8', (err, data) ->
    return deffered.fail(err) if err

    stylus.render data, {filename: path}, (err, css) ->
      return deffered.fail(err) if err
      deffered.resolve(css)

  deffered.promise

view = (name) ->
  @contentType = 'text/css'
  path         = @resolve(name)
  compile(path)

# So require.resolve works correctly
require.extensions['.styl'] or= (module, filename) ->

context.include
  stylus: view
  styl: view

module.exports = compile
