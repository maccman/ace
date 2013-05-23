Q       = require('q')
path    = require('path')
fs      = require('fs')
context = require('../context')
ejs     = require('ejs')

compile = (path, context) ->
  deffered = Q.defer()

  fs.readFile path, 'utf8', (err, data) ->
    return deffered.fail(err) if err
    deffered.resolve(ejs.render(data, context))

  deffered.promise

view = (name) ->
  path = @resolve(name)
  compile(path, this)

context.include
  ejs: view

module.exports = compile