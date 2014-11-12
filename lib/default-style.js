var prefix = require('./prefix');

module.exports = [
  '<style>',
    '.adv-container{height: 100%; overflow: hidden; width: 100%; position: relative;}',
    
    '.adv-drawer{',
      'height: 100%; left: 0; overflow: auto; position: absolute; top: 0;',
      prefix.css + 'transform: translateX(0);',
    '}',
    '.adv-container.narrow .adv-drawer{',
      prefix.css + 'transform: translateX(-100%);',
    '}',
    
    '.adv-main{height: 100%; float: right; overflow: auto; position: relative}',
    
    '.adv-toggle{}',
    
  '</style>',
].join('');