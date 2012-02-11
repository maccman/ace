Sequelize = require('sequelize')
sequelize = new Sequelize('mydb', 'root')
Project   = sequelize.define('Project',
  name: Sequelize.STRING,
  description: Sequelize.TEXT
)

Project.sync()

app.before '/users/*', ->
  console.log 'before'
  @ok

app.get '/users/:name', ->
  @name = @route.name
  @eco 'user'

app.get '/sessions', ->
  res = @session.test
  @session.test = 'works!'
  res

app.get '/test', ->
  'test'

app.rewrite '/google', '/redirect'

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