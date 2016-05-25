(function($) {

/*

    ClassInView
    jQuery('#element').classInView('class-name')
        - matching items will have class 'class-name' added when in viewport and removed when out of viewport
    jQuery('#element').classInView()
        - matching items will have default class 'element-in-view' added when in viewport and removed when out of viewport
    jQuery('#element').classInView( { args... })
        - fuller control over functionality

    TODO: Account for window being smaller than minHeightVisible or minWidthVisible amounts
    TODO: Account for other elements covering element
    TODO: Account for opacity

*/

    $.fn.classInView = function(options) {

        var className = null;

        if (typeof options === 'string') {
            className = options;
            options = {};
        }

        // Defaults
        var settings = $.extend({
            inView: className || 'element-in-view',
            outView: null,
            removeWhenOut: true,
            minHeightVisible: -1,
            minWidthVisible: -1
        }, options);

        // Save window dimensions
        var winHeight   = window.innerHeight || document.documentElement.clientHeight,
            winWidth    = window.innerWidth || document.documentElement.clientWidth;

        // Update window dimensions when necessary
        $(window).resize(function() {
            winHeight   = window.innerHeight || document.documentElement.clientHeight;
            winWidth    = window.innerWidth || document.documentElement.clientWidth;
        });

        // Function to call on resize and scroll
        var checkVisibility = function($el) {
            var elDom = $el[0];
            var rect = elDom.getBoundingClientRect();
            var inViewVertical = false;
            var inViewHorizontal = false;

            // Shortcut if minHeightVisible is -1
            if (settings.minHeightVisible == -1) {
                inViewVertical = (
                    (rect.top <= 0 && rect.bottom >= winHeight) ||
                    (rect.top >= 0 && rect.top < winHeight) ||
                    (rect.bottom > 0 && rect.bottom <= winHeight)
                );
            }

            /* More complicated cases for minHeightVisible != -1 cases */
            else {
                var elHeight = $el.innerHeight();

                // Vertical view test
                // Top is above window and bottom is below, so element is automatically in view
                if (rect.top <= 0 && rect.bottom >= winHeight) {
                    inViewVertical = true;
                }
                // Top and bottom are visible
                else if (rect.top >= 0 && rect.top <= winHeight && rect.bottom >= 0 && rect.bottom <= winHeight) {
                    inViewVertical = true;
                }
                // Top is above window but bottom is visible
                else if (rect.top <= 0 && rect.bottom > 0 && rect.bottom <= winHeight) {
                    var percentVisible = rect.bottom / elHeight;
                    inViewVertical = percentVisible >= settings.minHeightVisible;
                }
                // Top is visible but bottom is below window
                else if (rect.top >= 0 && rect.top < winHeight && rect.bottom >= winHeight) {
                    var pixelsVisible = winHeight - rect.top;
                    var percentVisible = pixelsVisible / elHeight;
                    inViewVertical = percentVisible >= settings.minHeightVisible;
                }
            }

            // Shortcut if minWidthVisible is -1
            if (settings.minWidthVisible == -1) {
                inViewHorizontal = (
                    (rect.left <= 0 && rect.right >= winWidth) ||
                    (rect.left >= 0 && rect.left < winWidth) ||
                    (rect.right > 0 && rect.right <= winWidth)
                );
            }
          /* More complicated cases for minWidthVisible != -1 cases */
            else {
                var elWidth = $el.innerWidth();

                // Horizontal view test
                // Left and right expand beyond window, so element is automatically in view
                if (rect.left <= 0 && rect.right >= winWidth) {
                    inViewHorizontal = true;
                }
                // Left and right are visible
                else if (rect.left >= 0 && rect.left <= winWidth && rect.right >= 0 && rect.right <= winWidth) {
                    inViewHorizontal = true;
                }
                // Left is beyond window but right is visible
                else if (rect.left <= 0 && rect.right > 0 && rect.right <= winWidth) {
                    var percentVisible = rect.right / elWidth;
                    inViewHorizontal = percentVisible >= settings.minWidthVisible;
                }
                // Left is visible byt right is beyond window
                else if (rect.left >= 0 && rect.left < winWidth && rect.right >= winWidth) {
                    var pixelsVisible = winWidth - rect.left;
                    var percentVisible = pixelsVisible / elWidth;
                    inViewVertical = percentVisible >= settings.minWidthVisible;
                }
            }

            // Element is in view
            if ( inViewVertical && inViewHorizontal ) {
                if ( !$el.hasClass(settings.inView) ) {
                    $el.addClass(settings.inView);
                }
                if ( settings.outView != null && el.hasClass(settings.outView) ) {
                    $el.removeClass(settings.outView);
                }
            }
            else {
                if ( settings.removeWhenOut && $el.hasClass(settings.inView) ) {
                    $el.removeClass(settings.inView);
                }
                if ( settings.outView != null && !$el.hasClass(settings.outView)) {
                    $el.addClass( settings.outView );
                }
            }
        }

        return this.each(function() {
            // Save a reference to the DOM object
            var $el = $(this);
            checkVisibility($el);
            // Check visibility on scroll and resize
            $(window).scroll(function() {
                checkVisibility($el);
            });
            $(window).resize(function() {
                checkVisibility($el);
            });

        });

    }

}(jQuery));