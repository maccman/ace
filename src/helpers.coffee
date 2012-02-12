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

  @body = file

head = (status = 200) ->
  @status = status

redirect = (location, status) ->
  location = location.url?() or location.url or location
  @response.redirect(location, status)

basicAuth = (callback, realm = 'Authorization Required') ->
  unauthorized = =>
    @status      = 401
    @contentType = 'text/plain'
    @headers['WWW-Authenticate'] = "Basic realm='#{realm}'"
    @body        = 'Unauthorized'
    false

  auth = @env.httpAuthorization
  return unauthorized() unless auth

  [scheme, creds] = auth.split(' ')
  return @head(@badRequest) if scheme.toLowerCase() != 'basic'

  [user, pass] = new Buffer(creds, 'base64').toString().split(':')
  if result = callback.call(this, user, pass)
    @head(@ok) and result
  else
    unauthorized()

context.include
  sendFile:       sendFile
  head:           head
  redirect:       redirect
  basicAuth:      basicAuth
  ok:             200
  badRequest:     400
  unauthorized:   401
  forbidden:      403
  notFound:       404
  notAcceptable:  406

module.exports =
  sendFile: sendFile
  head: head
  redirect: redirect
  basicAuth: basicAuth