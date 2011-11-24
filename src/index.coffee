require('./ext')
require('./helpers')
App     = require('./app')
{sleep} = require('./fibers')

Sequelize = require('sequelize')
sequelize = new Sequelize('mydb', 'root')
Project   = sequelize.define('Project', {
  name: Sequelize.STRING,
  description: Sequelize.TEXT
})

app = new App

app.get '/users/:name', ->
  @response "Hi #{@params.name}"

app.get '/', ->

  project = Project.build(
    name: @params.name
  )

  project.save().wait()

  sleep(1000)
  
  'ok'
  
app.run()