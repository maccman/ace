Sequelize = require('sequelize')
sequelize = new Sequelize('mydb', 'root')

Post = sequelize.define('Post', 
  name: Sequelize.STRING,
  body: Sequelize.TEXT
)

# Post.__defineGetter__  'url', -> '/posts'
# Post::__defineGetter__ 'url', -> '/posts/' + @id

Post.sync()

app.set
  credentials: {dragon: 'slayer'}

app.before '/posts/:id', ->
  @post = Post.find(@route.id).wait()
  @ok

app.before ->
  if @request.method in ['post', 'put', 'delete']
    @authBasic (user, pass) ->
      @settings[user] is pass
  else
    @ok

app.get '/posts', ->
  posts = Post.all().wait()
  @eco 'posts/index', posts: posts
  
app.get '/posts/:id', ->
  @eco 'posts/show', @post

app.get '/posts/new', ->
  @eco 'posts/new'
  
app.get '/posts/:id/edit', ->
  @eco 'posts/edit', @post
  
app.post '/posts', ->
  post = Post.create(@params.post).wait()
  @redirect post

app.put '/posts/:id', ->
  @post.updateAttributes(@params.post).save()
  @redirect post

app.del '/posts/:id', ->
  @post.destroy().wait()
  @redirect Post