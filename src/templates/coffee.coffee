Q       = require('q')
path    = require('path')
fs      = require('fs')
context = require('../context')
coffee  = require('coffee-script')

compile = (path) ->
  deffered = Q.defer()

  fs.readFile path, 'utf8', (err, data) ->
    return deffered.fail(err) if err
    deffered.resolve(coffee.compile(data))

  deffered.promise

view = (name) ->
  @contentType = 'text/javascript'
  path = @resolve(name)
  compile(path)

context.include
  coffee: view

module.exports = compile