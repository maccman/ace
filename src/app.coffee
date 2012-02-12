fs        = require('fs')
path      = require('path')
strata    = require('strata')
fibers    = require('./fibers')
context   = require('./context')
static    = require('./static')
filter    = require('./filter')
templates = require('./templates')

class App extends strata.Builder
  defaults:
    static:   true
    sessions: true
    port:     1982
    bind:     '0.0.0.0'
    root:     process.cwd()
    views:    './views'
    assets:   './assets'
    public:   './public'
    layout:   'layout'

  context: context
  resolve: templates.resolve

  constructor: ->
    super()

    @settings = {}
    @set @defaults

    @settings.layout = @resolve(
      @settings.layout, false
    )

    unless fs.existsSync(@settings.public)
      @settings.static = false

    @pool   = new fibers.Pool
    @router = new strata.Router

    @use(strata.commonLogger)
    @use(strata.contentType, 'text/html')
    @use(strata.contentLength)

  before: (conditions, callback) ->
    unless callback
      callback   = conditions
      conditions = true

    @use(filter, conditions, callback)

  rewrite: (pattern, replacement) ->
    @use(strata.rewrite, pattern, replacement)

  root: (replacement) ->
    @rewrite('/', replacement)

  route: (pattern, app, methods) ->
    @router.route(
      pattern,
      context.wrap(app, this),
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
    @use(static, @settings.public, ['index.html'])

  toApp: ->
    @useSessions() if @settings.sessions
    @useStatic()   if @settings.static
    @run (env, callback) =>
      @pool.wrap(@router.toApp())(env, callback)
    super

  serve: ->
    strata.run this,
      host:   @settings.host
      port:   @settings.port
      socket: @settings.socket

methods =
  get: ['GET', 'HEAD'],
  post: 'POST',
  put: 'PUT',
  del: 'DELETE',
  head: 'HEAD',
  options: 'OPTIONS'

for type, method of methods
  App::[type] = do (method) ->
    (args...) -> @route(args..., method)

module.exports = App