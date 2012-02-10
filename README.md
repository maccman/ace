##Usage

    ace myapp.coffee

##Response

    @response [200, {}, '']
    @response ''
    @response ->

##Params & Route

    app.get '/users/:name', ->
      "Hi #{@route.name}"

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