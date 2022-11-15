fetch('http://localhost:3000/db')
    .then((response) => response.json())
    .then((data) => jsondata = data)
    .then(() => {
        setTimeout(() => {
            ifLoggedTrue();
            editPost();
        }, 100)
})

let currUser = {
    id: 0,
    role: ''
}

let post = {
    id: '',
    accountId: '',
    title: '',
    content: '',
    createdAt: '',
    votes: 0,
    comments: []
}

let comment = {
    id: '',
    accountId: '',
    postId: '',
    content: '',
    createdAt: '',
    votes: 0,
}

const accountStructure = document.querySelector('.accountStructure');
const posts = document.querySelector('.posts');
const logCheck = document.querySelector('.logCheck');
const accountImageDisplay = document.querySelector('.accountImage');

const curr = localStorage.getItem('currentUser');
let currentUser = JSON.parse(curr);
const currPost = localStorage.getItem('currentPost');
let currentPost = JSON.parse(currPost);

function ifLoggedTrue() {
    setTimeout(() => {
        let accountName = jsondata.accounts.find(account => currentUser.id == account.id);
        let greeting = document.createElement('p');
        greeting.classList.add('greeting');
        if (accountName.name == '') {
            greeting.textContent = `Hello, ${accountName.username}`;
        }
        else {
            greeting.textContent = `Hello, ${accountName.name}`;
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
        accountImageDisplay.src = accountName.picture;
        
        accountStructure.appendChild(logoutBttn);
    }, 50);
}

function editPost() {
    let accountName = jsondata.accounts.find(account => currentUser.id == account.id);
    let account = jsondata.posts.find(post => currentPost.id == post.id);
    console.log(account);
    let newPost = document.createElement('div');
    newPost.classList.add('newpost');
    
    // logged in account image

    let aImage = document.createElement('div');
    aImage.classList.add('aImage');
    let postAccountImage = document.createElement('img');
    postAccountImage.classList.add('accountImage');
    postAccountImage.src = accountName.picture;
    aImage.appendChild(postAccountImage);
    newPost.appendChild(aImage);
    logCheck.appendChild(newPost);
    
    // comment area
    
    let commentArea = document.createElement('div');
    commentArea.classList.add('commentArea');
    let postContent = document.createElement('textarea');
    postContent.id = 'postContent';
    postContent.placeholder = 'Add some context...';
    postContent.value = account.content;
    let title = document.createElement('h2');
    title.classList.add('title')
    let titleTextBox = document.createElement('textarea');
    titleTextBox.placeholder = 'Add a title for your post...';
    titleTextBox.value = account.title;
    titleTextBox.classList.add('titleTextBox');
    titleTextBox.classList.add('titleText');
    let subtext = document.createElement('h2');
    subtext.classList.add('subText');
    let titleText = document.createTextNode('Title:');
    let subText = document.createTextNode('Subtext:');
    title.appendChild(titleText);
    subtext.appendChild(subText);
    commentArea.appendChild(title);
    commentArea.appendChild(titleTextBox);
    commentArea.appendChild(subtext);

    commentArea.appendChild(postContent);
    newPost.appendChild(commentArea);
    logCheck.appendChild(newPost);
    
    // send button

    let sendButton = document.createElement('div');
    sendButton.classList.add('sendButton');
    let send = document.createElement('button');
    sendText = document.createTextNode('RESEND');
    send.appendChild(sendText);
    send.classList.add('send');
    send.addEventListener('click', () => {
        // checks if textarea is blank
        if (postContent.value == '') {
            console.log('error');
        }
        else {
            // postId
            post.id = currentPost.id;
            console.log(post);

            // title
            const titleTextGrab = document.querySelector('.titleTextBox');
            post.title = titleTextGrab.value;

            // content
            post.content = postContent.value;

            // accountId
            const a = jsondata.accounts.find(account => account.id == currentUser.id);
            const b = a.id
            post.accountId = b;
    
            // createdAt
            const time = Date().slice(0, -24);
            post.createdAt = time;

            postEdit();
        }
    })
    sendButton.appendChild(send);
    newPost.appendChild(sendButton);
    logCheck.appendChild(newPost);
}

const contentText = document.querySelector('#postContent');

function postEdit() {
    fetch(`http://localhost:3000/posts/${currentPost.id}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
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

function commentEdit() {
    fetch(`http://localhost:3000/comments/${currentComment.id}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
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