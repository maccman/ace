(function() {
  var mime, path;

  mime = require('mime');

  path = require('path');

  module.exports = function(app, defaultType) {
    return function(env, callback) {
      var ext, format, pathInfo;
      pathInfo = env.pathInfo;
      ext = path.extname(pathInfo);
      format = ext ? mime.lookup(ext) : null;
      env.format = format;
      if (ext) env.pathInfo = pathInfo.replace(new RegExp("" + ext + "$"), '');
      return app(env, function(status, headers, body) {
        env.pathInfo = pathInfo;
        return callback(status, headers, body);
      });
    };
  };

}).call(this);
