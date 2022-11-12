fetch('http://localhost:3000/db')
    .then((response) => response.json())
    .then((data) => jsondata = data)
    .then(() => {
        console.log(jsondata.posts);
        if (jsondata.posts.length == 0) {
            console.log('no posts');
            let noposts = document.createElement('p');
            noposts.classList.add('noposts');
            noposts.textContent = 'There are no posts to show';
            posts.appendChild(noposts);
        }
        else {
            console.log('posts');
        }
    })
// selectors for DOM

const posts = document.querySelector('.posts');

// create new currentUser object

let currentUser = {
    id: '',
    role: ''
}

// check to see if there are any posts

// default values

let account = {
    id: '',
    username: '',
    password: '',
    role: 'user',
    picture: 'default'
}

let post = {
    id: '',
    accountid: '',
    content: '',
    time: '',
    votes: 0
}

let comment = {
    id: '',
    accountid: '',
    postid: '',
    content: '',
    time: '',
    votes: 0
}

// account functions

function accountDefault() {
    account.username = "";
    account.password = "";
}

function accountDelete() {
    fetch(`http://localhost:3000/accounts/${currentUser.id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        })
        .then((response) => response.json())
        .then((account) => {
            console.log('Success:', account);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}