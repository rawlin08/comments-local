fetch('http://localhost:3000/db')
    .then((response) => response.json())
    .then((data) => jsondata = data);

// selectors for DOM

const loginUsername = document.querySelector('.loginUsername');
const loginPassword = document.querySelector('.loginPassword');
const loginBttn = document.querySelector('.loginBttn');
const loginError = document.querySelector('.loginError');

// event listeners

loginBttn.addEventListener('click', () => {
    accountLogin();
})

let currUser = {
    id: 0,
    role: ''
}

let currPost = {
    id: 0,
    accountId: 0,
}

// set currentUser to nothing when hitting the login page (fail safe)
localStorage.setItem('currentUser', JSON.stringify(currUser));
localStorage.setItem('currentPost', JSON.stringify(currPost));


// functions


function accountLogin() {
    let match = jsondata.accounts.find(account => account.username == loginUsername.value);

    if (loginUsername.value === '' || loginPassword.value === '') {
        loginError.textContent = 'Username and Password is Required';
        return
    }
    if (!match) {
        loginError.textContent = 'No accounts found for username given';
        return
    }
    if (loginPassword.value != match.password) {
        loginError.textContent = 'Username or Password is Incorrect';
        return
    }
    else {
        currUser.id = match.id;
        localStorage.setItem('currentUser', JSON.stringify(currUser));
        location.href = '/sites/index.html'
    }
}