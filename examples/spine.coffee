package = require('hem/lib/package')
specs   = require('hem/lib/specs')
css     = require('hem/lib/css')

appPackage = package.createPackage(
  dependencies: []
  paths: ['./app']
  libs: []
)

specsPackage = specs.createPackage('./specs')
cssPackage   = css.createPackage('./css')

app.get '/application.js', ->
  @contentType = 'text/javascript'
  appPackage.compile(@settings.minify)

app.get '/specs.js', ->
  @contentType = 'text/javascript'
  specsPackage.compile(@settings.minify)

app.get '/application.css', ->
  @stylus 'css/application'

# app.get '/users', ->
#   @users = []
#   @json @users
#
# app.post '/users', ->
#   # Create user
#   @user = {}
#   @json @user
#
# app.put '/users/:id', ->
#   @ok
#
# app.del '/users/:id', ->
#   @ok