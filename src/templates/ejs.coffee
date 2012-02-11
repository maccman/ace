path    = require('path')
fs      = require('fs')
context = require('../context')
ejs     = require('ejs')

compile = (path, context) ->
  fiber = Fiber.current
  fs.readFile path, 'utf8', (err, data) ->
    fiber.throwInto(err) if err

    fiber.run ejs.render(data, context)
  yield()

view = (name) ->
  path = @resolve(name)
  compile(path, this)

context.include
  ejs: view

module.exports = compile