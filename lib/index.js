(function() {
  var App, Project, Sequelize, app, sequelize;

  App = require('./app');

  Sequelize = require('sequelize');

  sequelize = new Sequelize('mydb', 'root');

  Project = sequelize.define('Project', {
    name: Sequelize.STRING,
    description: Sequelize.TEXT
  });

  app = new App;

  app.get('/', function(request) {
    var project;
    project = Project.build({
      name: request.params.name
    });
    project.save().wait();
    return 'ok';
  });

  app.run();

}).call(this);
