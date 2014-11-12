module.exports = function (element) {
  
  var computed = window.getComputedStyle(element);
  var top = computed.marginTop.replace('px', '');
  var bottom = computed.marginBottom.replace('px', '');
  
  return +element.offsetHeight + +top + +bottom;
};