const extend = require('lodash/defaultsDeep')
const utils = require('./utils')

const enterEvt = new Event('enter.wheninview')

module.exports = options => {

    // Handle shortcut options
    if( typeof options === 'string' ){
        options = {
            selector: options
        }
    }

    // Save options
    options = extend(options, {
        selector:           '.wheninview',
        className:          'element-in-view',
        container:          window,
        elementIn:          el => { utils.addClass(el, options.className) },
        elementOut:         null,
        topOffset:          0,
        bottomOffset:       0,
        staggerInterval:    0,
        removeWhenOut:      false,
        RAF:                true,       // if true, the master scroll event will be wrapped in a requestAnimationFrame
        fireAtStart:        true
    })

    var els = document.querySelectorAll(options.selector)

    els.forEach( el => {

        

    })
}
