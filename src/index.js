const extend = require('lodash/defaultsDeep')
const utils = require('./utils')
const getElement = require('./getElement')

const enter = utils.createEvent('enter.wheninview')
const exit = utils.createEvent('exit.wheninview')

module.exports = {

    overlapping: [],
    current: 0,
    watched: [],
    inView: [],
    win: { height: -1 },
    scroll: { top: 0 },

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
            element:            false,      // If this is set to 'false', use options.selector to find the element(s).
                                            // If we want to manually pass an element, set this value to the desired element.
            container:          window,
            elementIn:          el => { utils.addClass(el, options.className) },
            elementOut:         () => { console.log('No exit.wheninview event defined') },
            topOffset:          0,
            bottomOffset:       0,
            staggerInterval:    0,
            removeWhenOut:      false,
            RAF:                true,       // if true, the master scroll event will be wrapped in a requestAnimationFrame
            fireAtStart:        true,
            overlap:            'viewport'
        })

        // The elements we'll be watching
        let els = []

        if( options.element !== false ){
            // Use declared element by default...
            els.push(options.element)
        } else {
            // ...otherwise, find by selector
            els = document.querySelectorAll(options.selector)
        }

        els.forEach( el => {

            // Save element container
            let container = options.container
            // Use `window` by default, query selector otherwise
            if( container !== window ){
                container = document.querySelector(options.container)

                // Handle if no container found
                if( container === null ){
                    console.log('No element called ' + options.container + ' found!')
                }
            }

            // Find wheninview index of this element
            const elIndex = el.getAttribute('data-wiv-index')
            // Save index if we're not yet watching
            if( elIndex === null ){
                el.setAttribute('data-wiv-index', module.exports.current++)
                // Save element and container
                module.exports.watched.push({
                    element: el,
                    container: container
                })
            }

            // Save callback for element entering view
            if( typeof options.elementIn === 'function' ){
                el.addEventListener( 'enter.wheninview', evt => { options.elementIn(el); } )
            }

            // Save callback for element leaving view
            if( typeof options.elementOut === 'function' ){
                el.addEventListener( 'exit.wheninview', evt => { options.elementOut(el) } )
            }

            // Set up scroll event for this element
            container.addEventListener('scroll', evt => {

                module.exports.refresh()
                module.exports.checkVisibility()

            })

        })

        module.exports.refresh()

        return els

    },

    refresh: () => {

        // Save window data
        module.exports.win.height = window.innerHeight || document.documentElement.clientHeight

        // Save location and dimension data on watched elements
        module.exports.watched.forEach( watched => {
            const rect = watched.element.getBoundingClientRect()
            watched.element.setAttribute('data-wiv-top', rect.top)
            watched.element.setAttribute('data-wiv-height', rect.height)
        })

    },

    checkVisibility: () => {

        // Assumes refresh() was called

        let incoming = []
        let outgoing = []

        // Find all newly visible elements
        module.exports.watched.forEach( single => {

            // Save container position and dimensions
            const top = single.container.scrollTop // include top offset
            const bottom = top + module.exports.win.innerHeight // include bottom offset

            // Save element position and dimensions
            const el = single.element
            const elTop = Number( el.getAttribute('data-wiv-top') )
            const elHeight = Number( el.getAttribute('data-wiv-height') )

            // Place in appropriate list, if applicable
            if( (elTop + elHeight) > top && elTop < bottom && !module.exports.inView.includes( el.getAttribute('data-wiv-index') ) ){
                incoming.push(single)
            } else if( module.exports.inView.includes( el.getAttribute('data-wiv-index') ) && ((elTop + elHeight) < top || elTop > bottom) ){
                outgoing.push(single)
            }
        })

        if( incoming.length ){
            console.log('incoming')
            console.log(incoming)
        }
        if( outgoing.length ){
            console.log('outgoing')
            console.log(outgoing)
        }

        incoming.forEach( el => {
            module.exports.inView.push( el.element.getAttribute('data-wiv-index') )
        })
        outgoing.forEach( el => {
            const index = module.exports.inView.indexOf( el.element.getAttribute('data-wiv-index') )
            module.exports.inView.splice( index, 1 )
        })

    }

    // overlapping: (a, b = 'viewport') => {
    //
    //     if( a.getAttribute('data-wiv-index') === null ){
    //         module.exports.watch({
    //             element: a,
    //             elementIn: null
    //         })
    //     }
    //
    //     // Special case for viewport
    //     if( b != 'viewport' ){
    //         if( b.getAttribute('data-wiv-index') === null ){
    //             module.exports.watch({
    //                 element: b,
    //                 elementIn: null
    //             })
    //         }
    //     } else {
    //         console.log('viewport')
    //     }
    //
    // },
    //
    // isOverlapping: (a, b) => {
    //     //http://stackoverflow.com/questions/13390333/two-rectangles-intersection
    //     if(
    //        a.left + a.width < b.left ||
    //        b.left + b.width < a.left ||
    //        a.top + a.height < b.top ||
    //        b.top + b.height < a.top
    //     ){
    //        return false
    //     } else {
    //        return true
    //     }
    // }


    // calculateOffsets: el => {
    //
    //     const rect = el.getBoundingClientRect()
    //
    //     module.exports.data[el] = {
    //         docPosition: {
    //             top: rect.top + document.body.scrollTop,
    //             left: rect.left + document.body.scrollLeft
    //         },
    //         rect: rect,
    //         width: rect.width,
    //         height: rect.height,
    //         top: rect.top,
    //         left: rect.left
    //     }
    //
    // },
    //
    // isOverlapping: (rectA, rectB) => {
    //
    //     module.exports.refresh()
    //
    //     const a = module.exports.data[rectA]
    //     const b = module.exports.data[rectB]
    //
    //     // http://stackoverflow.com/questions/13390333/two-rectangles-intersection
    //     if(
    //         a.left + a.width < b.left ||
    //         b.left + b.width < a.left ||
    //         a.top + a.height < b.top ||
    //         b.top + b.height < a.top
    //     ){
    //         return false
    //     } else {
    //         return true
    //     }
    //
    // },
    //
    // watchOverlap: ( optionsA, optionsB, onOverlapEnter, onOverlapExit = null, containerSelector = false ) => {
    //
    //     const a = module.exports.watch(optionsA)[0]
    //     const b = module.exports.watch(optionsB)[0]
    //
    //     const container = containerSelector ? document.querySelector(containerSelector) : window
    //
    //     container.addEventListener('scroll', () => {
    //         const overlapping = module.exports.isOverlapping(a, b)
    //
    //         if( !module.exports.overlapping.includes( [a, b] ) && overlapping ){
    //             onOverlapEnter(a, b)
    //             module.exports.overlapping.push( [ a, b ] )
    //         }
    //
    //         if( module.exports.overlapping.indexOf( [a, b] ) !== -1 && !overlapping){
    //             onOverlapExit(a, b)
    //             module.exports.overlapping.splice( module.exports.overlapping.indexOf([a, b]) )
    //         }
    //     })
    //
    // },
    //
    // refresh: () => {
    //
    //     module.exports.watched.forEach( el => {
    //         module.exports.calculateOffsets(el)
    //     })
    //
    // }
}
