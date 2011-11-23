require('./sugar')
App = require('./app')

Sequelize = require('sequelize')
sequelize = new Sequelize('mydb', 'root')
Project   = sequelize.define('Project', {
  name: Sequelize.STRING,
  description: Sequelize.TEXT
})

app = new App
app.get '/', (request) ->

  project = Project.build({
    name: request.params.name
  })

  project.save().wait()

  # sleep(1000)
  'ok'

app.run()