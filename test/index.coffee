Sequelize = require('sequelize')
sequelize = new Sequelize('mydb', 'root')
Project   = sequelize.define('Project', {
  name: Sequelize.STRING,
  description: Sequelize.TEXT
})

Fiber.poolSize = 800

app.get '/users/:name', ->
  "Hi #{@route.name}"

app.get '/', ->
  project = Project.build(
    name: @params.name
  )

  project.save().wait()

  # @sleep(200)

  "Saved project: #{project.id}"