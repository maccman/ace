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

  @headers['Content-Type'] = options.type
  @headers['Content-Disposition'] = options.disposition

  if options.filename
    @headers['Content-Disposition'] += "; filename=\"#{options.filename}\""

  if options.lastModified
    @headers['Last-Modified'] = options.lastModified

  @headers['Transfer-Encoding'] = 'chunked'
  
  file
  
head = (status = 200) ->
  status

redirect = (url) ->
  strata.redirect(@env, @callback, url.url or url)
  @served = true

basicAuth = (callback, realm = 'Authorization Required') ->
  headers = 
    'Content-Type': 'text/plain'
    'WWW-Authenticate': "Basic realm='#{realm}'"
  unauthorized = [401, headers, 'Unauthorized']
  
  auth = env.httpAuthorization
  return unauthorized unless auth
  
  [scheme, creds] = authorization.split(' ')
  return 400 if scheme.toLowerCase() != 'basic'

  [user, pass] = new Buffer(creds, 'base64').toString().split(':')
  if callback(user, pass) then 200 else unauthorized
  
context.include
  sendFile:       sendFile
  head:           head
  redirect:       redirect
  basicAuth:      basicAuth
  ok:             200
  unauthorized:   401
  forbidden:      403
  not_found:      404
  not_acceptable: 406

module.exports =
  sendFile: sendFile
  head: head
  redirect: redirect
  basicAuth: basicAuth