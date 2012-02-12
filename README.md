Ace is [Sinatra](http://www.sinatrarb.com/) for Node, a simple web-server with a straightforward API.

Every request is wrapped in a [Node Fiber](https://github.com/laverdet/node-fibers), allowing you to program in a synchronous manner without callbacks, but with all the advantages of an asynchronous web-server.

Ace is built on the the rock solid [Strata HTTP framework](http://stratajs.org/).

##Usage

Node >= v0.7.3 is required, as well as npm. To install, run:

    npm install -g ace

To generate a new app, run:

    ace new myapp
    cd myapp

To serve up an app, run:

    ace

##Routing

In Ace, a route is a HTTP method paired with a URL matching pattern. For example:

    app.get '/users', ->
      'Hello World'

Anything returned from a routing callback is set as the response body.

You can also specify a routing pattern, which is available in the callback under the `@route` object.

    app.get '/users/:name', ->
      "Hello #{@route.name}"

##Responses

As well as returning the response body as a string from the routing callback, you can set the response attributes directly:

    app.get '/render', ->
      @headers['Transfer-Encoding'] = 'chunked'
      @contentType = 'text/html'
      @status = 200
      @body = 'my body'

You can set the `@headers`, `@status` and `@body` attributes to alter the request's response.

If you only need to set the status code, you can just return it directly from the routing callback. The properties `@ok`, `@unauthorized` and `@notFound` are aliased to the relevant status codes.

    app.get '/render', ->
      @ok

##Parameters

URL encoded forms, multipart uploads and JSON parameters are available via the `@params` object:

    app.post '/posts', ->
      @post = Post.create(
        name: @params.name,
        body: @params.body
      ).wait()

      @redirect "/posts/#{@post.id}"

##Static

By default, if a folder called `public` exists under the app root, its contents will be served up statically. You can configure the path of this folder like so:

    app.set public: './public'

You can add static assets like stylesheets and images to the `public` folder. They'll be served up automatically.

##Templates

Ace includes support for rendering CoffeeScript, Eco, EJS, Less, Mustache and Stylus templates. Simply install the relevant module and the templates will be available to render.

For example, install the [eco](https://github.com/sstephenson/eco) module and the `@eco` function will be available to you.

    app.get '/users/:name', ->
      @name = @route.name
      @eco 'user/show'

The `@eco` function takes a path of the Eco template. By default, this should be located under a folder named `./views`.
The template is rendered in the current context, so you can pass variables to them by setting them locally.

If a file exists under `./views/layout.*`, then it'll be used as the application's default layout. You can specify a different layout with the `layout` option.

    app.get '/users', ->
      @users = User.all().wait()
      @mustache 'user/list', layout: 'basic'

##JSON

You can serve up JSON and JSONP with the `@json` and `@jsonp` helpers respectively.

    app.get '/users', ->
      @json {status: 'ok'}

    app.get '/users', ->
      @users = User.all().wait()
      @jsonp @users

By default, `@jsonp` uses the `@params.callback` parameter as the name of its wrapper function.

##Fibers

    exists = fs.exists.bind(fs)

    @sleep()

    app.get '/projects', ->
      project = Project.build(
        name: @params.name
      )

      project.save().wait()

      "Saved project: #{project.id}"

##Cookies & Session

    app.get '/login', ->
      user = User.find(email: @params.email).wait()
      @session.user_id = user.id
      @redirect '/'

##Filters

    app.before ->
      # Before filter

    app.before '/users*', ->
    app.before conditionFunction, ->

    app.context.include
      loggedIn: -> !!@session.user_id

    app.before '/admin*', ->
      if @loggedIn()
        @ok
      else
        @redirect '/login'

##Configuration

    @app.set sessions: true
             port: 3000

##Helpers

    app.get '/redirect', ->
      @redirect 'http://google.com'

    @head 200
    @ok

    @sendFile

    @authBasic

##Credits

Ace was built by [Alex MacCaw](http://alexmaccaw.com) and [Michael Jackson](http://mjijackson.com/).