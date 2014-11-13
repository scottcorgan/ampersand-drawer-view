var _ = require('underscore');
var View = require('ampersand-view');
var outerWidth = require('outerwidth');
var classList = require('class-list');
var defaultTemplate = require('./lib/default-template');
var style = require('./lib/outfit');
var prefixedCalc = require('./lib/prefixed-calc');
var prefix = require('./lib/prefix');
var rawStyle = require('./lib/raw-style');

module.exports = View.extend({
  
  autoRender: true,
  
  props: {
    template: ['string', true, defaultTemplate()],
    drawerWidth: ['number', false, 256],
    responsiveWidth: ['number', false, 640],
    forceNarrow: ['boolean', false, false],
    rightDrawer: ['boolean', false, false],
    withHeader: ['boolean', false, false], // TODO: test this next!
    defaultNarrowClass: ['string', false , 'narrow'],
    drawerSpeed: ['number', false, 0],
    
    // Flags
    narrow: ['boolean', false, false],
    selected: ['string', false, 'main'],
    
    // Elements
    main: 'any',
    drawer: 'any',
    
    subviews: 'object'
  },
  
  events: {
    'click [data-hook=adv-drawer]': '_drawerClicked'
  },
  
  initialize: function () {
    
    this._setDefaultSubviews();
    
    var resizeHandler = _.bind(this._handleWindowResize, this);
    var closeDrawer = _.bind(this.closeDrawer, this);
    var closeDrawerWithKey = _.bind(this._closeDrawerWithKey, this);
    
    // Resize listeners
    window.addEventListener('resize', resizeHandler);
    this.listenTo(this, 'resize', resizeHandler);
    this.listenTo(this, 'change:forceNarrow', this._triggerNarrowMode, this);
    this.listenTo(this, 'change:rightDrawer', this._triggerRightDrawerMode, this);
    document.body.addEventListener('click', closeDrawer);
    document.body.addEventListener('keydown', closeDrawerWithKey)
    
    // Handle teardown
    this.once('remove', function () {
      
      // TODO: test this
      window.removeEventListener('resize', resizeHandler);
      document.body.removeEventListener('click', closeDrawer);
    });
    
    return this;
  },
  
  render: function () {
    
    // TODO: test this
    if (this.rendered) {
      return;
    }
    
    this.renderWithTemplate();
    
    // Query elements
    this.drawer = this.queryByHook('adv-drawer');
    this.main = this.queryByHook('adv-main');
    
    // Render Subviews
    this.renderSubview(this.subviews.drawer.view, this.drawer);
    this.renderSubview(this.subviews.main.view, this.main);
    
    this._setDefaultStyles();
    
    if (this.forceNarrow) {
      this._triggerNarrowMode();
    }
    
    if (this.rightDrawer) {
      this._triggerRightDrawerMode();
    }
    
    _.defer(_.bind(function () {
      this.trigger('resize');
    }, this));
    
    return this;
  },
  
  _setDefaultSubviews: function () {
    
    var DefaultView = View.extend({
      template: '<div></div>'
    });
    
    // Ensure subviews
    this.subviews = _.extend({}, this.subviews);
    
    // Defaults for drawer
    this.subviews.drawer = _.extend({
      view: new DefaultView(),
      width: 256
    }, this.subviews.drawer);
    
    // Defaults for main
    this.subviews.main = _.extend({
      view: new DefaultView(),
    }, this.subviews.main);
  },
  
  _setDefaultStyles: function () {
    
    var drawerStyles = {
      width: this.subviews.drawer.width + 'px'
    };
    drawerStyles[prefix.js + 'Transition'] = prefix.css + 'transform ' + this.drawerSpeed + 'ms ease-in-out';
    style(this.drawer, drawerStyles);
    
    var mainStyles = {
      width: prefixedCalc('100% - ' + this.subviews.drawer.width + 'px')
    };
    mainStyles[prefix.js + 'Transition'] = 'width ' + this.drawerSpeed + 'ms ease-in-out';
    style(this.main, mainStyles);
  },
  
  _handleWindowResize: function (e) {
    
    // No need to restyle elements if view is always narrow
    if (this.forceNarrow) {
      return this._triggerNarrowMode();
    }
    
    if (this.el && outerWidth(this.el) <= this.responsiveWidth) {
      return this._triggerNarrowMode();
    }
    
    this._triggerWideMode();
  },
  
  // Hide the drawer when it's less than the response width
  _triggerNarrowMode: function () {
    
    classList(this.el).add(this.defaultNarrowClass);
    
    style(this.main, {
      width: '100%'
    });
    
    this.narrow = true;
  },
  
  // Show the drawer when it's more than the response width
  _triggerWideMode: function () {
    
    classList(this.el).remove(this.defaultNarrowClass);
    
    style(this.main, {
      width: prefixedCalc('100% - ' + this.subviews.drawer.width + 'px')
    });
    
    this.narrow = false;
  },
  
  _triggerRightDrawerMode: function () {
    classList(this.el).add('right');
  },
  
  // Disables clicks from leaking outside the container
  // This is useful for closing the drawer when clicking 
  // outside of it.
  _drawerClicked: function (e) {
    
    e.stopPropagation();
  },
  
  _closeDrawerWithKey: function (e) {
    
    if (e.keyCode === 27 && this.selected === 'drawer') {
      this.closeDrawer();
    }
  },
    
  openDrawer: function () {
    
    // No need to do anything if drawer is visible in the layout
    if (!this.narrow || this.selected === 'drawer') {
      return;
    }
    
    classList(this.el).add('drawer');
    
    // Ensures an event doesn't trigger open and close at the same time
    _.defer(function (ctx) {
      ctx.selected = 'drawer';
    }, this);
  },
  
  closeDrawer: function () {
    
    // Do nothing if we don't need to
    if (!this.narrow || this.selected === 'main') {
      return;
    }
    
    classList(this.el).remove('drawer');
    
    // Ensures an event doesn't trigger open and close at the same time
    _.defer(function (ctx) {
      ctx.selected = 'main';
    }, this);
  },
  
  toggleDrawer: function (e) {
    
    e && e.stopPropagation();
    e && e.preventDefault();
    
    (this.selected === 'main') ? this.openDrawer() : this.closeDrawer();
  }
});