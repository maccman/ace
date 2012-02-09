strata  = require('strata')
fibers  = require('./fibers')
context = require('./context')

class App extends strata.Builder
  constructor: ->
    super
    @pool   = new fibers.Pool
    @router = new strata.Router
    @use(strata.commonLogger)
    @use(strata.contentType, 'text/html')
    @use(strata.contentLength)
    @run(@router)

  route: (pattern, app, methods) ->
    app = context.wrap(app)
    app = @pool.wrap(app)
    @router.route(pattern, app, methods)

methods =
  get: ['GET', 'HEAD'],
  post: 'POST',
  put: 'PUT',
  del: 'DELETE',
  head: 'HEAD',
  options: 'OPTIONS'

for method of methods
  App::[method] = do (method) ->
    (args...) -> @route(args..., method)

module.exports = App