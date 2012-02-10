path    = require('path')
context = require('./context')

for name in ['coffee', 'eco', 'less', 'mustache', 'stylus']
  try require("./templates/#{name}")

resolve = (name) ->
  try return require.resolve(name)
  try return require.resolve(path.resolve(@settings.views, name))
  throw "Cannot find #{name}"

context.include
  resolve: resolve

module.exports =
  resolve: resolve