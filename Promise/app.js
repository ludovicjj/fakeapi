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


let addComment = function (comments) {
    let comment = comments[0];
    let ul = document.querySelector('#comment-body');
    let li = document.createElement('li');
    li.innerHTML = comment.body;
    ul.appendChild(li);
};

let getComment = async function() {
    var response = await get('https://my-json-server.typicode.com/ludovicjj/fakeapi/posts');
    let posts = JSON.parse(response);
    response = await get('https://my-json-server.typicode.com/ludovicjj/fakeapi/comments?postId=' + posts[0].id);
    return JSON.parse(response);
};

getComment().then(comments => {
    addComment(comments);
}).catch(error => {
    console.log(error)
});


