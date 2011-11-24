(function() {
  var App, Project, Sequelize, app, sequelize, sleep;

  require('./ext');

  App = require('./app');

  sleep = require('./fibers').sleep;

  Sequelize = require('sequelize');

  sequelize = new Sequelize('mydb', 'root');

  Project = sequelize.define('Project', {
    name: Sequelize.STRING,
    description: Sequelize.TEXT
  });

  app = new App;

  app.get('/users/:name', function() {
    return this.response("Hi " + this.params.name);
  });

  app.get('/', function() {
    var project;
    project = Project.build({
      name: this.params.name
    });
    project.save().wait();
    sleep(1000);
    return 'ok';
  });

  app.run();

}).call(this);
