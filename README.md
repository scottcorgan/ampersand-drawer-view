# ampersand-drawer-view

Ampersand view class for hamburger drawer-like layouts. Inspired by [Polymer's core-drawer-panel element](https://www.polymer-project.org/docs/elements/core-elements.html#core-drawer-panel)

[![browser support](https://ci.testling.com/scottcorgan/ampersand-drawer-view.png)
](https://ci.testling.com/scottcorgan/ampersand-drawer-view)

## Install

```
npm install ampersand-drawer-view --save
```

## Usage

```js
// Soon. Look at tests for examples, for now.

var View = require('ampersand-view');
var DrawerView = require('ampersand-drawer-view');
var drawerView;

var DrawerPanel = View.extend({
  template: '<div>Drawer Panel</div>'  
});

var MainPanel = View.extend({
  template: '<div>Main Panel<br><button>Open Drawer</button></div>';
  events: {
    'click button': 'openDrawer'
  },
  
  openDrawer: function (e) {
    e.preventDefault();
    
    drawerView.openDrawer();
  }
});

 drawerView = new DrawerView({
  forceNarrow: true,
  subviews: {
    drawer: {
      view: new DrawerPanel(),
      width: 300,
      animationSpeed: 100
    },
    main: {
      view: new MainPanel(),
    }
  }
});

document.body.appendChild(drawerView.el);
```

## API

(Coming soon. Look at tests for now)

## Run Tests

```
npm install
npm test
```
