fetch('http://localhost:3000/db')
    .then((response) => response.json())
    .then((data) => jsondata = data);

// selectors for DOM

const signupUsername = document.querySelector('.signupUsername');
const signupPassword = document.querySelector('.signupPassword');
const signupBttn = document.querySelector('.signupBttn');
const signupError = document.querySelector('.signupError');

// event listeners

signupBttn.addEventListener('click', () => {
    accountCreate();
})

//functions

function accountCreate() {
    console.log('hit');
    let match = jsondata.accounts.find(account => account.username == signupUsername.value);
    console.log(match);

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
        accountDefault();
        setTimeout(() => {
            console.log('delayed for 5 seconds');
        }, 5000)
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