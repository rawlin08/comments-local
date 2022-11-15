const curr = localStorage.getItem('currentUser');
let currentUser = JSON.parse(curr);
const currPost = localStorage.getItem('currentPost');
let currentPost = JSON.parse(currPost);

fetch(`http://localhost:3000/accounts/${currentUser.id}`)
    .then((response) => response.json())
    .then((data) => accountData = data)
    .then(() => {
        setTimeout(() => {
            ifLoggedTrue();
            updateDetails();
        }, 50)
})

fetch('http://localhost:3000/db')
    .then((response) => response.json())
    .then((data) => jsondata = data)

let currUser = {
    id: 0,
    role: ''
}

const accountStructure = document.querySelector('.accountStructure');
const posts = document.querySelector('.posts');
const logCheck = document.querySelector('.logCheck');
const nameDisplay = document.querySelector('.name');
const username = document.querySelector('.username');
const password = document.querySelector('.password');
const updateAccount = document.querySelector('.update');
const accountImageDisplay = document.querySelector('.accountImage');
const deleteBttn = document.querySelector('.deleteBttn');

deleteBttn.addEventListener('click', () => {
    postsDelete();
    setTimeout(() => {
        accountDelete();
    }, 5000)
})

function ifLoggedTrue() {
    setTimeout(() => {
        // greeting
        accountImageDisplay.src = accountData.picture;
        let greeting = document.createElement('p');
        greeting.classList.add('greeting');
        if (accountData.name == '') {
            greeting.textContent = `Hello, ${accountData.username}`;
        }
        else {
            greeting.textContent = `Hello, ${accountData.name}`;
        }
        accountStructure.appendChild(greeting);
        let logoutBttn = document.createElement('button');
        logoutBttn.classList.add('logoutBttn');
        logoutBttn.textContent = 'Log Out';
        logoutBttn.addEventListener('click', () => {
            currUser.id = 0;
            localStorage.setItem('currentUser', JSON.stringify(currUser));
            location.href = '/sites/index.html'
        })

        accountStructure.appendChild(logoutBttn);
    }, 50);
}

function updateDetails() {
    nameDisplay.value = accountData.name;
    username.value = accountData.username;
    password.value = accountData.password;

    updateAccount.addEventListener('click', () => {
        let match = jsondata.accounts.find(account => account.username == username.value);

        if (username.value == '' || password.value == '') {
            console.log('nothing');
        }
        else if (match) {
            if (match.id == currentUser.id) {
                updateAccountDetails();
            }
            else {
                console.log('username already taken');
            }
        }
        else {
            updateAccountDetails();
        }
    })
}

function updateAccountDetails() {
    let account = {
        id: '',
        name: '',
        username: '',
        password: '',
        role: 'user',
        picture: accountData.picture
    }

    account.id = currentUser.id;
    account.name = nameDisplay.value;
    account.username = username.value;
    account.password = password.value;
    account.role = currentUser.role;
    account.picture = 

    console.log(account);
    fetch(`http://localhost:3000/accounts/${currentUser.id}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(account),
        })
        .then((response) => response.json())
        .then((post) => {
            console.log('Success:', post);
            location.href = '/sites/index.html'
        })
        .catch((error) => {
            console.error('Error:', error);
        })
}

fetch('http://localhost:3000/posts')
    .then((response) => response.json())
    .then((data) => postsArray = data)

function commentsDelete() {
    posts.forEach(post => {
        fetch(`http://localhost:3000/posts/${post.id}`, {
            method: 'DELETE',
            })
            .then((response) => response.json())
            .catch((error) => {
                console.error('Error:', error);
            })
    });
}

function postsDelete() {
    let posts = postsArray.filter(post => post.accountId == currentUser.id);
    posts.forEach(post => {
        fetch(`http://localhost:3000/posts/${post.id}`, {
            method: 'DELETE',
            })
            .then((response) => response.json())
            .catch((error) => {
                console.error('Error:', error);
            })
    });
}

function accountDelete() {
    fetch(`http://localhost:3000/accounts/${currentUser.id}`, {
        method: 'DELETE',
        })
        .then((response) => response.json())
        .then(() => {
            localStorage.setItem('currentUser', JSON.stringify(currUser));
            location.href = '/sites/index.html'
        })
        .catch((error) => {
            console.error('Error:', error);
        })
}