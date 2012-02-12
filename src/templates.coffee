path    = require('path')
context = require('./context')

for name in ['coffee', 'eco', 'ejs', 'json', 'less', 'mustache', 'stylus']
  try require("./templates/#{name}")

resolve = (name, defaultPath) ->
  try return require.resolve(name)
  try return require.resolve(path.resolve(@settings.views, name))
  try return require.resolve(path.resolve(@settings.assets, name))
  return defaultPath if defaultPath?
  throw "Cannot find #{name}"

context.include
  resolve: resolve

module.exports =
  resolve: resolve