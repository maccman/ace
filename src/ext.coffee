EventEmitter = require('events').EventEmitter
EventEmitter::wait = (success = 'success', failure = 'failure') ->
  deffered = Q.defer()
  @on success, -> deffered.resolve(arguments...)
  @on failure, -> deffered.fail(arguments...)
  deffered.promise