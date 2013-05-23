Q = require('q')

exports.wait = (callback) ->
  deffered = Q.defer()

  callback.call this, (err, result) ->
    if err
      deffered.fail(err)
    else
      deffered.resolve(result)

  deffered.promise
