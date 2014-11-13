var prefix = require('./prefix');

module.exports = [
  '<style>',
    '[data-hook=adv-container]{height: 100%; overflow: hidden; width: 100%; position: relative;}',
    
    '[data-hook=adv-drawer]{',
      'background:#fff; height: 100%; overflow: auto; left: 0; position: absolute; top: 0; z-index: 3;',
      prefix.css + 'transform: translateX(0);',
    '}',
    '[data-hook=adv-container].narrow [data-hook=adv-drawer]{',
      prefix.css + 'transform: translateX(-100%);',
    '}',
    '[data-hook=adv-container].narrow.right [data-hook=adv-drawer]{',
      prefix.css + 'transform: translateX(100%);',
    '}',
    '[data-hook=adv-container].right [data-hook=adv-drawer]{left: auto; right: 0;}',
    '[data-hook=adv-container].drawer [data-hook=adv-drawer]{',
      prefix.css + 'transform: translateX(0) !important',
    '}',
    
    '[data-hook=adv-main]{background:#fff; float: right; height: 100%; overflow: auto; position: relative; z-index: 1;}',
    '[data-hook=adv-container].right [data-hook=adv-main]{float: left;}',
    
  '</style>',
].join('');