(function() {
  var context, name, path, resolve, _i, _len, _ref;

  path = require('path');

  context = require('./context');

  _ref = ['coffee', 'eco', 'less', 'mustache', 'stylus'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    name = _ref[_i];
    try {
      require("./templates/" + name);
    } catch (_error) {}
  }

  resolve = function(name) {
    try {
      return require.resolve(name);
    } catch (_error) {}
    try {
      return require.resolve(path.join(this.settings.view || '', name));
    } catch (_error) {}
    throw "Cannot find " + name;
  };

  context.include({
    resolve: resolve
  });

  module.exports = {
    resolve: resolve
  };

}).call(this);
