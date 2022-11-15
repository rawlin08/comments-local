fetch('http://localhost:3000/db')
    .then((response) => response.json())
    .then((data) => jsondata = data)
    .then(() => {
        if (jsondata.posts.length == 0) { // if the posts db is empty
            displayNoPosts();
        }
        else { // if there are posts in db
            setTimeout(() => {
                displayPosts();
            }, 50)
        }
})

fetch('http://localhost:3000/comments')
    .then((response) => response.json())
    .then((data) => commentsArray = data)

fetch('http://localhost:3000/posts')
    .then((response) => response.json())
    .then((data) => postsArray = data)

// selectors for DOM

const accountStructure = document.querySelector('.accountStructure');
const posts = document.querySelector('.posts');
const logCheck = document.querySelector('.logCheck');
const accountImageDisplay = document.querySelector('.accountImage');
const searchBar = document.querySelector('#searchBar');
const submitBttn = document.querySelector('.submit');
submitBttn.addEventListener('click', () => {
    searchPosts();
})

// default values
// set currentUser.id to 0. Only update when needed. Else will keep signing user out after login.

let currUser = {
    id: 0,
    role: ''
}

// used to edit and delete posts

let currPost = {
    id: 0,
    accountId: 0,
}

let CurrComment = {
    id: 0,
    accountId: 0,
}

let account = {
    id: '',
    name: '',
    username: '',
    password: '',
    role: 'user',
    picture: '/images/avatars/defaultUser.png'
}

let post = {
    id: '',
    accountId: '',
    title: '',
    content: '',
    createdAt: '',
    editedAt: '',
    votes: 0,
    upVotedAccounts: [],
    downVotedAccounts: [],
    comments: []
}

let postPatch = {
    id: '',
    accountId: '',
    title: '',
    content: '',
    createdAt: '',
    editedAt: '',
    votes: 0,
    upVotedAccounts: [],
    downVotedAccounts: [],
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

let commentPatch = {
    id: '',
    accountId: '',
    postId: '',
    content: '',
    createdAt: '',
    votes: 0,
}

// grabbing currentUser and currentPost from localStorage

const curr = localStorage.getItem('currentUser');
let currentUser = JSON.parse(curr);
if (!currentUser) {
    localStorage.setItem('currentUser', JSON.stringify(currUser));
}
localStorage.setItem('currentPost', JSON.stringify(currPost));
localStorage.setItem('currentComment', JSON.stringify(CurrComment));

if (currentUser.id == 0) { // if no one is logged in
    ifLoggedFalse();
}
else { // if someone is logged in
    ifLoggedTrue();
}

// account functions


function ifLoggedFalse() {
    accountImageDisplay.style.display = 'none';
    let accountControl1a = document.createElement('a');
    accountControl1a.href = '/sites/signup.html';
    let accountControl2a = document.createElement('a');
    accountControl2a.href = '/sites/login.html';
    let accountControl1b = document.createElement('button');
    accountControl1b.classList.add('accountControl');
    accountControl1b.textContent = 'Sign Up';
    accountStructure.style.flexDirection = 'row';
    accountStructure.style.gap = '10px';
    let accountControl2b = document.createElement('button');
    accountControl2b.classList.add('accountControl');
    accountControl2b.textContent = 'Log In';
    accountControl1a.appendChild(accountControl1b);
    accountControl2a.appendChild(accountControl2b);
    accountStructure.appendChild(accountControl1a);
    accountStructure.appendChild(accountControl2a);
    
    let accountBttns = document.createElement('div');
    accountBttns.classList.add('accountBttns');
    logCheck.appendChild(accountBttns);
    
    let signA = document.createElement('a');
    signA.href = "/sites/signup.html";
    let signB = document.createElement('button');
    let signText = document.createTextNode('Sign Up');
    signB.append(signText);
    signA.appendChild(signB);
    let logA = document.createElement('a');
    logA.href = "/sites/login.html";
    let logB = document.createElement('button');
    let logText = document.createTextNode('Log In');
    logB.appendChild(logText)
    logA.appendChild(logB);
    signB.classList.add('mainControl');
    logB.classList.add('mainControl')
    
    accountBttns.appendChild(signA);
    accountBttns.appendChild(logA);
}

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
        let title = document.createElement('h2');
        title.classList.add('title')
        let titleTextBox = document.createElement('textarea');
        titleTextBox.placeholder = 'Add a title for your post...';
        titleTextBox.classList.add('titleTextBox')
        titleTextBox.classList.add('titleText')
        let subtext = document.createElement('h2');
        subtext.classList.add('subText')
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
        sendText = document.createTextNode('SEND');
        send.appendChild(sendText);
        send.classList.add('send');
        const contentText = document.querySelector('#postContent');
        send.addEventListener('click', () => {
            // checks if textarea is blank
            if (contentText.value == '') {
                console.log('error');
            }
            else {
                // title
                const titleTextGrab = document.querySelector('.titleTextBox');
                post.title = titleTextGrab.value;
                titleTextGrab.value = '';
    
                // content
                post.content = contentText.value;
                contentText.value = '';
    
                // accountId
                const a = jsondata.accounts.find(account => account.id == currentUser.id);
                const b = a.id
                post.accountId = b;
                console.log(b);
        
                // createdAt
                const time = Date().slice(0, -24);
                post.createdAt = time;
                console.log(time);
    
                postCreate();
            }
        })
        sendButton.appendChild(send);
        newPost.appendChild(sendButton);
        logCheck.appendChild(newPost);
    }, 50)
}

function displayNoPosts() {
    posts.style.display = 'flex';
    posts.style.justifyContent = 'center';
    let noposts = document.createElement('p');
    noposts.classList.add('noposts');
    noposts.textContent = 'There are no posts to show';
    posts.appendChild(noposts);
}

function displayPosts() {
    const a = jsondata.posts;
    const b = jsondata.accounts;
    const c = jsondata.comments;
    const reversed = a.reverse();
    reversed.forEach(post => {
        // root posts
        let postDisplay = document.createElement('div');
        postDisplay.classList.add('post');
        posts.appendChild(postDisplay);
        
        // left div (votes)
        let divleft = document.createElement('div');
        postDisplay.appendChild(divleft);
        let votes = document.createElement('div');
        votes.classList.add('votes');
        let upVote = document.createElement('button');
        upVote.textContent = '+';
        upVote.classList.add('upVote');
        if (post.upVotedAccounts.includes(currentUser.id)) {
            upVote.style.color = 'red';
        }
        upVote.addEventListener('click', () => {
            if (currentUser.id == 0) {
                location.href = '/sites/login.html';
                return
            }
            if (post.upVotedAccounts.includes(currentUser.id)) {
                let d = post.upVotedAccounts.indexOf(currentUser.id);
                post.upVotedAccounts.splice(d, 1);
                currPost.id = post.id;
                postPatch.id = post.id;
                postPatch.accountId = post.accountId;
                postPatch.title = post.title;
                postPatch.content = post.content;
                postPatch.createdAt = post.createdAt;
                postPatch.editedAt = post.editedAt;
                postPatch.votes = --post.votes;
                postPatch.upVotedAccounts = post.upVotedAccounts;
                postPatch.downVotedAccounts = post.downVotedAccounts;
                postPatch.comments = post.comments;
                updateVotes();
                return
            }
            else {
                let a = post.downVotedAccounts.indexOf(currentUser.id);
                if (a != -1) {
                    post.downVotedAccounts.splice(a, 1);
                    postPatch.votes = post.votes + 2;
                }
                else {
                    postPatch.votes = ++post.votes;
                }
                currPost.id = post.id;
                postPatch.id = post.id;
                postPatch.accountId = post.accountId;
                postPatch.title = post.title;
                postPatch.content = post.content;
                postPatch.createdAt = post.createdAt;
                postPatch.editedAt = post.editedAt;
                postPatch.upVotedAccounts = post.upVotedAccounts.concat(currentUser.id);
                postPatch.downVotedAccounts = post.downVotedAccounts;
                postPatch.comments = post.comments;
                updateVotes();
            }
        })
        let score = document.createElement('p');
        score.classList.add('score');
        score.textContent = post.votes;
        let downVote = document.createElement('button');
        downVote.classList.add('downVote');
        downVote.textContent = '-';
        if (post.downVotedAccounts.includes(currentUser.id)) {
            downVote.style.color = 'red';
        }
        downVote.addEventListener('click', () => {
            if (currentUser.id == 0) {
                location.href = '/sites/login.html';
                return
            }
            if (post.downVotedAccounts.includes(currentUser.id)) {
                let a = post.downVotedAccounts.indexOf(currentUser.id);
                post.downVotedAccounts.splice(a, 1);
                currPost.id = post.id;
                postPatch.id = post.id;
                postPatch.accountId = post.accountId;
                postPatch.title = post.title;
                postPatch.content = post.content;
                postPatch.createdAt = post.createdAt;
                postPatch.editedAt = post.editedAt;
                postPatch.votes = ++post.votes;
                postPatch.upVotedAccounts = post.upVotedAccounts;
                postPatch.downVotedAccounts = post.downVotedAccounts;
                postPatch.comments = post.comments;
                updateVotes();
                return
            }
            else {
                let a = post.upVotedAccounts.indexOf(currentUser.id);
                if (a != -1) {
                    post.upVotedAccounts.splice(a, 1);
                    postPatch.votes = post.votes - 2;
                }
                else {
                    postPatch.votes = --post.votes
                }
                currPost.id = post.id;
                postPatch.id = post.id;
                postPatch.accountId = post.accountId;
                postPatch.title = post.title;
                postPatch.content = post.content;
                postPatch.createdAt = post.createdAt;
                postPatch.editedAt = post.editedAt;
                postPatch.upVotedAccounts = post.upVotedAccounts;
                postPatch.downVotedAccounts = post.downVotedAccounts.concat(currentUser.id);
                postPatch.comments = post.comments;
                updateVotes();
            }
        })
        votes.appendChild(upVote);
        votes.appendChild(score);
        votes.appendChild(downVote);
        divleft.appendChild(votes);
                
        // right div (account information, tools, and options)
        let divright = document.createElement('div');
        divright.classList.add('right');
        postDisplay.appendChild(divright);
        let accountDetails = document.createElement('div');
        accountDetails.classList.add('accountDetails');
        let aImage = document.createElement('div');
        aImage.classList.add('postAImage');
        let accountImage = document.createElement('img');
        accountImage.classList.add('accountImage');
        const d = b.find(account => account.id == post.accountId);
        accountImage.src = d.picture
        aImage.appendChild(accountImage);
        accountDetails.appendChild(aImage);

        let postDetails = document.createElement('div');
        postDetails.classList.add('postDetails');
        let usernameDisplay = document.createElement('p');
        usernameDisplay.classList.add('username');
        usernameDisplay.textContent = d.username
        let timePosted = document.createElement('p');
        timePosted.classList.add('timePosted');
        timePosted.textContent = post.createdAt;
        postDetails.appendChild(usernameDisplay);
        postDetails.appendChild(timePosted);
        accountDetails.appendChild(postDetails);

        let tools = document.createElement('div');
        tools.classList.add('tools');
        if (post.accountId == currentUser.id) {
            let deleteBttn = document.createElement('button');
            deleteBttn.classList.add('delete');
            deleteBttn.textContent = '✁ Delete';
            deleteBttn.addEventListener('click', () => {
                currPost.id = post.id;
                postDelete();
            });
            let editBttn = document.createElement('button');
            editBttn.classList.add('edit');
            editBttn.textContent = '✎ Edit';
            editBttn.addEventListener('click', () => {
                currPost.id = post.id;
                localStorage.setItem('currentPost', JSON.stringify(currPost));
                location.href = '/sites/editPost.html';
            });
            tools.appendChild(deleteBttn);
            tools.appendChild(editBttn);
        }
        else {
            let replyBttn = document.createElement('button');
            replyBttn.classList.add('reply');
            replyBttn.textContent = '↺ Reply';
            replyBttn.addEventListener('click', () => {
                currPost.id = post.id;
                localStorage.setItem('currentPost', JSON.stringify(currPost));
                location.href = '/sites/post.html';
            });
            tools.appendChild(replyBttn);
        }
        accountDetails.appendChild(tools);

        let commentA = document.createElement('div');
        commentA.classList.add('commentArea');
        let titleA = document.createElement('h3');
        titleA.classList.add('commentTitle');
        titleA.textContent = post.title;
        commentA.appendChild(titleA);
        let commentText = document.createElement('p');
        commentText.classList.add('comment');
        commentText.textContent = post.content;
        commentA.appendChild(commentText);

        const e = c.filter(comment => comment.postId == post.id);
        console.log(e);
        let options = document.createElement('div');
        options.classList.add('options');
        let commentCount = document.createElement('button');
        commentCount.classList.add('commentCount');
        if (commentsArray.length == 1) {
            commentCount.textContent = `${e.length} comment`;
        }
        else {
            commentCount.textContent = `${e.length} comments`;
        }
        commentCount.addEventListener('click', () => {
            currPost.id = post.id;
            localStorage.setItem('currentPost', JSON.stringify(currPost));
            location.href = '/sites/post.html';
        })
        options.appendChild(commentCount);

        divright.appendChild(accountDetails);
        divright.appendChild(commentA);
        divright.appendChild(options);
    })
    console.log('posts');
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
};

let grabCurrentPost = localStorage.getItem('currentPost');
let currentPost = JSON.parse(grabCurrentPost);

function postDelete() {
    fetch(`http://localhost:3000/posts/${currPost.id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        })
        .then((response) => response.json())
        .then((post) => {
            console.log('Success:', post);
            location.href = '/sites/index.html'
        })
        .catch((error) => {
            console.error('Error:', error);
        })
};

function postCreate() {
    fetch('http://localhost:3000/posts', {
        method: 'POST',
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
        .then();
};

function updateVotes() {
    fetch(`http://localhost:3000/posts/${currPost.id}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postPatch),
        })
        .then((response) => response.json())
        .then((post) => {
            console.log('Success:', post);
            location.href = '/sites/index.html'
        })
        .catch((error) => {
            console.error('Error:', error);
        })
        .then();
}

function searchPosts() {
    const a = jsondata.posts;
    let b = searchBar.value;

    if (b != '') {
        c = postsArray.find(post => post.title.includes(b))
        console.log(b);
        console.log(c);
    }
}