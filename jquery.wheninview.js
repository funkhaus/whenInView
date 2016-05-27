(function($) {

    $.fn.whenInView = function(options, outCb) {

        var inCallback,
            outCallback,
            $elems = this;

        // if first param is function, treat as inCallback
        if (typeof options === 'function') {
            inCallback = options;
            options = {};
        }

        // if second param is function, treat as outCallback
        if (typeof outCb === 'function')
            outCallback = outCb;

        // Defaults
        var settings = $.extend({
            className: 'element-in-view',
            container: window,
            elementIn: null,
            elementOut: null,
            topOffset: 0,
            bottomOffset: 0,
            staggerInterval: 0,
            removeWhenOut: false
        }, options);

        // set default callbacks
        settings.elementIn = inCallback || settings.elementIn || function($elems){
            // Stagger the class additions (default stagger interval is 0, so no visible effect)
            $elems.each(function(i){
                var $elem = jQuery(this);
                setTimeout(function(){
                    $elem.addClass(settings.className);
                }, i * settings.staggerInterval);
            });
        };
        settings.elementOut = outCallback || settings.elementOut || function($elems){
            if (settings.removeWhenOut) {
                $elems.removeClass( settings.className );
            }
        };

        // Save window dimensions
        var winHeight   = window.innerHeight || document.documentElement.clientHeight;
        var sTop = jQuery(settings.container).scrollTop();

        // set top offset and height
        var calculateOffsets = function(){

            $elems.each(function(){

                // measure rectangle
                rect = this.getBoundingClientRect();

                // set data attributes
                $(this).data('top', (rect.top + sTop));
                $(this).data('height', rect.height);

            });

        };

        // Update window dimensions when necessary
        $(window).resize(function() {
            winHeight = window.innerHeight || document.documentElement.clientHeight;
            calculateOffsets();
            window.requestAnimationFrame(checkVisibility);
        });

        // function to check what's in view
        var checkVisibility = function(){

            var topTrigger = sTop + settings.topOffset;
            var bottomTrigger = sTop + winHeight - settings.bottomOffset;

            // find all visible elements
            var $visible = $elems.filter(function(){
                var elTop = jQuery(this).data('top');
                var elHeight = jQuery(this).data('height');
                return (elTop + elHeight) > topTrigger && elTop < bottomTrigger && !this.inView;
            });

            if ( $visible.length ){

                // set inView props
                $visible.each(function(){
                    this.inView = true;
                });

                // fire inView callback
                settings.elementIn($visible);
            }

            // find all outgoing elements
            var $outGoing = $elems.filter(function(){
                var elTop = jQuery(this).data('top');
                var elHeight = jQuery(this).data('height');
                return this.inView == true && ((elTop + elHeight) < topTrigger || elTop > bottomTrigger);
            });

            if ( $outGoing.length ){

                // set inView props
                $outGoing.each(function(){
                    this.inView = false;
                });

                // fire outgoing callback
                settings.elementOut($outGoing);
            }

        }

        // set master scroll listener
        $(settings.container).scroll(function(){
            sTop = jQuery(settings.container).scrollTop();
            window.requestAnimationFrame(checkVisibility);
        });

        // kick main functions
        calculateOffsets();
        checkVisibility();

        // return $elems
        return this;
    }

}(jQuery));