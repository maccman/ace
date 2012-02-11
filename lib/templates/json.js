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
    var cb;
    if (options == null) options = {};
    cb = options.callback;
    cb || (cb = this.params.callback);
    cb || (cb = 'callback');
    return json({}[cb] = object);
  };

  context.include({
    json: json,
    jsonp: jsonp
  });

  module.exports = compile;

}).call(this);
