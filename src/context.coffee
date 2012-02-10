strata = require('strata')

class Context
  @include: (obj) ->
    @::[key] = value for key, value of obj

  constructor: (@env, @callback, @app = {}) ->
    @request = new strata.Request(@env)

  response: (response) ->
    return false if response is false
    return false if @served
    @served = true

    if Array.isArray(response)
      @callback(response...)
    else if response?.body?
      @callback(
        response.status or 200,
        response.headers or {},
        response.body or ''
      )
    else
      @callback(200, {}, response or '')

  @::__defineGetter__ 'cookies',  -> @request.cookies.bind(@request).wait()
  @::__defineGetter__ 'params',   -> @request.params.bind(@request).wait()
  @::__defineGetter__ 'query',    -> @request.query.bind(@request).wait()
  @::__defineGetter__ 'body',     -> @request.body.bind(@request).wait()
  @::__defineGetter__ 'route',    -> @env.route
  @::__defineGetter__ 'settings', -> @app.settings
  @::__defineGetter__ 'session',  -> @env.session
  @::__defineSetter__ 'session',  (value) -> @env.session = value

  @wrap: (app, base) ->
    (env, callback) ->
      context = new Context(env, callback, base)
      result  = app.call context, env, callback
      context.response(result)

module.exports = Context