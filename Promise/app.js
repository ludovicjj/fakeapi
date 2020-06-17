let get = function(url, success, error) {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if(xhr.status === 200) {
                success(xhr.responseText);
            } else {
                error(xhr);
            }
        }
    };

    xhr.open('GET', url, true);
    xhr.send();
};


let getPost = function() {
    get(
        'https://my-json-server.typicode.com/ludovicjj/fakeapi/posts',
        function(response) {
            let posts = JSON.parse(response);
            console.log(posts);
        },
        function(error) {
            console.log(error);
        }
    )
};

getPost();