strata = require('strata')

class Request
  constructor: (env) ->
    @request = new strata.Request(env)

  query:   -> @request.query.bind(@request).wait()
  params:  -> @request.params.bind(@request).wait()
  cookies: -> @request.cookies.bind(@request).wait()
  body:    -> @request.body.bind(@request).wait()

  @::__defineGetter__ 'cookies',  @::cookies
  @::__defineGetter__ 'params',   @::params
  @::__defineGetter__ 'query',    @::query
  @::__defineGetter__ 'body',     @::body

  @::__defineGetter__ 'formData',        -> @request.formData
  @::__defineGetter__ 'parseableData',   -> @request.parseableData
  @::__defineGetter__ 'url',             -> @request.url
  @::__defineGetter__ 'fullPath',        -> @request.fullPath
  @::__defineGetter__ 'path',            -> @request.path
  @::__defineGetter__ 'baseUrl',         -> @request.baseUrl
  @::__defineGetter__ 'port',            -> @request.port
  @::__defineGetter__ 'host',            -> @request.host
  @::__defineGetter__ 'hostWithPort',    -> @request.hostWithPort
  @::__defineGetter__ 'xhr',             -> @request.xhr
  @::__defineGetter__ 'ssl',             -> @request.ssl
  @::__defineGetter__ 'referrer',        -> @request.referrer
  @::__defineGetter__ 'userAgent',       -> @request.userAgent
  @::__defineGetter__ 'mediaType',       -> @request.mediaType
  @::__defineGetter__ 'contentLength',   -> @request.contentLength
  @::__defineGetter__ 'contentType',     -> @request.contentType
  @::__defineGetter__ 'queryString',     -> @request.queryString
  @::__defineGetter__ 'pathInfo',        -> @request.pathInfo
  @::__defineGetter__ 'scriptName',      -> @request.scriptName
  @::__defineGetter__ 'remotePort',      -> @request.remotePort
  @::__defineGetter__ 'time',            -> @request.time
  @::__defineGetter__ 'method',          -> @request.method
  @::__defineGetter__ 'protocolVersion', -> @request.protocolVersion
  @::__defineGetter__ 'protocol',        -> @request.protocol

  acceptLanguage: -> @request.acceptLanguage(arguments...)
  acceptEncoding: -> @request.acceptEncoding(arguments...)
  acceptCharset:  -> @request.acceptCharset(arguments...)
  accept:         -> @request.accept(arguments...)

  @::__defineGetter__ 'uploadDir',            -> @request.uploadDir
  @::__defineSetter__ 'uploadDir',    (value) -> @request.uploadDir = value
  @::__defineGetter__ 'uploadPrefix',         -> @request.uploadPrefix
  @::__defineSetter__ 'uploadPrefix', (value) -> @request.uploadPrefix = value

module.exports = Request