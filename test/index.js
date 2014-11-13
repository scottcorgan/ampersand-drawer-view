var _ = require('underscore');
var test = require('tape');
var DrawerView = require('../ampersand-drawer-view');
var View = require('ampersand-view');
var outerWidth = require('outerwidth');
var outerHeight = require('../lib/outerheight');
var rawStyle = require('../lib/raw-style');
var trigger = require('../lib/trigger');
var prefix = require('../lib/prefix');
var hasClass = require('../lib/has-class');
var style = require('../lib/outfit');

var DRAWER_VISIBLE_MATRIX = 'matrix(1, 0, 0, 1, 0, 0)';
var DRAWER_HIDDEN_LEFT_MATRIX = 'matrix(1, 0, 0, 1, -256, 0)';
var DRAWER_HIDDEN_RIGHT_MATRIX = 'matrix(1, 0, 0, 1, 256, 0)';

// Set up body,html
style(document.querySelector('html'), {
  height: '1000px',
  width: '1000px',
  margin: '0',
  padding: '0'
});

style(document.body, {
  height: '100%',
  width: '100%',
  margin: '0',
  padding: '0'
});

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
  t.equal(rawStyle(drawerView.drawer, 'z-index'), '3', 'drawer z-index');
  t.equal(rawStyle(drawerView.main, 'z-index'), '1', 'main z-index');
  
  t.notOk(drawerView.narrow, 'narrow flag set');
  t.equal(drawerView.selected, 'main', 'main selected');
  
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
    
    t.equal(rawStyle(drawerView.drawer, prefix.css + 'transform'), DRAWER_HIDDEN_LEFT_MATRIX, 'drawer is hidden');
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
    t.equal(rawStyle(drawerView.toggle, 'display'), 'none', 'hidden toggle button');
    
    document.body.style.width = "400px";
    trigger(window, 'resize');
    
    _.defer(function () {
      
      // Drawer hidden
      t.equal(rawStyle(drawerView.drawer, prefix.css + 'transform'), DRAWER_HIDDEN_LEFT_MATRIX, 'drawer is hidden');
      t.equal(rawStyle(drawerView.main, 'width'), outerWidth(drawerView.el) + 'px', 'main container full width');
      t.equal(rawStyle(drawerView.toggle, 'display'), 'inline-block', 'hidden toggle button');
      
      document.body.style.width = "1000px";
      trigger(window, 'resize');
      
      _.defer(function () {
        
        // Drawer visible
        t.equal(rawStyle(drawerView.drawer, prefix.css + 'transform'), DRAWER_VISIBLE_MATRIX, 'drawer is visible');
        t.notOk(drawerView.narrow, 'resets narrow flat');
        // TODO: phantomjs does not support calc(), but this test passes in browser
        // t.ok(outerWidth(drawerView.main) < outerWidth(drawerView.el), 'main container full width');
        
        drawerView.remove();
        t.end();
      });
    });
  }, 10);
});

test('renders element as narrow', function (t) {
  
  var drawerView = new DrawerView({
    forceNarrow: true
  });
  
  t.ok(hasClass(drawerView.el, 'narrow'), 'narrow class added to container');
  t.ok(drawerView.narrow, 'narrow flag set');
  t.end();
});

test('renders the drawer on the right side', function (t) {
  
  var drawerView = new DrawerView({
    rightDrawer: true
  });
  
  document.body.appendChild(drawerView.el);
  
  _.defer(function () {
    
    t.equal(rawStyle(drawerView.drawer, 'right'), '0px', 'drawer position location right');
    t.equal(rawStyle(drawerView.main, 'float'), 'left', 'main float');
    
    drawerView.remove();
    t.end();
  });
});

test('narrow mode with right drawer', function (t) {
  
  var drawerView = new DrawerView({
    rightDrawer: true,
    forceNarrow: true
  });
  
  document.body.appendChild(drawerView.el);
  
  _.defer(function () {
    
    t.equal(rawStyle(drawerView.drawer, 'right'), '0px', 'drawer position location right');
    t.equal(rawStyle(drawerView.main, 'float'), 'left', 'main float');
    
    // Drawer hidden
    t.equal(rawStyle(drawerView.drawer, prefix.css + 'transform'), DRAWER_HIDDEN_RIGHT_MATRIX, 'drawer is hidden');
    t.equal(rawStyle(drawerView.main, 'width'), outerWidth(drawerView.el) + 'px', 'main container full width');
    
    drawerView.remove();
    t.end();
  });
});

test('open close the drawer', function (t) {
  
  var drawerView = new DrawerView({
    forceNarrow: true
  });
  
  document.body.appendChild(drawerView.el);
  
  _.defer(function () {
    
    // Drawer hidden
    t.equal(rawStyle(drawerView.drawer, prefix.css + 'transform'), DRAWER_HIDDEN_LEFT_MATRIX, 'drawer is hidden');
    t.equal(rawStyle(drawerView.main, 'width'), outerWidth(drawerView.el) + 'px', 'main container full width');
    
    drawerView.openDrawer();
    
    // Drawer visible
    t.equal(drawerView.selected, 'drawer', 'drawer selected');
    t.equal(rawStyle(drawerView.drawer, prefix.css + 'transform'), DRAWER_VISIBLE_MATRIX, 'drawer is visible');
    t.equal(outerWidth(drawerView.main), outerWidth(drawerView.el), 'main container width');
    
    drawerView.closeDrawer();
    
    // Drawer hidden
    t.equal(drawerView.selected, 'main', 'main selected');
    t.equal(rawStyle(drawerView.drawer, prefix.css + 'transform'), DRAWER_HIDDEN_LEFT_MATRIX, 'drawer is visible');
    t.equal(rawStyle(drawerView.main, 'width'), outerWidth(drawerView.el) + 'px', 'main container full width');
    
    drawerView.remove();
    t.end();
  });
});

test('toggles drawer', function (t) {
  
  var drawerView = new DrawerView({
    forceNarrow: true
  });
  
  document.body.appendChild(drawerView.el);
  
  _.defer(function () {
    
    drawerView.toggleDrawer();
    
    // Drawer visible
    t.equal(drawerView.selected, 'drawer', 'drawer selected');
    t.equal(rawStyle(drawerView.drawer, prefix.css + 'transform'), DRAWER_VISIBLE_MATRIX, 'drawer is visible');
    t.equal(outerWidth(drawerView.main), outerWidth(drawerView.el), 'main container width');
    
    drawerView.toggleDrawer();
    
    // Drawer hidden
    t.equal(drawerView.selected, 'main', 'main selected');
    t.equal(rawStyle(drawerView.drawer, prefix.css + 'transform'), DRAWER_HIDDEN_LEFT_MATRIX, 'drawer is visible');
    t.equal(rawStyle(drawerView.main, 'width'), outerWidth(drawerView.el) + 'px', 'main container full width');
    
    drawerView.remove();
    t.end();
  });
});

test('toggle button toggles the drawer', function (t) {
  
  var drawerView = new DrawerView({
    forceNarrow: true
  });
  
  document.body.appendChild(drawerView.el);
  
  _.defer(function () {
    
    trigger(drawerView.toggle, 'click');
    
    t.equal(rawStyle(drawerView.drawer, prefix.css + 'transform'), DRAWER_VISIBLE_MATRIX, 'drawer is visible');    
    
    drawerView.remove();
    t.end();
  });
});

test('toggle button is hidden when not in narrow mode', function (t) {
  
  var drawerView = new DrawerView();
  
  document.body.appendChild(drawerView.el);
  
  t.equal(drawerView.defaultToggleDisplay, '', 'default toggle button style');
  t.equal(rawStyle(drawerView.toggle, 'display'), 'none', 'button hidden');
  
  drawerView.remove();
  t.end();
});

test('drawer animation speed', function (t) {
  
  var drawerView = new DrawerView({
    drawerSpeed: 120
  });
  
  document.body.appendChild(drawerView.el);
  
  // TODO: this test doesn't really test anything, but
  // there were issues getting the transition style
  t.equal(drawerView.drawerSpeed, 120, 'drawer speed');  
  
  drawerView.remove();
  t.end();
  
});

test('triggers narrow mode', function (t) {
  
  var drawerView = new DrawerView();
  
  document.body.appendChild(drawerView.el);
  
  _.defer(function () {
    
    drawerView.forceNarrow = true;
    
    t.ok(hasClass(drawerView.el, 'narrow'), 'narrow class added to container');
    t.ok(drawerView.narrow, 'in narrow mode');
    t.equal(rawStyle(drawerView.main, 'width'), '1000px', 'full width main');
    
    drawerView.remove();
    t.end();
  });
  
});

test('triggers right drawer mode', function (t) {
  
  var drawerView = new DrawerView();
  
  document.body.appendChild(drawerView.el);
  
  _.defer(function () {
    
    drawerView.rightDrawer = true;
    
    t.ok(hasClass(drawerView.el, 'right'), 'triggered right column mode');
    t.equal(rawStyle(drawerView.drawer, 'right'), '0px', 'drawer position location right');
    t.equal(rawStyle(drawerView.main, 'float'), 'left', 'main float');
    
    drawerView.remove();
    t.end();
  });
});

test('closes drawer when clicking outside of drawer', function (t) {
  
  var drawerView = new DrawerView({
    forceNarrow: true
  });
  
  document.body.appendChild(drawerView.el);
  
  _.defer(function () {
    
    drawerView.openDrawer();
    
    t.equal(drawerView.selected, 'drawer', 'drawer open');
    trigger(drawerView.drawer, 'click');
    t.equal(drawerView.selected, 'drawer', 'drawer stil open');
    
    trigger(drawerView.main, 'click');
    t.equal(drawerView.selected, 'main', 'drawer closed');
    
    drawerView.remove();
    t.end();
  });
});

test('custom drawer view', function (t) {
  
  var Drawer = View.extend({
    template: '<div>Custom Drawer</div>'
  });
  var drawer = new Drawer();
  var drawerView = new DrawerView({
    subviews: {
      drawer: drawer
    }
  });
  
  document.body.appendChild(drawerView.el);
  
  _.defer(function () {
    
    t.deepEqual(drawer, drawerView.subviews.drawer, 'injected custom drawer view');
    t.equal(drawerView.queryByHook('adv-drawer').innerHTML, '<div>Custom Drawer</div>', 'append custom template');
    
    drawerView.remove();
    t.end();
  });
});

test.skip('closes drawer when escape key is pressed', function (t) {
  
  // TODO: not sure how to test keyboard events
  
  // var drawerView = new DrawerView({
  //   forceNarrow: true
  // });
  
  // document.body.appendChild(drawerView.el);
  
  // _.defer(function () {
    
  //   drawerView.openDrawer();
    
  //   t.equal(drawerView.selected, 'drawer', 'drawer open');
    
  //   // triggerEvent('keydown', {key: 'escape'});
  //   trigger(document.body, 'keydown');
    
  //   t.equal(drawerView.selected, 'main', 'drawer closed');
    
  //   drawerView.remove();
  //   t.end();
  // });
});










// test('replaces default elements with elements defined with data-hook', function (t) {
  
// // TODO: this should also work with a template
  
//   // <div data-hook="drawer"></div>
//   // <div data-hook="main"></div>
//   // <button data-hook="toggle"></button>
  
//   t.end();
// });