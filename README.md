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

TODO: defaults, settings, custom callbacks
