fs      = require('fs')
path    = require('path')
strata  = require('strata')
fibers  = require('./fibers')
context = require('./context')
static  = require('./static')

class App extends strata.Builder
  settings:
    static:   true
    sessions: true
    port:     1982
    bind:     '0.0.0.0'
    root:     process.cwd()
    views:    './views'
    public:   './public'

  constructor: ->
    super()
    @pool   = new fibers.Pool
    @router = new strata.Router
    @use(strata.commonLogger)
    @use(strata.contentType, 'text/html')
    @use(strata.contentLength)

  before: (filter) ->
    filter = context.wrap(filter)
    @use (app) ->
      (env, callback) ->
        app env, ->
          # Original request
          original = arguments

          # Call filter
          filter env, (status) ->
            if status is 200
              callback(original...)
            else
              callback(arguments...)

  route: (pattern, app, methods) ->
    @router.route(
      pattern,
      context.wrap(app),
      methods
    )

  set: (key, value) ->
    if typeof key is 'object'
      @set(k, v) for k, v of key
    else
      @settings[key] = value

  useSessions: ->
    options = {}
    if typeof @settings.sessions is 'object'
      options = @settings.sessions
    @use(strata.sessionCookie, options)

  useStatic: ->
    if fs.existsSync(@settings.public)
      @use(static, @settings.public, ['index.html'])

  toApp: ->
    @useSessions() if @settings.sessions
    @useStatic()   if @settings.static
    @run (env, callback) =>
      @pool.wrap(@router.toApp())(env, callback)
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