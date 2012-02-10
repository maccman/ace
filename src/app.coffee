fs      = require('fs')
path    = require('path')
strata  = require('strata')
fibers  = require('./fibers')
context = require('./context')
static  = require('./static')

class App extends strata.Builder
  config:
    static: true
    sessions: true
    port: 1982
    bind: '0.0.0.0'
    root: process.cwd()
    views: './views'
    public: './public'

  constructor: ->
    super()
    @pool   = new fibers.Pool
    @router = new strata.Router
    @use(strata.commonLogger)
    @use(strata.contentType, 'text/html')
    @use(strata.contentLength)

  route: (pattern, app, methods) ->
    app = context.wrap(app)
    app = @pool.wrap(app)
    @router.route(pattern, app, methods)

  set: (key, value) ->
    if typeof key is 'object'
      @set(k, v) for k, v of key
    else
      @config[key] = value

  addSessions: ->
    options = {}
    if typeof @config.sessions is 'object'
      options = @config.sessions
    @use(strata.sessionCookie, options)

  addStatic: ->
    if fs.existsSync(@config.public)
      @use(static, @config.public, ['index.html'])

  toApp: ->
    @addSessions() if @config.sessions
    @addStatic()   if @config.static
    @run(@router)
    super

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