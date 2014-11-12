var _ = require('underscore');
var View = require('ampersand-view');
var defaultTemplate = require('./lib/default-template');
var style = require('./lib/outfit');

module.exports = View.extend({
  props: {
    template: ['string', true, defaultTemplate],
    drawerWidth: ['number', false, 256],
    main: 'object',
    drawer: 'object',
    toggle: 'object'
  },
  
  initialize: function () {
    
    this.render();
    
    return this;
  },
  
  render: function () {
    
    this.renderWithTemplate();
    
    // Query elements
    this.main = this.queryByHook('main');
    this.drawer = this.queryByHook('drawer');
    this.toggle = this.queryByHook('toggle');
    
    this._defaultStyles();
    
    return this;
  },
  
  _defaultStyles: function () {
    
    // Set element styles
    style(this.el, {
      height: '100%',
      overflow: 'hidden', // TODO: write test
      width: '100%'
    });
    
    style(this.drawer, {
      height: '100%',
      float: 'left',
      overflow: 'auto',
      width: this.drawerWidth + 'px'
    });
    
    style(this.main, {
      height: '100%',
      float: 'left',
      overflow: 'auto',
      width: 'calc(100% - ' + this.drawerWidth + 'px)'
    });
  }
});