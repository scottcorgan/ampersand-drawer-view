var test = require('tape');
var DrawerView = require('../ampersand-drawer-view');
var View = require('ampersand-view');
var outerWidth = require('outerwidth');
var outerHeight = require('../lib/outerheight');
var rawStyle = require('../lib/raw-style');

// Set up body,html
var html = document.querySelector('html');
html.style.height = '1000px';
html.style.width = '1000px';
html.style.margin = '0';
html.style.padding = '0';
document.body.style.height = '100%';
document.body.style.width = '100%';
document.body.style.margin = '0';
document.body.style.padding = '0';

test('default layout', function (t) {
  
  var drawerView = new DrawerView({});
  
  document.body.appendChild(drawerView.el);
  
  // Elements
  t.equal(drawerView.el.tagName, 'DIV', 'wrapper tag');
  t.ok(drawerView.drawer, 'drawer container');
  t.ok(drawerView.main, 'main content container');
  t.ok(drawerView.toggle, 'drawer toggle');
  t.equal(drawerView.toggle.innerText, 'Toggle', 'drawer toggle text');
  
  // Size
  t.equal(outerWidth(drawerView.el), 1000, 'default el width');
  t.equal(outerHeight(drawerView.el), 1000, 'default el height');
  // TODO: this breaks in phantomjs, but works in real browsers
  // t.equal(outerWidth(drawerView.main), outerWidth(drawerView.el) - 256, 'default drawer width');
  t.equal(outerWidth(drawerView.drawer), 256, 'default drawer width');
  
  // Layout
  t.equal(rawStyle(drawerView.el, 'overflow'), 'hidden', 'el overflow');
  t.equal(rawStyle(drawerView.drawer, 'overflow'), 'auto', 'drawer overflow');
  t.equal(rawStyle(drawerView.main, 'overflow'), 'auto', 'main overflow');
  t.equal(rawStyle(drawerView.drawer, 'float'), 'left', 'drawer float');
  t.equal(rawStyle(drawerView.main, 'float'), 'left', 'main float');
  
  document.body.innerHTML = '';
  t.end();
});



// test('testing', function (t) {
  
//   var MainView = View.extend({
//     template: '<div></div>',
    
//     render: function () {
      
//       this.renderWithTemplate();
      
//       var drawer = new DrawerView({
        
//       });
//     }
//   });
  
//   var mainView = new MainView();
//   document.body.appendChild(mainView.render().el);
  
//   t.end();
// });



// test('replaces default elements with elements defined with data-hook', function (t) {
  
//   // <div data-hook="drawer"></div>
//   // <div data-hook="main"></div>
//   // <button data-hook="toggle"></button>
  
//   t.end();
// });