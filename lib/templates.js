(function() {
  var context, name, path, resolve, _i, _len, _ref;

  path = require('path');

  context = require('./context');

  _ref = ['coffee', 'eco', 'ejs', 'json', 'less', 'mustache', 'stylus'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    name = _ref[_i];
    try {
      require("./templates/" + name);
    } catch (_error) {}
  }

  resolve = function(name, raise) {
    if (raise == null) raise = true;
    console.log(path.resolve(this.settings.views, name));
    try {
      return require.resolve(name);
    } catch (_error) {}
    try {
      return require.resolve(path.resolve(this.settings.views, name));
    } catch (_error) {}
    try {
      return require.resolve(path.resolve(this.settings.assets, name));
    } catch (_error) {}
    if (raise) throw "Cannot find " + name;
    return false;
  };

  context.include({
    resolve: resolve
  });

  module.exports = {
    resolve: resolve
  };

}).call(this);
