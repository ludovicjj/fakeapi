# Send form data by Ajax

Submit form with [fetch](https://developer.mozilla.org/fr/docs/Web/API/Fetch_API/Using_Fetch).

## Headers
    
Detect an AJAX Request in PHP, add into headers ```X-Requested-With```: ```XMLHttpRequest``` to init object :

JS :
   
    let response = await fetch(form.getAttribute('action'), {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: formData
    });
    
    
PHP:
    
    function isAjax()
    {
        return !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
    }
    
## Autoloader

this project is just demo, consider to update ```_inc.php``` with a real autoloader.