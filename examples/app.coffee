Sequelize = require('sequelize')
strata    = require('ace').strata

sequelize = new Sequelize('mydb', 'root')
Post = sequelize.define('Post', {
    name: Sequelize.STRING,
    body: Sequelize.TEXT
  },
    classMethods:
      url: -> '/posts'
    instanceMethods:
      url: -> '/posts/' + @id
      toJSON: -> @values
)

Post.sync()

app.use strata.methodOverride

app.set credentials: {dragon: 'slayer'}

app.before ->
  if @request.method isnt 'GET' and !@session.user
    @redirect '/login'

app.get '/login', ->
  success = @basicAuth (user, pass) ->
    @settings.credentials[user] is pass and user

  if success
    @session.user = success
    @redirect '/'

app.get '/logout', ->
  @session = {}
  @redirect '/'

app.get '/posts', ->
  @posts = Post.all().wait()
  if @acceptsJSON
    @jsonp @posts
  else
    @eco 'posts/index'

app.get '/posts/new', ->
  @eco 'posts/new'

app.get '/posts/:id', ->
  @post = Post.find(+@route.id).wait()
  @eco 'posts/show'

app.get '/posts/:id/edit', ->
  @post = Post.find(+@route.id).wait()
  @eco 'posts/edit'

app.post '/posts', ->
  @post = Post.create(
    name: @params.name,
    body: @params.body
  ).wait()
  @redirect @post

app.put '/posts/:id', ->
  @post = Post.find(+@route.id).wait()
  @post.updateAttributes(
    name: @params.name,
    body: @params.body
  ).wait()
  @redirect @post

app.del '/posts/:id', ->
  @post = Post.find(+@route.id).wait()
  @post.destroy().wait()
  @redirect Post

app.root '/posts'