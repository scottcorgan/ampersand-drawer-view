module.exports = function (element, styleName) {
  
  var styles = window.getComputedStyle(element);
  var result = styles.getPropertyValue(styleName);
  
  if (result === null || result === undefined) {
    result = "";
  }
  
  return result;
};