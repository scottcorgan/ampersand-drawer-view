module.exports = function outfit (element, styles) {
  
  Object.keys(styles).forEach(function (key) {
    
    element.style[key] = styles[key];
  });
  
  return element;
};