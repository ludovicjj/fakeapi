let modal = null;
let links = document.querySelectorAll('.js-modal');
const focusableSelector = 'button, a, input, textarea';
let focusable = [];
let previouslyFocusedElement = null;

const openModal = function (e) {
    e.preventDefault();

    modal = document.querySelector(e.currentTarget.getAttribute('href'));
    focusable = [].slice.call(modal.querySelectorAll(focusableSelector));
    previouslyFocusedElement = document.querySelector(':focus');
    focusable[0].focus();

    // css
    modal.style.display = '';
    modal.setAttribute('aria-hidden', 'false');
    modal.setAttribute('aria-modal', 'true');

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

    // css
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');

    // event
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);

    // reset modal
    modal = null;
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