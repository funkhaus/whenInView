/*!
* jQuery whenInView; version: 1.2.5
* https://github.com/funkhaus/whenInView
* Copyright (c) 2016 Funkhaus; MIT license
*/
(function($) {

    $.fn.whenInView = function(options, outCb) {

        var inCallback,
            outCallback,
            $elems = this;

        // if first param is 'clear', clear the given wheninview event or all wheninview events
        if( options == 'clear' ){

            $elems.off( outCb ? ( outCb + '.wheninview' ) : 'enter.wheninview exit.wheninview' );
            return this;

        }

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
            className:          'element-in-view',
            container:          window,
            elementIn:          null,
            elementOut:         null,
            topOffset:          0,
            bottomOffset:       0,
            staggerInterval:    0,
            removeWhenOut:      false,
            RAF:                true,       // if true, the master scroll event will be wrapped in a requestAnimationFrame
            fireAtStart:        true
        }, options);

        // Prep enter-view callback
        settings.elementIn = inCallback || settings.elementIn || function(){

            $(this).addClass(settings.className);

        };
        // Add enter-view callback
        $elems.on('enter.wheninview', settings.elementIn);

        // Prep leave-view callback
        settings.elementOut = outCallback || settings.elementOut || function($elems){
            if (settings.removeWhenOut) {
                            console.log($($($elems).get(0).target));

                $($($elems).get(0).target).removeClass( settings.className );
            }
        };
        // Add leave-view callback
        $elems.on('exit.wheninview', settings.elementOut);

        // Save window dimensions
        var winHeight   = window.innerHeight || document.documentElement.clientHeight;
        var sTop = $(settings.container).scrollTop();

        // set variables for a percetage offset
        var percentOffsetTop = false;
        var percentOffsetBottom = false;

        // if top offset was set as a percentage...
        if ( String(settings.topOffset).indexOf('%') > -1 ){

            // get the percentage as a float
            percentOffsetTop = parseFloat( settings.topOffset.replace('%', '') / 100 );

            // find the pixel value of the offset
            settings.topOffset = winHeight * percentOffsetTop;

        }

        // if bottom offset was set as a percentage...
        if ( String(settings.bottomOffset).indexOf('%') > -1 ){

            // get the percentage as a float
            percentOffsetBottom = parseFloat( settings.bottomOffset.replace('%', '') / 100 );

            // find the pixel value of the offset
            settings.bottomOffset = winHeight * percentOffsetBottom;

        }

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

            // set window height
            winHeight = window.innerHeight || document.documentElement.clientHeight;

            // recalculate top offset
            if ( percentOffsetTop )
                settings.topOffset = winHeight * percentOffsetTop;

            // recalculate bottom offset
            if ( percentOffsetBottom )
                settings.bottomOffset = winHeight * percentOffsetBottom;

            // recalculate offset as elements
            calculateOffsets();

            // run visibility check
            window.requestAnimationFrame(checkVisibility);
        });

        // catch manual recalculation event
        $(document).on('recalculate.wheninview', function(){

            // recalculate offset as elements
            calculateOffsets();

            // run visibility check
            window.requestAnimationFrame(checkVisibility);
        });

        // function to check what's in view
        var checkVisibility = function(){

            var topTrigger = sTop + settings.topOffset;
            var bottomTrigger = sTop + winHeight - settings.bottomOffset;

            // find all visible elements
            var $incoming = $elems.filter(function(){
                var elTop = $(this).data('top');
                var elHeight = $(this).data('height');
                return (elTop + elHeight) > topTrigger && elTop < bottomTrigger && !this.inView;
            });

            if ( $incoming.length ){

                // set inView props
                $incoming.each(function(){
                    this.inView = true;
                });

                // Stagger the class additions (default stagger interval is 0, so no visible effect)
                $incoming.each(function(i){
                    var $elem = $(this);

                    if( settings.staggerInterval > 0 ){
                        setTimeout(function(){
                            // fire inView callback
                            $elem.trigger('enter.wheninview', $incoming);
                        }, i * settings.staggerInterval);
                    } else {
                        // fire inView callback
                        $elem.trigger('enter.wheninview', $incoming);
                    }
                });

            }

            // find all outgoing elements
            var $outgoing = $elems.filter(function(){
                var elTop = $(this).data('top');
                var elHeight = $(this).data('height');
                return this.inView == true && ((elTop + elHeight) < topTrigger || elTop > bottomTrigger);
            });

            if ( $outgoing.length ){

                // set inView props
                $outgoing.each(function(){
                    this.inView = false;
                });

                // fire outgoing callback
                $outgoing.trigger('exit.wheninview', $outgoing);
            }

        }

        // name master scroll listener
        var masterScrollListener = function(){
            sTop = $(settings.container).scrollTop();

            // fire callback
            if ( settings.RAF ){
                window.requestAnimationFrame(checkVisibility);
            } else {
                checkVisibility();
            }

        }

        // set master scroll listener
        $(settings.container).scroll(masterScrollListener);

        calculateOffsets();

        // kick main functions
        if( settings.fireAtStart ){
            checkVisibility();
        }

        // return $elems
        return this;
    }

}(jQuery));
