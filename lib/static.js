(function() {
  var fs, mime, path, sendFile, strata, utils;

  path = require('path');

  fs = require('fs');

  mime = require('mime');

  strata = require('./index');

  utils = strata.utils;

  sendFile = function(callback, path, stats) {
    return callback(200, {
      'Content-Type': mime.lookup(path),
      'Content-Length': stats.size.toString(),
      'Last-Modified': stats.mtime.toUTCString()
    }, fs.createReadStream(path));
  };

  module.exports = function(app, root, index) {
    if (typeof root !== 'string') throw new strata.Error('Invalid root directory');
    if (!fs.existsSync(root)) {
      throw new strata.Error("Directory " + root + " does not exist");
    }
    if (!fs.statSync(root).isDirectory()) {
      throw new strata.Error("" + root + " is not a directory");
    }
    if (index && typeof index === 'string') index = [index];
    return function(env, callback) {
      var exists, fullPath, indexPath, pathInfo, stats, _i, _len;
      if (env.requestMethod !== 'GET') return app(env, callback);
      pathInfo = unescape(env.pathInfo);
      if (pathInfo.indexOf('..') !== -1) return utils.forbidden(env, callback);
      fullPath = path.join(root, pathInfo);
      exists = fs.existsSync(fullPath);
      if (!exists) return app(env, callback);
      stats = fs.statSync(fullPath);
      if (stats.isFile()) {
        return sendFile(callback, fullPath, stats);
      } else if (stats.isDirectory() && index) {
        for (_i = 0, _len = index.length; _i < _len; _i++) {
          indexPath = index[_i];
          indexPath = path.join(fullPath, indexPath);
          exists = fs.existsSync(indexPath);
          if (exists) {
            sendFile(callback, indexPath, stats);
            break;
          }
        }
        return app(env, callback);
      } else {
        return app(env, callback);
      }
    };
  };

}).call(this);
