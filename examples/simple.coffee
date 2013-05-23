Ace = require('../src')
app = new Ace.App

app.get '/', ->
  'Hello World!'

app.serve()