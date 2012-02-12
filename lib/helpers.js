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
    return this.body = file;
  };

  head = function(status) {
    if (status == null) status = 200;
    return this.status = status;
  };

  redirect = function(location, status) {
    location = (typeof location.url === "function" ? location.url() : void 0) || location.url || location;
    return this.response.redirect(location, status);
  };

  basicAuth = function(callback, realm) {
    var auth, creds, pass, result, scheme, unauthorized, user, _ref, _ref2,
      _this = this;
    if (realm == null) realm = 'Authorization Required';
    unauthorized = function() {
      _this.status = 401;
      _this.contentType = 'text/plain';
      _this.headers['WWW-Authenticate'] = "Basic realm='" + realm + "'";
      _this.body = 'Unauthorized';
      return false;
    };
    auth = this.env.httpAuthorization;
    if (!auth) return unauthorized();
    _ref = auth.split(' '), scheme = _ref[0], creds = _ref[1];
    if (scheme.toLowerCase() !== 'basic') return this.head(this.badRequest);
    _ref2 = new Buffer(creds, 'base64').toString().split(':'), user = _ref2[0], pass = _ref2[1];
    if (result = callback.call(this, user, pass)) {
      return this.head(this.ok) && result;
    } else {
      return unauthorized();
    }
  };

  context.include({
    sendFile: sendFile,
    head: head,
    redirect: redirect,
    basicAuth: basicAuth,
    ok: 200,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    notAcceptable: 406
  });

  module.exports = {
    sendFile: sendFile,
    head: head,
    redirect: redirect,
    basicAuth: basicAuth
  };

}).call(this);
