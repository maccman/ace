strata = require('strata')

class Response extends strata.Response
  constructor: (@status, @headers, @body) ->
    if Array.isArray(status)
      [@status, @headers, @body] = status
    super()

module.exports = Response