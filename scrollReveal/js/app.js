const ratio = .1;
const options = {
    root: null,
    rootMargin: '0px',
    threshold: ratio
};

const handleIntersection = function(entries, observer) {
    entries.forEach(entry => {
        if (entry.intersectionRatio > ratio) {
            entry.target.classList.remove('reveal');
            observer.unobserve(entry.target);
        }
    });
};

document.documentElement.classList.add('reveal-loaded');

window.addEventListener("DOMContentLoaded", function() {
    const observer = new IntersectionObserver(handleIntersection, options);
    document.querySelectorAll('.reveal').forEach(reveal => {
        observer.observe(reveal);
    });
});

