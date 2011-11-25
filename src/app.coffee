strata  = require('strata')
fibers  = require('./fibers')
context = require('./context')

class App extends strata.Builder
  constructor: ->
    super
    @use(strata.commonLogger)
    @use(strata.contentType, 'text/html')
    @use(strata.contentLength)
    
  route: (pattern, app, methods) ->
    app = context.wrap(app)
    app = fibers.wrap(app)
    super(pattern, app, methods)

module.exports = App