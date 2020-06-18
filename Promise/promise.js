// Fail : https://reqres.in/api/users/23

let get = function(url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if(xhr.status === 200) {
                    resolve(xhr.responseText);
                } else {
                    reject(xhr);
                }
            }
        };

        xhr.open('GET', url, true);
        xhr.send();
    });
};


let getComment = function() {
    return get('https://my-json-server.typicode.com/ludovicjj/fakeapi/posts').then(function(response) {
        let posts = JSON.parse(response);
        return get('https://my-json-server.typicode.com/ludovicjj/fakeapi/comments?postId=' + posts[0].id);
    }).then(function(response) {
        let comments = JSON.parse(response);
        return comments;
    })
};

getComment().then(function (comments) {
    console.log(comments[0]);
}).catch(function (error) {
    console.log('request fail');
}).then(function () {
    console.log('Fin des requetes Ajax');
});


