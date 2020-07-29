let modal = null;
let links = document.querySelectorAll('.js-modal');
const focusableSelector = 'button, a, input, textarea';
let focusables = [];

const openModal = function (e) {
    e.preventDefault();

    modal = document.querySelector(e.currentTarget.getAttribute('href'));
    focusables = [].slice.call(modal.querySelectorAll(focusableSelector));

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
    console.log(focusables);
};

const stopPropagation = function(e) {
    e.stopPropagation();
};

links.forEach(link => {
    link.addEventListener('click', openModal)
});

// keyboard event
window.addEventListener('keyup', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
        closeModal(e);
    }

    if (e.key === 'Tab' && modal !== null) {
        focusInModal(e);
    }
});