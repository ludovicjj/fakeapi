/**
 * @param {Element} element
 */
const activate = function (element) {
    const id = element.getAttribute('id');
    const link = document.querySelector(`a[href="#${id}"]`);
    if (link === null) {
        return null;
    }
    link.classList.add('active');
};

/**
 * @param {IntersectionObserverEntry[]} entries
 * @param {IntersectionObserver} observer
 */
const handleObserver = function (entries, observer) {
    entries.forEach(function(entry) {
        if (entry.intersectionRatio > 0) {
            activate(entry.target);
        }
    });
};

const spies = document.querySelectorAll('[data-spy]');

if (spies.length > 0) {
    const observer = new IntersectionObserver(handleObserver, {});
    spies.forEach(function (spy) {
        observer.observe(spy);
    })
}