fetch('http://localhost:3000/db')
    .then((response) => response.json())
    .then((data) => jsondata = data)
    .then(() => {
        setTimeout(() => {
            ifLoggedTrue();
            editComment();
        }, 100)
})

let currUser = {
    id: 0,
    role: ''
}

let comment = {
    id: '',
    accountId: '',
    postId: '',
    content: '',
    createdAt: '',
    votes: 0,
    upVotedAccounts: [],
    downVotedAccounts: []
}

const accountStructure = document.querySelector('.accountStructure');
const posts = document.querySelector('.posts');
const logCheck = document.querySelector('.logCheck');
const accountImageDisplay = document.querySelector('.accountImage');

const curr = localStorage.getItem('currentUser');
let currentUser = JSON.parse(curr);
const currPost = localStorage.getItem('currentPost');
let currentPost = JSON.parse(currPost);
const curr2 = localStorage.getItem('currentComment');
let currentComment = JSON.parse(curr2);

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

function editComment() {
    let accountName = jsondata.accounts.find(account => currentUser.id == account.id);
    let account = jsondata.comments.find(comment => currentComment.id == comment.id);
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
    postContent.placeholder = 'Edit your comment...';
    postContent.value = account.content;

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
            // comment id
            comment.id = currentComment.id;

            // accountId
            comment.accountId = accountName.id;

            // post id
            comment.postId = account.postId

            // content
            comment.content = postContent.value;

            // createdAt
            const time = Date().slice(0, -24);
            comment.createdAt = time;

            // votes
            comment.votes = account.votes;

            // voted accounts
            comment.upVotedAccounts = account.upVotedAccounts;
            comment.downVotedAccounts = account.downVotedAccounts;

            console.log(comment);

            commentEdit();
        }
    })
    sendButton.appendChild(send);
    newPost.appendChild(sendButton);
    logCheck.appendChild(newPost);
}

const contentText = document.querySelector('#postContent');

function commentEdit() {
    fetch(`http://localhost:3000/comments/${currentComment.id}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
        })
        .then((response) => response.json())
        .then((comment) => {
            console.log('Success:', comment);
            location.href = '/sites/post.html'
        })
        .catch((error) => {
            console.error('Error:', error);
        })
}