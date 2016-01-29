/* jshint node: true */
var uuid = require('node-uuid');

module.exports = {
  generate : function(){
    return uuid.v4();
  },
  generateShort : function(){
    return uuid.v4().replace(/-/g, '');
  }
};
