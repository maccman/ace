require('./ext')

App     = require('./app')
context = require('./context')
helpers = require('./helpers')

for name in ['coffee', 'eco', 'less', 'mustache']
  try require("./templates/#{name}")

module.exports =
  App: App
  context: context
  helpers: helpers