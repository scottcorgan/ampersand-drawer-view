var _ = require('underscore');
var View = require('ampersand-view');
var defaultTemplate = require('./lib/default-template');
var style = require('./lib/outfit');
var outerWidth = require('outerwidth');
var trigger = require('./lib/trigger');
var prefixedCalc = require('./lib/prefixed-calc');

module.exports = View.extend({
  props: {
    template: ['string', true, defaultTemplate()],
    drawerWidth: ['number', false, 256],
    responsiveWidth: ['number', false, 640],
    forceNarrow: ['boolean', false, false],
    rightDrawer: ['boolean', false, false],
    withHeader: ['boolean', false, false], // TODO: test this next!
    defaultNarrowClass: ['string', false , 'narrow'],
    main: 'object',
    drawer: 'object',
    toggle: 'object'
  },
  
  initialize: function () {
    
    // Resize listeners
    var resizeHandler = _.bind(this._handleWindowResize, this);
    window.addEventListener('resize', resizeHandler);
    this.once('remove', function () {
      
      // TODO: test this
      window.removeEventListener('resize', resizeHandler);
    });
    this.listenTo(this, 'resize', resizeHandler);
    
    this.render();
    
    return this;
  },
  
  render: function () {
    
    this.renderWithTemplate();
    
    // Query elements
    this.drawer = this.queryByHook('drawer');
    this.main = this.queryByHook('main');
    this.toggle = this.queryByHook('toggle');
    
    this._setDefaultStyles();
    
    if (this.forceNarrow) {
      this.el.classList.add(this.defaultNarrowClass);
    }
    
    _.defer(_.bind(function () {
      this.trigger('resize');
    }, this));
    
    return this;
  },
  
  _setDefaultStyles: function () {
    
    style(this.drawer, {
      width: this.drawerWidth + 'px'
    });
    
    style(this.main, {
      width: prefixedCalc('100% - ' + this.drawerWidth + 'px')
    });
  },
  
  _handleWindowResize: function (e) {
    
    // No need to restyle elements if view is always narrow
    if (this.forceNarrow) {
      return;
    }
    
    if (this.el && outerWidth(this.el) <= this.responsiveWidth) {
      
      // Hide the drawer when it's less than the response width
      this.el.classList.add(this.defaultNarrowClass);
      
      style(this.main, {
        width: '100%'
      });
    }
    else {
      
      // Show the drawer when it's more than the response width
      this.el.classList.remove(this.defaultNarrowClass);
      
      style(this.main, {
        width: prefixedCalc('100% - ' + this.drawerWidth + 'px')
      });
    }
  },
});