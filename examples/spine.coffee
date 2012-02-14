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
  @contentType = 'text/css'
  cssPackage.compile()