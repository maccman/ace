strata  = require 'strata'
context = require './context'

passesRoute = (env, route) ->
  route = strata.Router.compileRoute(route, [])
  return route.test(env.pathInfo)

passes = (env, conditions) ->
  if conditions is true
    true

  else if typeof conditions is 'function'
    conditions(env)

  else if typeof conditions is 'string'
    passesRoute(env, conditions)

  else if Array.isArray(conditions)
    conditions.some (route) ->
      passesRoute(env, route)

  else
    request = new strata.Request(env)

    # Match conditions against the request & env object,
    # either by a regex test, or a strict comparision

    for key, value of conditions
      if value.test?
        return true if value.test(request[key])
        return true if value.test(env[key])

      else
        return true if request[key] is value
        return true if env[key] is value

    false

module.exports = (app, filters, base) ->
  (env, callback) ->
    app env, ->
      original = arguments

      # If the filter returns a status code other
      # than 200, then callback with the data
      # from the filter, otherwise carry on with
      # the original request.
      proxiedCallback = (status) ->
        if @status is 200
          callback(original...)
        else
          callback(arguments...)

      for filter in filters
        [conditions, filterCallback] = filter

        if passes(env, conditions)
          return context.wrap(filterCallback, base)(env, proxiedCallback)

      callback(original...)