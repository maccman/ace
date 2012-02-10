fs      = require('fs')
path    = require('path')
strata  = require('strata')
context = require('./context')

sendFile = (file, options = {}) ->
  if typeof file is 'string'
    options.filename or= path.basename(file)
    file = fs.createReadStream(file)

  options.disposition = 'inline' if options.inline
  options.disposition or= 'attachment'
  options.type        or= 'application/octet-stream'

  headers = {}
  headers['Content-Type'] = options.type
  headers['Content-Disposition'] = options.disposition

  if options.filename
    headers['Content-Disposition'] += "; filename=\"#{options.filename}\""

  if options.lastModified
    headers['Last-Modified'] = options.lastModified

  headers['Transfer-Encoding'] = 'chunked'

  [200, headers, file]

head = (status = 200, body = '') ->
  [status, {}, body]

redirect = (url) ->
  strata.redirect(@env, @callback, url)
  @served = true

context.include
  sendFile: sendFile
  head: head
  redirect: redirect

module.exports =
  sendFile: sendFile
  head: head