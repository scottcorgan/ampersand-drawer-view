var defaultStyle = require('./default-style');

module.exports = function () {
  return [
    '<div data-hook="adv-container" class="adv-container">',
    
      defaultStyle,
      
      '<div data-hook="adv-drawer" class="adv-drawer"></div>',
      
      '<div data-hook="adv-main" class="adv-main">','</div>',
      
    '</div>'
  ].join('');
};