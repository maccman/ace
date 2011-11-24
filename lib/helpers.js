(function() {
  var context, fs, head, path, sendFile;

  fs = require('fs');

  path = require('path');

  context = require('./context');

  sendFile = function(file, options) {
    var headers;
    if (options == null) options = {};
    if (typeof file === 'string') {
      options.filename || (options.filename = path.basename(file));
      file = fs.createReadStream(file);
    }
    if (options.inline) options.disposition = 'inline';
    options.disposition || (options.disposition = 'attachment');
    options.type || (options.type = 'application/octet-stream');
    headers = {};
    headers['Content-Type'] = options.type;
    headers['Content-Disposition'] = options.disposition;
    if (options.filename) {
      headers['Content-Disposition'] += "; filename=\"" + options.filename + "\"";
    }
    if (options.lastModified) headers['Last-Modified'] = options.lastModified;
    headers['Transfer-Encoding'] = 'chunked';
    return [200, headers, file];
  };

  head = function(status, body) {
    if (status == null) status = 200;
    if (body == null) body = '';
    return [status, {}, body];
  };

  context.include({
    sendFile: sendFile,
    head: head
  });

  module.exports = {
    sendFile: sendFile,
    head: head
  };

}).call(this);
