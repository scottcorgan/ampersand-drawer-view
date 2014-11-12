var _ = require('underscore');
var test = require('tape');
var DrawerView = require('../ampersand-drawer-view');
var View = require('ampersand-view');
var outerWidth = require('outerwidth');
var outerHeight = require('../lib/outerheight');
var rawStyle = require('../lib/raw-style');
var trigger = require('../lib/trigger');
var prefix = require('../lib/prefix');

var DRAWER_VISIBLE_MATRIX = 'matrix(1, 0, 0, 1, 0, 0)';
var DRAWER_HIDDEN_MATRIX = 'matrix(1, 0, 0, 1, -256, 0)';

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
  t.equal(rawStyle(drawerView.drawer, 'position'), 'absolute', 'position absolute');
  t.equal(rawStyle(drawerView.drawer, 'left'), '0px', 'position location left');
  t.equal(rawStyle(drawerView.drawer, 'top'), '0px', 'position location top');
  t.equal(rawStyle(drawerView.main, 'float'), 'right', 'main float');
  
  drawerView.remove();
  t.end();
});

test('custom drawer width', function (t) {
  
  var drawerView = new DrawerView({
    drawerWidth: 300
  });
  document.body.appendChild(drawerView.el);
  
  t.equal(outerWidth(drawerView.drawer), 300, 'default drawer width');
  
  drawerView.remove();
  t.end();
});

test('custom responsive width', function (t) {
  
  var drawerView = new DrawerView({
    responsiveWidth: 1200
  });
  
  document.body.appendChild(drawerView.el);
  
  setTimeout(function () {
    
    t.equal(rawStyle(drawerView.drawer, prefix.css + 'transform'), DRAWER_HIDDEN_MATRIX, 'drawer is hidden');
    t.equal(rawStyle(drawerView.main, 'width'), outerWidth(drawerView.el) + 'px', 'main container full width');
    
    drawerView.remove();
    t.end();
  }, 10);
  
});

test('drawer hides when responsive width threshold is crossed', function (t) {
  
  var drawerView = new DrawerView({
    responsiveWidth: 600
  });
  
  document.body.appendChild(drawerView.el);
  
  setTimeout(function () {
    
    // Drawer visible
    t.equal(rawStyle(drawerView.drawer, prefix.css + 'transform'), DRAWER_VISIBLE_MATRIX, 'drawer is visible');
    t.ok(outerWidth(drawerView.main) < outerWidth(drawerView.el), 'main container partial width');
    
    document.body.style.width = "400px";
    trigger(window, 'resize');
    
    _.defer(function () {
      
      // Drawer hidden
      t.equal(rawStyle(drawerView.drawer, prefix.css + 'transform'), DRAWER_HIDDEN_MATRIX, 'drawer is hidden');
      t.equal(rawStyle(drawerView.main, 'width'), outerWidth(drawerView.el) + 'px', 'main container full width');
      
      document.body.style.width = "1000px";
      trigger(window, 'resize');
      
      _.defer(function () {
        
        // Drawer visible
        t.equal(rawStyle(drawerView.drawer, prefix.css + 'transform'), DRAWER_VISIBLE_MATRIX, 'drawer is visible');
        // TODO: phantomjs does not support calc(), but this test passes in browser
        // t.ok(outerWidth(drawerView.main) < outerWidth(drawerView.el), 'main container full width');
        
        drawerView.remove();
        t.end();
      });
    });
  }, 10);
});

test('renders element as narrow', function (t) {
  
  
  
  t.end();
});

// test('replaces default elements with elements defined with data-hook', function (t) {
  
//   // <div data-hook="drawer"></div>
//   // <div data-hook="main"></div>
//   // <button data-hook="toggle"></button>
  
//   t.end();
// });