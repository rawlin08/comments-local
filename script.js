let data = {};

fetch('./data.json')
    .then((response) => response.json())
    .then((data) => jsondata = data);

// selectors for DOM

const removeAccount = document.querySelector('.removeAccount');
const createAccount = document.querySelector('.createAccount');

// event listeners

removeAccount.addEventListener('click', () => {
    accountDelete();
});

createAccount.addEventListener('click', () => {
    accountCreate();
})

// default values

// create new account object

let account = {
    id: "",
    username: "",
    password: "",
    role: "user",
    picture: "default",
}

// create new comment object

let comment = {
    text: '',
    accountid: '',
    inReplyTo: '',
    votes: 0,
}

let currentUser = {
    id: ""
}

// functions

function accountDefault() {
    account.username = "";
    account.password = "";
}

function accountCreate() {
    button.preventDefault();
    account.username = prompt('Enter Username');
    account.password = prompt('Enter Password');

    accountWrite();
    accountDefault();
    accountChange();
}

function accountChange() {
    currentUser.id = jsondata.accounts.length - 1;
    console.log(jsondata.accounts.length);
}

function accountWrite() {
    fetch('http://localhost:3000/accounts', {
        method: 'POST', // or 'PUT'
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(account),
        })
        .then((response) => response.json())
        .then((account) => {
            console.log('Success:', account);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
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