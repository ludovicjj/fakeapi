const ratio = .6;
let observer = null;
const spies = document.querySelectorAll('[data-spy]');

/**
 * @param {Element} element
 */
const activate = function (element) {
    const id = element.getAttribute('id');
    const link = document.querySelector(`a[href="#${id}"]`);
    if (link === null) {
        return null;
    }

    // remove class .active
    link.parentElement
        .querySelectorAll('.active')
        .forEach(node => {
            node.classList.remove('active');
        });
    link.classList.add('active');
};

/**
 * @param {IntersectionObserverEntry[]} entries
 */
const handleObserver = function (entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            activate(entry.target);
        }
    });
};


/**
 * @param {NodeListOf.<Element>} elements
 */
const observe = function (elements) {
    if (observer !== null) {
        elements.forEach(element => observer.unobserve(element));
    }
    const y = Math.round(window.innerHeight * ratio);
    const x = window.innerHeight - y - 1;

    observer = new IntersectionObserver(handleObserver, {
        rootMargin: `-${x}px 0px -${y}px 0px`
    });

    elements.forEach(element => observer.observe(element));
};

/**
 *
 * @param {Function} callback
 * @param {number} delay
 * @returns {Function}
 */
const debounce = function(callback, delay){
    let timer = null;
    return function() {
        let context = this;
        let args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function(){
            callback.apply(context, args);
        }, delay);
    }
};

if (spies.length > 0) {
    observe(spies);
    let windowH = window.innerHeight;
    window.addEventListener('resize', debounce(function() {
        if (window.innerHeight !== windowH) {
            console.log('test');
            observe(spies);
            windowH = window.innerHeight;
        }
    }, 500))
}