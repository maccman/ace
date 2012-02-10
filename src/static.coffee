path   = require('path')
fs     = require('fs')
mime   = require('mime')
strata = require('./index')
utils  = strata.utils

sendFile = (callback, path, stats) ->
  callback 200,
    'Content-Type': mime.lookup(path)
    'Content-Length': stats.size.toString()
    'Last-Modified': stats.mtime.toUTCString()
  , fs.createReadStream(path)

module.exports = (app, root, index) ->
  throw new strata.Error('Invalid root directory') if typeof root isnt 'string'
  throw new strata.Error("Directory #{root} does not exist") unless fs.existsSync(root)
  throw new strata.Error("#{root} is not a directory") unless fs.statSync(root).isDirectory()
  index = [ index ]  if index and typeof index is 'string'

  (env, callback) ->
    unless env.requestMethod is 'GET'
      return app(env, callback)

    pathInfo = unescape(env.pathInfo)

    unless pathInfo.indexOf('..') is -1
      return utils.forbidden(env, callback)

    fullPath = path.join(root, pathInfo)

    exists = fs.existsSync(fullPath)
    return app(env, callback) unless exists

    stats = fs.statSync(fullPath)

    if stats.isFile()
      sendFile(callback, fullPath, stats)

    else if stats.isDirectory() and index
      for indexPath in index
        indexPath = path.join(fullPath, indexPath)
        exists    = fs.existsSync indexPath
        if exists
          sendFile callback, indexPath, stats
          break
      app(env, callback)

    else
      app(env, callback)