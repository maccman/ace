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

redirect = (location, status = 302) ->
  location = location.url?() or location.url or location
  content  = "<p>You are being redirected to <a href=\"#{location}\">#{location}</a>.</p>"
  @status  = status
  @headers['Location'] = location

basicAuth = (callback, realm = 'Authorization Required') ->
  unauthorized = =>
    headers =
      'Content-Type': 'text/plain'
      'WWW-Authenticate': "Basic realm='#{realm}'"

    @status  = 401
    @headers = headers
    @body    = 'Unauthorized'
    false

  auth = env.httpAuthorization
  return unauthorized() unless auth

  [scheme, creds] = authorization.split(' ')
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