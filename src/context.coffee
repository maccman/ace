strata = require('strata')
{wait} = require('./async')

class Context
  @include: (obj) ->
    @::[key] = value for key, value of obj

  @wrap: (app, base) ->
    (env, callback) ->
      context = new Context(env, callback, base)
      try
        result = app.call(context, env, callback)
        context.send(result)
      catch err
        strata.handleError(err, env, callback)

  constructor: (@env, @callback, @app = {}) ->
    @request  = new strata.Request(@env)
    @response = new strata.Response

  send: (result) ->
    return false if result is false
    return false if @served
    @served = true

    if Array.isArray(result)
      @response.status  = result[0]
      @response.headers = result[1]
      @response.body    = result[3]

    else if typeof result is 'integer'
      @response.status = result

    else if result instanceof strata.Response
      @response = result

    else if typeof result is 'function'
      @response.body = result

    else if typeof result is 'string'
      @response.body = result

    @callback(
      @response.status,
      @response.headers,
      @response.body
    )

  setter: @::__defineSetter__
  getter: @::__defineGetter__

  @::getter 'cookies', ->
    wait(@request.cookies.bind(@request))

  @::getter 'params', ->
    wait(@request.params.bind(@request))

  @::getter 'query', ->
    wait(@request.query.bind(@request))

  @::getter 'body', ->
    wait(@request.body.bind(@request))

  @::getter 'route', ->
    @env.route

  @::getter 'settings', ->
    @app.settings

  @::getter 'session', ->
    @env.session or= {}

  @::setter 'session', (value) ->
    @env.session = value

  @::getter 'status', ->
    @response.status

  @::setter 'status', (value) ->
    @response.status = value

  @::getter 'headers', ->
    @response.headers

  @::setter 'headers', (value) ->
    @response.headers = value

  @::setter 'contentType', (value) ->
    @response.headers['Content-Type'] = value

  @::setter 'body', (value) ->
    @response.body = value

  accepts: (type) ->
    @request.accepts(type)

  @::getter 'format', ->
    @env.format

  @::getter 'acceptsJSON', ->
    mime = 'application/json'
    return true if @env.format is mime

    # Check to see if JSON is explicitly
    # mentioned in the accept header
    accept = @request.accept or ''
    accept.indexOf(mime) != -1

module.exports = Context