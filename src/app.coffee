strata  = require('strata')
{task}  = require('./fibers')
Request = require('./request')

class App
  constructor: ->
    @app = new strata.Builder
    @app.use(strata.commonLogger)
    @app.use(strata.contentType, 'text/html')
    @app.use(strata.contentLength)

  use: ->
    @app.use.apply(@app, arguments)

  route: (type, route, callback) ->
    @app[type] route, task (env, returns) =>
      request         = new Request(env)
      request.response = ->
        request.served = true
        returns(arguments...)

      response = callback.call(@, request)

      return if request.served

      if Array.isArray(response)
        returns.apply(returns, response)
      else if response.body?
        returns(
          response.status or 200,
          response.headers or {},
          response.body or ''
        )
      else
        returns(200, {}, response or '')

  get:  (args...) -> @route('get',  args...)
  post: (args...) -> @route('post', args...)
  put:  (args...) -> @route('put',  args...)
  del:  (args...) -> @route('del',  args...)

  toApp: ->
    @app.toApp()

  run: ->
    strata.run(@)

module.exports = App