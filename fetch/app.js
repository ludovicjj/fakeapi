let form = document.querySelector('#contact');
let button = form.querySelector('button[type=submit]');
let buttonContent = button.textContent;

form.addEventListener('submit', async function (e) {
    // Clean style error bootstrap
    let errorElements = form.querySelectorAll('.is-invalid');
    for (let i = 0; i < errorElements.length; i++) {
        errorElements[i].classList.remove('is-invalid');
        let errorMessage = errorElements[i].parentNode.querySelector('.invalid-feedback');
        if (errorMessage) {
            errorElements[i].parentNode.removeChild(errorMessage);
        }
    }

    // Clean success alert
    let successAlert = form.parentNode.querySelector('.alert.alert-success');
    if (successAlert) {
        form.parentNode.removeChild(successAlert);
    }

    // button off
    button.disabled = true;
    button.textContent = 'Chargement...';
    e.preventDefault();

    let formData = new FormData(form);

    try {
        let response = await fetch(form.getAttribute('action'), {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData
        });

        let data = await response.json();

        if (response.ok === false) {
            let errors = data;
            let errorsKey = Object.keys(errors);
            for (let i = 0; i < errorsKey.length; i++) {
                let key = errorsKey[i];
                let error = errors[key];
                let input = document.querySelector('[name='+ key +']');

                // add style error bootstrap
                let errorMessage = document.createElement('div');
                errorMessage.className = "invalid-feedback";
                errorMessage.innerHTML = error;
                input.classList.add('is-invalid');
                input.parentNode.appendChild(errorMessage);
            }
        } else {
            let successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success';
            successMessage.innerHTML = data.success;
            form.parentNode.insertBefore(successMessage, form);

            // Clean input value
            let inputs = form.querySelectorAll('input, textarea');
            for ( let j = 0; j < inputs.length; j++) {
                inputs[j].value = '';
            }
        }
    } catch (e) {
        console.error(e);
    }
    // button on
    button.disabled = false;
    button.textContent = buttonContent;
});