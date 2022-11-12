fetch('http://localhost:3000/db')
    .then((response) => response.json())
    .then((data) => jsondata = data);

// selectors for DOM

const loginUsername = document.querySelector('.loginUsername');
const loginPassword = document.querySelector('loginPassword');
const loginBttn = document.querySelector('.loginBttn');
const loginError = document.querySelector('.loginError');