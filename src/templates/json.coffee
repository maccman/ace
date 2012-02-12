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

  result = @json object
  result = "#{cb}(#{result})" if cb
  result

context.include
  json: json
  jsonp: jsonp

module.exports = compile