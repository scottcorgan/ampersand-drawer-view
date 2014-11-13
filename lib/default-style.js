var prefix = require('./prefix');

module.exports = [
  '<style>',
    '.adv-container{height: 100%; overflow: hidden; width: 100%; position: relative;}',
    
    '.adv-drawer{',
      'height: 100%; overflow: auto; left: 0; position: absolute; top: 0; z-index: 3;',
      prefix.css + 'transform: translateX(0);',
    '}',
    '.adv-container.narrow .adv-drawer{',
      prefix.css + 'transform: translateX(-100%);',
    '}',
    '.adv-container.narrow.right .adv-drawer{',
      prefix.css + 'transform: translateX(100%);',
    '}',
    '.adv-container.right .adv-drawer{left: auto; right: 0;}',
    '.adv-container.drawer .adv-drawer{',
      prefix.css + 'transform: translateX(0) !important',
    '}',
    
    '.adv-main{float: right; height: 100%; overflow: auto; position: relative; z-index: 1;}',
    '.adv-container.right .adv-main{float: left;}',
    
    '.adv-toggle{}',    
  '</style>',
].join('');