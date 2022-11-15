fetch('http://localhost:3000/db')
    .then((response) => response.json())
    .then((data) => jsondata = data)

// selectors for DOM

const signupUsername = document.querySelector('.signupUsername');
const signupPassword = document.querySelector('.signupPassword');
const signupBttn = document.querySelector('.signupBttn');
const signupError = document.querySelector('.signupError');

// event listeners

signupBttn.addEventListener('click', () => {
    accountCreate();
})

let currUser = {
    id: 0,
    role: ''
}

let account = {
    id: '',
    name: '',
    username: '',
    password: '',
    role: 'user',
    picture: '/images/avatars/defaultUser.png'
}

localStorage.setItem('currentUser', JSON.stringify(currUser));

//functions

function accountCreate() {
    let match = jsondata.accounts.find(account => account.username == signupUsername.value);
    if (signupUsername.value === '' || signupPassword.value === '') {
        signupError.textContent = 'Username and Password is Required';
    }
    else if (match) {
        signupError.textContent = 'Username is already taken';
    }
    else {
        account.username = signupUsername.value;
        account.password = signupPassword.value;
        accountWrite();
        accountLogin();
    }
}

function accountWrite() {
    fetch('http://localhost:3000/accounts', {
        method: 'POST',
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
        })
}

function accountLogin() {
    setTimeout(() => {
        let arrayLength = jsondata.accounts.length + 1;
        currUser.id = arrayLength;
        localStorage.setItem('currentUser', JSON.stringify(currUser));
        location.href = '/sites/index.html';
    }, 50);
}