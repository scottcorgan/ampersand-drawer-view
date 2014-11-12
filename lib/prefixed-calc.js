var prefix = require('./prefix');

module.exports = function (calculation) {
  
  return prefix.css + 'calc(' +  calculation + ')';
};