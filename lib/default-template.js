var defaultStyle = require('./default-style');

module.exports = function () {
  return [
    '<div class="adv-container">',
    
      defaultStyle,
      
      '<div data-hook="drawer" class="adv-drawer"></div>',
      '<div data-hook="main" class="adv-main">',
        '<button data-hook="toggle" class="adv-toggle">Toggle</button>',
      '</div>',
    '</div>'
  ].join('');
};