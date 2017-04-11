module.exports = {

    addClass: (el, className) => {
        if (el.classList){
            el.classList.add(className)
        } else {
            el.className += ' ' + className
        }
    },

    createEvent: (eventName, data) => {
        if (window.CustomEvent) {
            var event = new CustomEvent(eventName, data)
        } else {
            var event = document.createEvent('CustomEvent')
            event.initCustomEvent(eventName, true, true, data)
        }

        return event
    }

}
