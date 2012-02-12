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

    ace.get '/users', ->
      'Hello World'

Anything returned from a routing callback is set as the response body.

You can also specify a routing pattern, which is available in the callback under the `@route` object.

    ace.get '/users/:name', ->
      "Hello #{@route.name}"

##Responses

As well as returning the response body as a string, you

    @response [200, {}, '']
    @response ''
    @response ->

##Static

    @app.set public: './public'

##Templates

    @eco 'test', name: @route.name

##Fibers

    exists = fs.exists.bind(fs)

    @sleep()

    app.get '/projects', ->
      project = Project.build(
        name: @params.name
      )

      project.save().wait()

      "Saved project: #{project.id}"

##Session

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

##Credits

Ace was built by [Alex MacCaw](http://alexmaccaw.com) and [Michael Jackson](http://mjijackson.com/).