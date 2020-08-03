let modal = null;
let links = document.querySelectorAll('.js-modal');
const focusableSelector = 'button, a, input, textarea';
let focusable = [];
let previouslyFocusedElement = null;

const openModal = async function (e) {
    e.preventDefault();
    const target = e.currentTarget.getAttribute('href');
    if (target.startsWith('#')) {
        modal = document.querySelector(target);
    } else {
        modal = await loadModal(target);
    }

    focusable = [].slice.call(modal.querySelectorAll(focusableSelector));

    // css
    modal.style.display = '';
    modal.setAttribute('aria-hidden', 'false');
    modal.setAttribute('aria-modal', 'true');

    // focus: save previous focused element & define focus on first element into modal
    previouslyFocusedElement = document.querySelector(':focus');
    focusable[0].focus();

    // event
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
};

const closeModal = function (e) {
    if (modal === null) {
        return;
    }
    e.preventDefault();

    // focus
    if (previouslyFocusedElement !== null) {
        previouslyFocusedElement.focus();
    }

    // css
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');

    // event
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
    const hideModal = function (e) {
        modal.style.display = 'none';
        modal.removeEventListener('animationend', hideModal);
        modal = null;
    };
    modal.addEventListener('animationend', hideModal);
};
const focusInModal = function (e) {
    e.preventDefault();

    const currentFocus = (focus) => focus === modal.querySelector(':focus');
    let index = focusable.findIndex(currentFocus);

    if (e.shiftKey === true) {
        index--;
    } else {
        index++;
    }

    if (index >= focusable.length) {
        index = 0;
    }
    if (index < 0) {
        index = focusable.length -1;
    }

    focusable[index].focus();
};
const loadModal = async function (url) {
    const target = "#" + url.split('#')[1];
    const existingModal = document.querySelector(target);
    if (existingModal !== null) {
        return existingModal;
    }
    const html = await fetch(url).then(response => response.text());
    const fragment = document.createRange().createContextualFragment(html);
    const element = fragment.querySelector(target);

    if (element === null) {
        throw `not found ${target} into ${url}`;
    }

    document.body.append(element);
    return element;
};

const stopPropagation = function(e) {
    e.stopPropagation();
};

links.forEach(link => {
    link.addEventListener('click', openModal)
});

// keyboard event
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
        closeModal(e);
    }

    if (e.key === 'Tab' && modal !== null) {
        focusInModal(e);
    }
});