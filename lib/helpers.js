(function() {
  var basicAuth, context, fs, head, path, redirect, sendFile, strata;

  fs = require('fs');

  path = require('path');

  strata = require('strata');

  context = require('./context');

  sendFile = function(file, options) {
    if (options == null) options = {};
    if (typeof file === 'string') {
      options.filename || (options.filename = path.basename(file));
      file = fs.createReadStream(file);
    }
    if (options.inline) options.disposition = 'inline';
    options.disposition || (options.disposition = 'attachment');
    options.type || (options.type = 'application/octet-stream');
    this.headers['Content-Type'] = options.type;
    this.headers['Content-Disposition'] = options.disposition;
    if (options.filename) {
      this.headers['Content-Disposition'] += "; filename=\"" + options.filename + "\"";
    }
    if (options.lastModified) this.headers['Last-Modified'] = options.lastModified;
    this.headers['Transfer-Encoding'] = 'chunked';
    return file;
  };

  head = function(status) {
    if (status == null) status = 200;
    return status;
  };

  redirect = function(url) {
    strata.redirect(this.env, this.callback, url.url || url);
    return this.served = true;
  };

  basicAuth = function(callback, realm) {
    var auth, creds, headers, pass, scheme, unauthorized, user, _ref, _ref2;
    if (realm == null) realm = 'Authorization Required';
    headers = {
      'Content-Type': 'text/plain',
      'WWW-Authenticate': "Basic realm='" + realm + "'"
    };
    unauthorized = [401, headers, 'Unauthorized'];
    auth = env.httpAuthorization;
    if (!auth) return unauthorized;
    _ref = authorization.split(' '), scheme = _ref[0], creds = _ref[1];
    if (scheme.toLowerCase() !== 'basic') return 400;
    _ref2 = new Buffer(creds, 'base64').toString().split(':'), user = _ref2[0], pass = _ref2[1];
    if (callback(user, pass)) {
      return 200;
    } else {
      return unauthorized;
    }
  };

  context.include({
    sendFile: sendFile,
    head: head,
    redirect: redirect,
    basicAuth: basicAuth,
    ok: 200,
    unauthorized: 401,
    forbidden: 403,
    not_found: 404,
    not_acceptable: 406
  });

  module.exports = {
    sendFile: sendFile,
    head: head,
    redirect: redirect,
    basicAuth: basicAuth
  };

}).call(this);
