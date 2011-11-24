Request = require('./request')

class Context
  constructor: (@env, @callback) ->
    @request = new Request(env)
  
  response: (response) ->
    return false if @served
    @served = true
    
    if Array.isArray(response)
      @callback(response...)
    else if response.body?
      @callback(
        response.status or 200,
        response.headers or {},
        response.body or ''
      )
    else
      @callback(200, {}, response or '')
    
  @::__defineGetter__ 'cookies',  -> @request.cookies
  @::__defineGetter__ 'params',   -> @request.params
  @::__defineGetter__ 'query',    -> @request.query
  @::__defineGetter__ 'body',     -> @request.body

module.exports = Context