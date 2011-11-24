strata  = require('strata')
{task}  = require('./fibers')
Context = require('./context')

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
      context  = new Context(env, returns)
      response = callback.call(context)
      context.response(response)

  get:  (args...) -> @route('get',  args...)
  post: (args...) -> @route('post', args...)
  put:  (args...) -> @route('put',  args...)
  del:  (args...) -> @route('del',  args...)

  toApp: ->
    @app.toApp()

  run: ->
    strata.run(@)

module.exports = App