Sequelize = require('sequelize')
sequelize = new Sequelize('mydb', 'root')
Project   = sequelize.define('Project', {
  name: Sequelize.STRING,
  description: Sequelize.TEXT
})

app.get '/users/:name', ->
  "Hi #{@route.name}"

app.get '/', ->
  
  project = Project.build(
    name: @params.name
  )

  project.save().wait()
  
  # @sleep(1000)
  
  "Saved project: #{project.id}"