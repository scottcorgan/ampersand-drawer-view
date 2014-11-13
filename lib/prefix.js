module.exports = (function () {
  var styles = window.getComputedStyle(document.documentElement, ''),
  
    pre = (Array.prototype.slice
      .call(styles)
      .join('') 
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1],
    
    dom = ('webkit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
    
  return {
    dom: dom,
    lowercase: pre,
    css: '-' + pre + '-',
    js: dom
  };
})();