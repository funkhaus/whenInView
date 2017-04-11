const extend = require('lodash/defaultsDeep')
const utils = require('./utils')

const enter = utils.createEvent('enter.wheninview')
const exit = utils.createEvent('exit.wheninview')

let win = { width: -1, height: -1 }

module.exports = {

    data: new WeakMap(),
    watched: [],

    watch: options => {

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
            elementOut:         () => { console.log('No exit.wheninview event defined') },
            topOffset:          0,
            bottomOffset:       0,
            staggerInterval:    0,
            removeWhenOut:      false,
            RAF:                true,       // if true, the master scroll event will be wrapped in a requestAnimationFrame
            fireAtStart:        true
        })

        var els = document.querySelectorAll(options.selector)

        // Prep callbacks
        els.forEach( el => {

            if( typeof options.elementIn === 'function' ){
                el.addEventListener( 'enter.wheninview', options.elementIn(el) )
            }

            if( typeof options.elementOut === 'function' ){
                el.addEventListener( 'exit.wheninview', options.elementOut(el) )
            }

            el.dispatchEvent( exit )

            module.exports.data[el] = {
                test: 'test'
            }

            module.exports.watched.push(el)

        })

        // Calculate window dimensions
        win.height = window.innerHeight || document.documentElement.clientHeight
    }
}
