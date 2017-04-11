module.exports = {
    addClass: (el, className) => {
        if (el.classList){
            el.classList.add(className)
        } else {
            el.className += ' ' + className
        }
    }
}
