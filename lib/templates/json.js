(function() {
  var coffee, compile, context, fs, json, jsonp, path;

  path = require('path');

  fs = require('fs');

  context = require('../context');

  coffee = require('coffee-script');

  compile = function(object) {
    return JSON.stringify(object);
  };

  json = function(object) {
    this.contentType = 'application/json';
    return compile(object);
  };

  jsonp = function(object, options) {
    var cb, result;
    if (options == null) options = {};
    cb = options.callback;
    cb || (cb = this.params.callback);
    result = this.json(object);
    if (cb) result = "" + cb + "(" + result + ")";
    return result;
  };

  context.include({
    json: json,
    jsonp: jsonp
  });

  module.exports = compile;

}).call(this);
