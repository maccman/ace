(function() {
  var Response, strata;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  strata = require('strata');

  Response = (function() {

    __extends(Response, strata.Response);

    function Response(status, headers, body) {
      this.status = status;
      this.headers = headers;
      this.body = body;
      if (Array.isArray(status)) {
        this.status = status[0], this.headers = status[1], this.body = status[2];
      }
      Response.__super__.constructor.call(this);
    }

    return Response;

  })();

  module.exports = Response;

}).call(this);
