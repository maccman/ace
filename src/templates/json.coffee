path    = require('path')
fs      = require('fs')
context = require('../context')
coffee  = require('coffee-script')

compile = (object) ->
  JSON.stringify(object)

json = (object) ->
  @contentType = 'application/json'
  compile(object)

jsonp = (object, options = {}) ->
  cb = options.callback
  cb or= @params.callback
  cb or= 'callback'

  json(({})[cb] = object)

context.include
  json: json
  jsonp: jsonp

module.exports = compile