Sequelize = require('sequelize')
sequelize = new Sequelize('mydb', 'root')
Project   = sequelize.define('Project', {
  name: Sequelize.STRING,
  description: Sequelize.TEXT
})

# TODO CRUD with auth. Think about:
# - picking up local npm deps
#
# app.set sessions: true
# app.set static: true
#
# app.error type, ->

app.before ->
  console.log 'before'
  @ok

app.get '/users/:name', ->
  "Hi #{@route.name}"

app.get '/sessions', ->
  res = @session.test
  @session.test = 'works!'
  res

app.get '/test', ->
  'test'

app.get '/redirect', ->
  @redirect 'http://google.com'

app.get '/projects', ->
  project = Project.build(
    name: @params.name
  )

  project.save().wait()

  # @sleep(2000)
  # @response [200, {}, '']
  # @response ''
  # @response ->
  # @head 200
  "Saved project: #{project.id}"