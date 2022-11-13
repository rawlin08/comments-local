fetch('http://localhost:3000/db')
    .then((response) => response.json())
    .then((data) => jsondata = data)
    .then(() => {
        console.log(jsondata.posts);
        if (jsondata.posts.length == 0) { // if the posts db is empty
            let noposts = document.createElement('p');
            noposts.classList.add('noposts');
            noposts.textContent = 'There are no posts to show';
            posts.appendChild(noposts);
            console.log('no posts');
        }
        else { // if there are posts in db
            const a = jsondata.posts;
            const reversed = a.reverse();
            const b = jsondata.accounts;
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
                let score = document.createElement('p');
                score.classList.add('score');
                score.textContent = post.votes;
                let downVote = document.createElement('button');
                downVote.classList.add('downVote');
                downVote.textContent = '-';
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
                const c = b.find(account => account.id == post.accountId);
                accountImage.src = `/images/${c.picture}`
                aImage.appendChild(accountImage);
                accountDetails.appendChild(aImage);

                let postDetails = document.createElement('div');
                postDetails.classList.add('postDetails');
                let usernameDisplay = document.createElement('p');
                usernameDisplay.classList.add('username');
                usernameDisplay.textContent = c.username
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
                    let editBttn = document.createElement('button');
                    editBttn.classList.add('edit');
                    editBttn.textContent = '✎ Edit';
                    tools.appendChild(deleteBttn);
                    tools.appendChild(editBttn);
                }
                else {
                    let replyBttn = document.createElement('button');
                    replyBttn.classList.add('reply');
                    replyBttn.textContent = '↺ Reply';
                    tools.appendChild(replyBttn);
                }
                accountDetails.appendChild(tools);

                let commentA = document.createElement('div');
                commentA.classList.add('commentArea');
                let commentText = document.createElement('p');
                commentText.classList.add('comment');
                commentText.textContent = post.content;
                commentA.appendChild(commentText);

                let options = document.createElement('div');
                options.classList.add('options');
                let commentCount = document.createElement('button');
                commentCount.classList.add('commentCount');
                if (post.comments.length == 1) {
                    commentCount.textContent = `${post.comments.length} comment`;
                }
                else {
                    commentCount.textContent = `${post.comments.length} comments`;
                }
                let goToPost = document.createElement('button');
                goToPost.classList.add('goToPost');
                goToPost.textContent = 'Go to Post';
                options.appendChild(commentCount);
                options.appendChild(goToPost);

                divright.appendChild(accountDetails);
                divright.appendChild(commentA);
                divright.appendChild(options);
            })
            console.log('posts');
        }
})
// selectors for DOM

const posts = document.querySelector('.posts');
const logCheck = document.querySelector('.logCheck');

// default values
// set currentUser.id to 0. Only update when needed. Else will keep signing user out after login.

let current = {
    id: 1,
    role: ''
}

const curr = localStorage.getItem('currentUser');
let currentUser = JSON.parse(curr);
if (!currentUser) {
    localStorage.setItem('currentUser', JSON.stringify(current));
}

const curre = localStorage.getItem('currentUser');
currentUser = JSON.parse(curre);

if (currentUser.id == 0) { // if no one is logged in
    let accountBttns = document.createElement('div');
    accountBttns.classList.add('accountBttns')
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
else { // if someone is logged in
    let newPost = document.createElement('div');
    newPost.classList.add('newpost');
    
    // logged in account image

    let aImage = document.createElement('div');
    aImage.classList.add('aImage');
    let postAccountImage = document.createElement('img');
    postAccountImage.classList.add('accountImage');
    postAccountImage.src = '/images/defaultUser.png';
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
    send.addEventListener('click', () => {
        // checks if textarea is blank
        if (contentText.value == '') {
            console.log('error');
        }
        else {
            // title
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
}

const contentText = document.querySelector('#postContent');
const titleTextGrab = document.querySelector('.titleText');

let account = {
    id: '',
    username: '',
    password: '',
    role: 'user',
    picture: 'default'
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
    postid: '',
    content: '',
    createdAt: '',
    votes: 0,
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
        })
        .catch((error) => {
            console.error('Error:', error);
        })
}