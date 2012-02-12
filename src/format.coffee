mime = require('mime')
path = require('path')

module.exports = (app, defaultType) ->
  (env, callback) ->
    pathInfo   = env.pathInfo
    ext        = path.extname(pathInfo)
    format     = if ext then mime.lookup(ext) else null
    env.format = format

    # Modify env.pathInfo for downstream apps.
    env.pathInfo = pathInfo.replace(new RegExp("#{ext}$"), '') if ext

    app env, (status, headers, body) ->
        # Reset env.pathInfo for upstream apps.
        env.pathInfo = pathInfo

        callback(status, headers, body)