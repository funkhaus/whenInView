# whenInView
jQuery plugin to listen for when elements enter the window.

### How

Include a reference to jQuery and `jquery.wheninview.js` in your html file. 

```html
<script src="path/to/jquery.js"></script>
<script src="path/to/jquery.wheninview.js"></script>
```

In your `document.ready` function, call `whenInView` on any elements you want to perform a special action when entering or leaving view.
 
```javascript
jQuery('.elements-to-mark-when-in-view').whenInView();
```

For default behavior, that's it! Elements that match the selector you chose will have the `element-in-view` class added when in view and removed when out of view.

### Custom Callbacks

You can also specify a custom callback to be performed on an element when it enters view:
```javascript
jQuery('.elements').whenInView( function($elem) {
  // Do something when jQuery object $elem enters the viewport
});
```
This will overwrite the default behavior (ie, the `element-in-view` class won't be added to elements in view any more).

If you include a second callback, that function will act on elements when they leave view:
```javascript
jQuery('.elements').whenInView( 
  function($elem) { /* Do something when jQuery object $elem enters the viewport */ },
  function($elem) { /* Do something when jQuery object $elem leaves the viewport */ }
);
```

### Settings
You can also define settings by passing an object:
```javascript
// Default settings
var settings = {
  className: 'element-in-view', // The name of the class added to elements in view
  container: window, // The viewport to check for elements in view
  elementIn: null, // Custom callback when an element enters view (accepts single jQuery object as parameter)
  elementOut: null, // Custom callback when an element leaves view (accepts single jQuery object as parameter)
  topOffset: 0, // Amount of space at top of container before element registers as in view
  bottomOffset: 0, // Amount of space at bottom of container before element registers as in view
  staggerInterval: 0 // Time (ms) between elementIn callback firing (see below) - ignored if elementIn is not default
}
```

## Examples

### Custom class name
```javascript
jQuery('element-selector').whenInView({
  className: 'CUSTOM-CLASS-NAME'
});
```

### Staggered class additions
```javascript
// Useful for avoiding simultaneous animations - see the images at https://kinfolklife.com/
jQuery('element-selector').whenInView({
  staggerInterval: 250
});
```

### Offsets
```javascript
// Useful if there's a fixed header/footer on your page giving you false whenInView positives
jQuery('element-selector').whenInView({
  // These account for an 80px header and 120px footer
  topOffset: 80,
  bottomOffset: 120
});
```
