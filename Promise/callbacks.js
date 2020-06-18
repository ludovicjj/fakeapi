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


let getComment = function(success, errors) {
    get('https://my-json-server.typicode.com/ludovicjj/fakeapi/posts',
        function(response) {
            let posts = JSON.parse(response);
            get(
                'https://my-json-server.typicode.com/ludovicjj/fakeapi/comments?postId=' + posts[0].id,
                function (response) {
                    let comments = JSON.parse(response);
                    success(comments);
                },
                function(error) {
                    errors(error)
                })
        },
        function(error) {
            errors(error);
        }
    )
};

getComment(function(comments) {
    console.log('Le premier commentaire est', comments[0]);
}, function(error) {
    console.log(error);
});