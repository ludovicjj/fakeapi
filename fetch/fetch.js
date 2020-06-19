/*
fetch('https://jsonplaceholder.typicode.com/users')
.then( response => response.json()).then( data => console.log(data));
*/



const getPosts = async function() {
    let response = await fetch('https://jsonplaceholder.typicode.com/users');
    if (response.ok) {
        let data = await response.json();
        console.log(data);
    } else {
        console.error('Request status code : ', response.status);
    }
};

const addPost = async function(init) {
    let response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(init)
    });
    let data = await response.json();
    console.log(data);
};

addPost({
    nom: 'Jean',
    age: 29
});


