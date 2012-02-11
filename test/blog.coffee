Sequelize = require('sequelize')
sequelize = new Sequelize('mydb', 'root')

Post = sequelize.define('Post', {
  name: Sequelize.STRING,
  body: Sequelize.TEXT
  }, {
    url: -> '/posts'
  }, {
    url: -> '/posts/' + @id
  }
)

Post.sync()

app.set credentials: {dragon: 'slayer'}

app.before ->
  if @request.method isnt 'GET' and !@session.user
    @redirect '/login'

app.before ['/posts/:id', '/post/:id/*'], ->
  @post = Post.find(@route.id).wait()
  @ok

app.get '/login', ->
  success = @basicAuth (user, pass) ->
    @settings.credentials[user] is pass and user

  if success
    @session.user = success
    @redirect '/'

app.get '/logout', ->
  @session = {}

app.get '/posts', ->
  @posts = Post.all().wait()
  @eco 'posts/index'

app.get '/posts/:id', ->
  @eco 'posts/show'

app.get '/posts/new', ->
  @eco 'posts/new'

app.get '/posts/:id/edit', ->
  @eco 'posts/edit'

app.post '/posts', ->
  post = Post.create(@params.post).wait()
  @redirect post

app.put '/posts/:id', ->
  @post.updateAttributes(@params.post).wait()
  @redirect post

app.del '/posts/:id', ->
  @post.destroy().wait()
  @redirect Post

app.root '/posts'