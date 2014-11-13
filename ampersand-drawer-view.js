var _ = require('underscore');
var View = require('ampersand-view');
var defaultTemplate = require('./lib/default-template');
var style = require('./lib/outfit');
var outerWidth = require('outerwidth');
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
    defaultToggleDisplay: ['string', false, 'inline-block'],
    
    // Flags
    narrow: ['boolean', false, false],
    selected: ['string', false, 'main'],
    
    // Elements
    main: 'object',
    drawer: 'object',
    toggle: 'object'
  },
  
  events: {
    'click [data-hook=toggle]': 'toggleDrawer',
    'click [data-hook=drawer]': '_drawerClicked'
  },
  
  initialize: function () {
    
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
    this.drawer = this.queryByHook('drawer');
    this.main = this.queryByHook('main');
    this.toggle = this.queryByHook('toggle');
    
    // Track this value so it can be reset when it needs to be
    this.defaultToggleDisplay = rawStyle(this.toggle, 'display');
    
    this._setDefaultStyles();
    
    if (this.forceNarrow) {
      this._triggerNarrowMode();
    }
    else {
      this.toggle.style.display = 'none';
    }
    
    if (this.rightDrawer) {
      this._triggerRightDrawerMode();
    }
    
    _.defer(_.bind(function () {
      this.trigger('resize');
    }, this));
    
    return this;
  },
  
  _setDefaultStyles: function () {
    
    var drawerStyles = {
      width: this.drawerWidth + 'px'
    };
    drawerStyles[prefix.js + 'Transition'] = prefix.css + 'transform ' + this.drawerSpeed + 'ms ease-in-out';
    style(this.drawer, drawerStyles);
    
    var mainStyles = {
      width: prefixedCalc('100% - ' + this.drawerWidth + 'px')
    };
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
    
    this.toggle.style.display = this.defaultToggleDisplay;
    this.el.classList.add(this.defaultNarrowClass);
    
    style(this.main, {
      width: '100%'
    });
    
    this.narrow = true;
  },
  
  // Show the drawer when it's more than the response width
  _triggerWideMode: function () {
    
    this.toggle.style.display = 'none';
    this.el.classList.remove(this.defaultNarrowClass);
    
    style(this.main, {
      width: prefixedCalc('100% - ' + this.drawerWidth + 'px')
    });
    
    this.narrow = false;
  },
  
  _triggerRightDrawerMode: function () {
    this.el.classList.add('right');
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
    
    this.selected = 'drawer';
    this.el.classList.add('drawer');
  },
  
  closeDrawer: function () {
    
    // Do nothing if we don't need to
    if (!this.narrow || this.selected === 'main') {
      return;
    }
    
    this.selected = 'main';
    this.el.classList.remove('drawer');
  },
  
  toggleDrawer: function (e) {
    
    e && e.stopPropagation();
    e && e.preventDefault();
    
    (this.selected === 'main') ? this.openDrawer() : this.closeDrawer();
  }
});