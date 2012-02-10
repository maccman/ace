path    = require('path')
context = require('./context')

for name in ['coffee', 'eco', 'less', 'mustache', 'stylus']
  try require("./templates/#{name}")

resolve = (name) ->
  try return require.resolve(name)
  try return require.resolve(path.join(@settings.view or '', name))
  throw "Cannot find #{name}"

context.include
  resolve: resolve

module.exports =
  resolve: resolve