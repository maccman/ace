fs      = require('fs')
path    = require('path')
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
  
context.include
  sendFile: sendFile
  head: head

module.exports =
  sendFile: sendFile
  head: head