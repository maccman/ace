(function() {
  var Request, strata;

  strata = require('strata');

  Request = (function() {

    function Request(env) {
      this.request = new strata.Request(env);
    }

    Request.prototype.query = function() {
      return this.request.query.bind(this.request).wait();
    };

    Request.prototype.params = function() {
      return this.request.params.bind(this.request).wait();
    };

    Request.prototype.cookies = function() {
      return this.request.cookies.bind(this.request).wait();
    };

    Request.prototype.body = function() {
      return this.request.body.bind(this.request).wait();
    };

    Request.prototype.__defineGetter__('cookies', Request.prototype.cookies);

    Request.prototype.__defineGetter__('params', Request.prototype.params);

    Request.prototype.__defineGetter__('query', Request.prototype.query);

    Request.prototype.__defineGetter__('body', Request.prototype.body);

    Request.prototype.__defineGetter__('formData', function() {
      return this.request.formData;
    });

    Request.prototype.__defineGetter__('parseableData', function() {
      return this.request.parseableData;
    });

    Request.prototype.__defineGetter__('url', function() {
      return this.request.url;
    });

    Request.prototype.__defineGetter__('fullPath', function() {
      return this.request.fullPath;
    });

    Request.prototype.__defineGetter__('path', function() {
      return this.request.path;
    });

    Request.prototype.__defineGetter__('baseUrl', function() {
      return this.request.baseUrl;
    });

    Request.prototype.__defineGetter__('port', function() {
      return this.request.port;
    });

    Request.prototype.__defineGetter__('host', function() {
      return this.request.host;
    });

    Request.prototype.__defineGetter__('hostWithPort', function() {
      return this.request.hostWithPort;
    });

    Request.prototype.__defineGetter__('xhr', function() {
      return this.request.xhr;
    });

    Request.prototype.__defineGetter__('ssl', function() {
      return this.request.ssl;
    });

    Request.prototype.__defineGetter__('referrer', function() {
      return this.request.referrer;
    });

    Request.prototype.__defineGetter__('userAgent', function() {
      return this.request.userAgent;
    });

    Request.prototype.__defineGetter__('mediaType', function() {
      return this.request.mediaType;
    });

    Request.prototype.__defineGetter__('contentLength', function() {
      return this.request.contentLength;
    });

    Request.prototype.__defineGetter__('contentType', function() {
      return this.request.contentType;
    });

    Request.prototype.__defineGetter__('queryString', function() {
      return this.request.queryString;
    });

    Request.prototype.__defineGetter__('pathInfo', function() {
      return this.request.pathInfo;
    });

    Request.prototype.__defineGetter__('scriptName', function() {
      return this.request.scriptName;
    });

    Request.prototype.__defineGetter__('remotePort', function() {
      return this.request.remotePort;
    });

    Request.prototype.__defineGetter__('time', function() {
      return this.request.time;
    });

    Request.prototype.__defineGetter__('method', function() {
      return this.request.method;
    });

    Request.prototype.__defineGetter__('protocolVersion', function() {
      return this.request.protocolVersion;
    });

    Request.prototype.__defineGetter__('protocol', function() {
      return this.request.protocol;
    });

    Request.prototype.acceptLanguage = function() {
      var _ref;
      return (_ref = this.request).acceptLanguage.apply(_ref, arguments);
    };

    Request.prototype.acceptEncoding = function() {
      var _ref;
      return (_ref = this.request).acceptEncoding.apply(_ref, arguments);
    };

    Request.prototype.acceptCharset = function() {
      var _ref;
      return (_ref = this.request).acceptCharset.apply(_ref, arguments);
    };

    Request.prototype.accept = function() {
      var _ref;
      return (_ref = this.request).accept.apply(_ref, arguments);
    };

    Request.prototype.__defineGetter__('uploadDir', function() {
      return this.request.uploadDir;
    });

    Request.prototype.__defineSetter__('uploadDir', function(value) {
      return this.request.uploadDir = value;
    });

    Request.prototype.__defineGetter__('uploadPrefix', function() {
      return this.request.uploadPrefix;
    });

    Request.prototype.__defineSetter__('uploadPrefix', function(value) {
      return this.request.uploadPrefix = value;
    });

    return Request;

  })();

  module.exports = Request;

}).call(this);
