Ace is [Sinatra](http://www.sinatrarb.com/) for Node; a simple web-server written in CoffeeScript with a straightforward API.

Every request is wrapped in a [Node Fiber](https://github.com/laverdet/node-fibers), allowing you to program in a synchronous manner without callbacks, but with all the advantages of an asynchronous web-server.

    app.put '/posts/:id', ->
      @post = Post.find(+@route.id).wait()
      @post.updateAttributes(
        name: @params.name,
        body: @params.body
      ).wait()
      @redirect @post

Ace is built on top of the rock solid [Strata HTTP framework](http://stratajs.org/).

##Examples

You can find an example blog app, including authentication and updating posts, in Ace's [examples directory](https://github.com/maccman/ace/tree/master/examples).

##Usage

Node >= v0.7.3 is required, as well as npm. Ace will run on older versions of Node, but will crash under heavy load due to a bug in V8 (now fixed).

To install, run:

    npm install -g git://github.com/maccman/ace.git

<!-- npm install -g ace -->

To generate a new app, run:

    ace new myapp
    cd myapp
    npm install .

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

POST, PUT and DELETE callbacks are also available, using the `post`, `put` and `del` methods respectively:

    app.post '/users', ->
      @user = User.create(
        name: @params.name
      ).wait()
      @redirect "/users/#{@user.id}"

    app.put '/users/:id', ->
      @user = User.find(+@route.id).wait()
      @user.updateAttributes(
        name: @params.name
      ).wait()
      @redirect "/users/#{@user.id}"

    app.del '/user/:id', ->
      @user = User.find(+@route.id).wait()
      @user.destroy().wait()
      @redirect "/users"

##Parameters

URL encoded forms, multipart uploads and JSON parameters are available via the `@params` object:

    app.post '/posts', ->
      @post = Post.create(
        name: @params.name,
        body: @params.body
      ).wait()

      @redirect "/posts/#{@post.id}"

##Request

You can access request information using the `@request` object.

    app.get '/request', ->
      result =
        protocol:     @request.protocol
        method:       @request.method
        remoteAddr:   @request.remoteAddr
        pathInfo:     @request.pathInfo
        contentType:  @request.contentType
        xhr:          @request.xhr
        host:         @request.host

      @json result

For more information, see [request.js](https://github.com/mjijackson/strata/blob/master/lib/request.js).

You can access the full request body via `@body`:

    app.get '/body', ->
      "You sent: #{@body}"

You can check to see what the request accepts in response:

    app.get '/users', ->
      @users = User.all().wait()

      if @accepts('application/json')
        @jsonp @users
      else
        @eco 'users/list'

You can also look at the request format (calculated from the URL's extension). This can often give a better indication of what clients are expecting in response.

      app.get '/users', ->
        @users = User.all().wait()

        if @format is 'application/json'
          @jsonp @users
        else
          @eco 'users/list'

Finally you can access the raw `@env` object:

    @env['Warning']

##Responses

As well as returning the response body as a string from the routing callback, you can set the response attributes directly:

    app.get '/render', ->
      @headers['Transfer-Encoding'] = 'chunked'
      @contentType = 'text/html'
      @status = 200
      @body = 'my body'

You can set the `@headers`, `@status` and `@body` attributes to alter the request's response.

If you only need to set the status code, you can just return it directly from the routing callback. The properties `@ok`, `@unauthorized` and `@notFound` are aliased to their relevant status codes.

    app.get '/render', ->
      # ...
      @ok

##Static

By default, if a folder called `public` exists under the app root, its contents will be served up statically. You can configure the path of this folder like so:

    app.set public: './public'

You can add static assets like stylesheets and images to the `public` folder.

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

By default `@jsonp` uses the `@params.callback` parameter as the name of its wrapper function.

##Fibers

Every request in Ace is wrapped in a Fiber. This means you can do away with the callback spaghetti that Node applications often descend it. Rather than use callbacks, you can simply pause the current fiber. When the callback returns, the fibers execution continues from where it left off.

In practice, Ace provides a couple of utility functions for pausing asynchronous functions. Ace adds a `wait()` function to `EventEmitter`. This transforms asynchronous calls on libraries such as [Sequelize](http://sequelizejs.com).

For example, `save()` is usually an asynchronous call which requires a callback. Here we can just call `save().wait()` and use a synchronous style.

    app.get '/projects', ->
      project = Project.build(
        name: @params.name
      )

      project.save().wait()

      @sleep(2000)

      "Saved project: #{project.id}"

This fiber technique also means we can implement functionality like `sleep()` in JavaScript, as in the previous example.

You can make an existing asynchronous function fiber enabled, by wrapping it with `Function::wait()`.

    syncExists = fs.exists.bind(fs).wait

    if syncExists('./path/to/file')
      @sendFile('./path/to/file)

Fibers are pooled, and by default there's a limit of 100 fibers in the pool. This means that you can serve up to 100 connections simultaneously. After the pool limit is reached, requests are queued. You can increase the pool size like so:

    app.pool.size = 250

##Cookies & Session

Sessions are enabled by default in Ace. You can set and retrieve data stored in the session by using the `@session` object:

    app.get '/login', ->
      user = User.find(email: @params.email).wait()
      @session.user_id = user.id
      @redirect '/'

You can retrieve cookies via the `@cookie` object, and set them with `@response.setCookie(name, value)`;

    app.get '/login', ->
      token = @cookies.rememberMe
      # ...

##Filters

Ace supports 'before' filters, callbacks that are executed before route handlers.

    app.before ->
      # Before filter

By default before filters are always executed. You can specify conditions to limit that, such as routes.

    app.before '/users*', ->

The previous filter will be executed before any routes matching `/users*` are.

As well as a route, you can specify a object to match the request against:

    app.before method: 'POST', ->
      ensureLogin()

Finally you can specify a conditional function that'll be passed the request's `env`, and should return a boolean indicating whether the filter should be executed or not.

    app.before conditionFunction, ->

If a filter changes the response status to anything other than 200, then execution will halt.

    app.before ->
      if @request.method isnt 'GET' and !@session.user
        @head 401

##Context

You can add extra properties to the routing callback context using `context.include()`:

    app.context.include
      loggedIn: -> !!@session.user_id

    app.before '/admin*', ->
      if @loggedIn()
        @ok
      else
        @redirect '/login'

The context includes a few utilities methods by default:

    @redirect(url)
    @sendFile(path)
    @head(status)

    @basicAuth (user, pass) ->
      user is 'foo' and pass is 'bar'

##Configuration

Ace includes some sensible default settings, but you can override them using `@set`, passing in an object of names to values.

    @app.set static:   true       # Serve up file statically from public
             sessions: true       # Enable sessions
             port:     1982       # Server port number
             bind:     '0.0.0.0'  # Bind to host
             views:    './views'  # Path to 'views' dir
             public:   './public' # Path to 'public' dir
             layout:   'layout'   # Name of application's default layout
             logging:  true       # Enable logging

Settings are available on the `@settings` object:

    if app.settings.logging is true
      console.log('Logging is enabled')

##Middleware

Middleware sits on the request stack, and gets executed before any of the routes. Using middleware, you can alter the request object such as HTTP headers or the request's path.

Ace sits on top of [Strata](http://stratajs.org/), so you can use any of the middleware that comes with the framework, or create your own.

For example, we can use Ace's [methodOverride](https://github.com/mjijackson/strata/blob/master/lib/methodoverride.js) middleware, enabling us to override the request's HTTP method with a `_method` parameter.

    strata = require('ace').strata
    app.use strata.methodOverride

This means we can use HTML forms to send requests other than `GET` or `POST` ones, keeping our application RESTful:

    <form action="<%= @post.url() %>" method="post">
      <input type="hidden" name="_method" value="delete">
      <button>Delete</button>
    </form>

For more information on creating your own middleware, see [Strata's docs](http://stratajs.org/manual/5).

##Credits

Ace was built by [Alex MacCaw](http://alexmaccaw.com) and [Michael Jackson](http://mjijackson.com/).