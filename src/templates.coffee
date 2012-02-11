path    = require('path')
context = require('./context')

for name in ['coffee', 'eco', 'ejs', 'json', 'less', 'mustache', 'stylus']
  try require("./templates/#{name}")

resolve = (name, raise = true) ->
  console.log path.resolve(@settings.views, name)
  try return require.resolve(name)
  try return require.resolve(path.resolve(@settings.views, name))
  try return require.resolve(path.resolve(@settings.assets, name))
  throw "Cannot find #{name}" if raise
  false

context.include
  resolve: resolve

module.exports =
  resolve: resolve