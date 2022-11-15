fetch('http://localhost:3000/db')
    .then((response) => response.json())
    .then((data) => jsondata = data)
    .then(() => {
        setTimeout(() => {
            displayPost();
            displayComments();
        }, 100)
    })

// selectors for DOM

let postSelector = document.querySelector('.post');
let commentSelector = document.querySelector('.comments');
const accountStructure = document.querySelector('.accountStructure');
const mainDOM = document.querySelector('main');
const accountImageDisplay = document.querySelector('.accountImage');
const accountImageDiv = document.querySelector('.accountImageDiv');
const newcomment = document.querySelector('.newcomment');

const curr = localStorage.getItem('currentUser');
let currentUser = JSON.parse(curr);
const currPost = localStorage.getItem('currentPost');
let currentPost = JSON.parse(currPost);

if (currentUser.id == 0) { // if no one is logged in
    ifLoggedFalse();
}
else { // if someone is logged in
    ifLoggedTrue();
}

let currUser = {
    id: 0,
    role: ''
}

let currComment = {
    id: 0,
    accountId: 0,
}

localStorage.setItem('currentComment', JSON.stringify(currComment));

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

let commentPatch = {
    id: '',
    accountId: '',
    postId: '',
    content: '',
    createdAt: '',
    votes: 0,
    upVotedAccounts: [],
    downVotedAccounts: []
}


// functions


function ifLoggedFalse() {
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
    accountImageDiv.style.display = 'none';

    let accountBttns = document.createElement('div');
    accountBttns.classList.add('accountBttns');

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
    logB.classList.add('mainControl');

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

        let newComment = document.createElement('div');
        newComment.classList.add('newcomment');
    
        // logged in account image
        let aImage = document.createElement('div');
        aImage.classList.add('aImage');
        let postAccountImage = document.createElement('img');
        postAccountImage.classList.add('accountImage');
        postAccountImage.src = accountName.picture;
        aImage.appendChild(postAccountImage);
        newComment.appendChild(aImage);
        mainDOM.appendChild(newComment);

        // comment area
        let commentArea = document.createElement('div');
        commentArea.classList.add('commentArea');
        let commentContent = document.createElement('textarea');
        commentContent.id = 'postContent';
        commentContent.placeholder = 'Add a comment...';
    
        commentArea.appendChild(commentContent);
        newComment.appendChild(commentArea);
        mainDOM.appendChild(newComment);
        
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
                // accountId
                const a = jsondata.accounts.find(account => account.id == currentUser.id);
                const b = a.id
                comment.accountId = b;
                
                // postId
                comment.postId = currentPost.id;

                // content
                comment.content = contentText.value;
        
                // createdAt
                const time = Date().slice(0, -24);
                comment.createdAt = time;
    
                commentCreate();
            }
        })
        sendButton.appendChild(send);
        newComment.appendChild(sendButton);
        mainDOM.appendChild(newComment);
    }, 50)
}

function displayPost() {
    const a = jsondata.posts.find(post => post.id == currentPost.id);
    const b = jsondata.accounts;

    // left div (votes)
    let divleft = document.createElement('div');
    postSelector.appendChild(divleft);
    let votes = document.createElement('div');
    votes.classList.add('votes');
    let upVote = document.createElement('button');
    upVote.textContent = '+';
    upVote.classList.add('upVote');
    upVote.addEventListener('click', () => {
        if (currentUser.id == 0) {
            location.href = '/sites/login.html';
            return
        }
        if (a.upVotedAccounts.includes(currentUser.id)) {
            let c = a.upVotedAccounts.indexOf(currentUser.id);
            a.upVotedAccounts.splice(c, 1);
            currComment.id = a.id;
            postPatch.id = a.id;
            postPatch.accountId = a.accountId;
            postPatch.title = a.title;
            postPatch.content = a.content;
            postPatch.createdAt = a.createdAt;
            postPatch.editedAt = a.editedAt;
            postPatch.votes = --a.votes;
            postPatch.upVotedAccounts = a.upVotedAccounts;
            postPatch.downVotedAccounts = a.downVotedAccounts;
            postPatch.comments = a.comments;
            console.log(postPatch);
            updateVotes();
            return
        }
        else {
            let c = a.downVotedAccounts.indexOf(currentUser.id);
            if (c != -1) {
                a.downVotedAccounts.splice(c, 1);
                postPatch.votes = a.votes + 2;
            }
            else {
                postPatch.votes = ++a.votes;
            }
            currComment.id = a.id;
            postPatch.id = a.id;
            postPatch.accountId = a.accountId;
            postPatch.title = a.title;
            postPatch.content = a.content;
            postPatch.createdAt = a.createdAt;
            postPatch.editedAt = a.editedAt;
            postPatch.upVotedAccounts = a.upVotedAccounts.concat(currentUser.id);
            postPatch.downVotedAccounts = a.downVotedAccounts;
            postPatch.comments = a.comments;
            console.log(postPatch);
            updateVotes();
        }
    })
    let score = document.createElement('p');
    score.classList.add('score');
    score.textContent = a.votes;
    let downVote = document.createElement('button');
    downVote.classList.add('downVote');
    downVote.textContent = '-';
    downVote.addEventListener('click', () => {
        if (currentUser.id == 0) {
            location.href = '/sites/login.html';
            return
        }
        if (a.downVotedAccounts.includes(currentUser.id)) {
            let c = a.downVotedAccounts.indexOf(currentUser.id);
            a.downVotedAccounts.splice(c, 1);
            currComment.id = a.id;
            postPatch.id = a.id;
            postPatch.accountId = a.accountId;
            postPatch.title = a.title;
            postPatch.content = a.content;
            postPatch.createdAt = a.createdAt;
            postPatch.editedAt = a.editedAt;
            postPatch.votes = ++a.votes;
            postPatch.upVotedAccounts = a.upVotedAccounts;
            postPatch.downVotedAccounts = a.downVotedAccounts;
            postPatch.comments = a.comments;
            console.log(postPatch);
            updateVotes();
            return
        }
        else {
            let c = a.upVotedAccounts.indexOf(currentUser.id);
            if (c != -1) {
                a.upVotedAccounts.splice(c, 1);
                postPatch.votes = a.votes - 2;
            }
            else {
                postPatch.votes = --a.votes
            }
            currComment.id = a.id;
            postPatch.id = a.id;
            postPatch.accountId = a.accountId;
            postPatch.title = a.title;
            postPatch.content = a.content;
            postPatch.createdAt = a.createdAt;
            postPatch.editedAt = a.editedAt;
            postPatch.upVotedAccounts = a.upVotedAccounts;
            postPatch.downVotedAccounts = a.downVotedAccounts.concat(currentUser.id);
            postPatch.comments = a.comments;
            console.log(postPatch);
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
    postSelector.appendChild(divright);
    let accountDetails = document.createElement('div');
    accountDetails.classList.add('accountDetails');
    let aImage = document.createElement('div');
    aImage.classList.add('postAImage');
    let accountImage = document.createElement('img');
    accountImage.classList.add('accountImage');
    const c = b.find(account => account.id == a.accountId);
    accountImage.src = `${c.picture}`;
    aImage.appendChild(accountImage);
    accountDetails.appendChild(aImage);
        
    let postDetails = document.createElement('div');
    postDetails.classList.add('postDetails');
    let usernameDisplay = document.createElement('p');
    usernameDisplay.classList.add('username');
    usernameDisplay.textContent = c.username;
    let timePosted = document.createElement('p');
    timePosted.classList.add('timePosted');
    timePosted.textContent = a.createdAt;
    postDetails.appendChild(usernameDisplay);
    postDetails.appendChild(timePosted);
    accountDetails.appendChild(postDetails);
        
    let tools = document.createElement('div');
    tools.classList.add('tools');
    if (a.accountId == currentUser.id) {
        let deleteBttn = document.createElement('button');
        deleteBttn.classList.add('delete');
        deleteBttn.textContent = '✁ Delete';
        deleteBttn.addEventListener('click', () => {
            postDelete();
        });
        let editBttn = document.createElement('button');
        editBttn.classList.add('edit');
        editBttn.textContent = '✎ Edit';
        editBttn.addEventListener('click', () => {
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
            if (currentUser.id != 0) {
                currPost.id = a.id;
                localStorage.setItem('currentPost', JSON.stringify(currPost));
                location.href = '/sites/post.html';
            }
        });
        tools.appendChild(replyBttn);
    }
    accountDetails.appendChild(tools);
        
    let commentA = document.createElement('div');
    commentA.classList.add('commentArea');
    let titleA = document.createElement('h3');
    titleA.classList.add('commentTitle');
    titleA.textContent = a.title;
    commentA.appendChild(titleA);
    let commentText = document.createElement('p');
    commentText.classList.add('comment');
    commentText.textContent = a.content;
    commentA.appendChild(commentText);
        
    divright.appendChild(accountDetails);
    divright.appendChild(commentA);
}

function displayComments() {
    const a = jsondata.posts.find(post => post.id == currentPost.id);
    const b = jsondata.accounts;
    const c = jsondata.comments.filter(comment => comment.postId == a.id);
    const reversed = c.reverse();
    if (reversed.length == 0) {
        let nocomments = document.createElement('p');
        nocomments.classList.add('nocomments');
        nocomments.textContent = 'There are no comments';
        mainDOM.appendChild(nocomments);
    }
    else {
        reversed.forEach(post => {
            let commentOnPost = document.createElement('div');
            commentOnPost.classList.add('commentOnPost')
            // left div (votes)
            let divleft = document.createElement('div');
            commentOnPost.appendChild(divleft);
            let votes = document.createElement('div');
            votes.classList.add('votes');
            let upVote = document.createElement('button');
            upVote.textContent = '+';
            if (post.upVotedAccounts.includes(currentUser.id)) {
                upVote.style.color = 'red';
            }
            upVote.classList.add('upVote');
            upVote.addEventListener('click', () => {
                if (currentUser.id == 0) {
                    location.href = '/sites/login.html';
                    return
                }
                if (post.upVotedAccounts.includes(currentUser.id)) {
                    let d = post.upVotedAccounts.indexOf(currentUser.id);
                    post.upVotedAccounts.splice(d, 1);
                    currComment.id = post.id;
                    commentPatch.id = post.id;
                    commentPatch.accountId = post.accountId;
                    commentPatch.postId = post.postId;
                    commentPatch.title = post.title;
                    commentPatch.content = post.content;
                    commentPatch.createdAt = post.createdAt;
                    commentPatch.editedAt = post.editedAt;
                    commentPatch.votes = --post.votes;
                    commentPatch.upVotedAccounts = post.upVotedAccounts;
                    commentPatch.downVotedAccounts = post.downVotedAccounts;
                    commentPatch.comments = post.comments;
                    console.log(commentPatch);
                    updateVotesComments();
                    return
                }
                else {
                    let d = post.downVotedAccounts.indexOf(currentUser.id);
                    if (d != -1) {
                        post.downVotedAccounts.splice(d, 1);
                        commentPatch.votes = post.votes + 2;
                    }
                    else {
                        commentPatch.votes = ++post.votes;
                    }
                    currComment.id = post.id;
                    commentPatch.id = post.id;
                    commentPatch.accountId = post.accountId;
                    commentPatch.postId = post.postId;
                    commentPatch.title = post.title;
                    commentPatch.content = post.content;
                    commentPatch.createdAt = post.createdAt;
                    commentPatch.editedAt = post.editedAt;
                    commentPatch.upVotedAccounts = post.upVotedAccounts.concat(currentUser.id);
                    commentPatch.downVotedAccounts = post.downVotedAccounts;
                    commentPatch.comments = post.comments;
                    console.log(commentPatch);
                    updateVotesComments();
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
                    let d = post.downVotedAccounts.indexOf(currentUser.id);
                    post.downVotedAccounts.splice(d, 1);
                    currComment.id = post.id;
                    commentPatch.id = c.id;
                    commentPatch.accountId = post.accountId;
                    commentPatch.postId = post.postId;
                    commentPatch.title = post.title;
                    commentPatch.content = post.content;
                    commentPatch.createdAt = post.createdAt;
                    commentPatch.editedAt = post.editedAt;
                    commentPatch.votes = ++post.votes;
                    commentPatch.upVotedAccounts = post.upVotedAccounts;
                    commentPatch.downVotedAccounts = post.downVotedAccounts;
                    commentPatch.comments = post.comments;
                    console.log(commentPatch);
                    updateVotesComments();
                    return
                }
                else {
                    let d = post.upVotedAccounts.indexOf(currentUser.id);
                    if (d != -1) {
                        post.upVotedAccounts.splice(d, 1);
                        commentPatch.votes = post.votes - 2;
                    }
                    else {
                        commentPatch.votes = --post.votes
                    }
                    currComment.id = post.id;
                    commentPatch.id = post.id;
                    commentPatch.accountId = post.accountId;
                    commentPatch.postId = post.postId;
                    commentPatch.title = post.title;
                    commentPatch.content = post.content;
                    commentPatch.createdAt = post.createdAt;
                    commentPatch.editedAt = post.editedAt;
                    commentPatch.upVotedAccounts = post.upVotedAccounts;
                    commentPatch.downVotedAccounts = post.downVotedAccounts.concat(currentUser.id);
                    commentPatch.comments = post.comments;
                    console.log(commentPatch);
                    updateVotesComments();
                }
            })
    
            votes.appendChild(upVote);
            votes.appendChild(score);
            votes.appendChild(downVote);
            divleft.appendChild(votes);
            
            // right div (account information, tools, and options)
            let divright = document.createElement('div');
            divright.classList.add('right');
            commentOnPost.appendChild(divright);
            let accountDetails = document.createElement('div');
            accountDetails.classList.add('accountDetails');
            let aImage = document.createElement('div');
            aImage.classList.add('postAImage');
            let accountImage = document.createElement('img');
            accountImage.classList.add('accountImage');
            const c = b.find(account => account.id == post.accountId);
            accountImage.src = `${c.picture}`
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
                console.log(post.id);
                deleteBttn.addEventListener('click', () => {
                    currComment.id = post.id;
                    commentDelete();
                });
                let editBttn = document.createElement('button');
                editBttn.classList.add('edit');
                editBttn.textContent = '✎ Edit';
                editBttn.addEventListener('click', () => {
                    currComment.id = post.id;
                    localStorage.setItem('currentComment', JSON.stringify(currComment));
                    location.href = '/sites/editComment.html';
                });
                tools.appendChild(deleteBttn);
                tools.appendChild(editBttn);
            }
            else {
                let replyBttn = document.createElement('button');
                replyBttn.classList.add('reply');
                replyBttn.textContent = '↺ Reply';
                replyBttn.addEventListener('click', () => {
                    currComment.id = post.id;
                    localStorage.setItem('currentPost', JSON.stringify(currComment));
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
            
            divright.appendChild(accountDetails);
            divright.appendChild(commentA);
            commentSelector.appendChild(commentOnPost)
        })
    }
};

function postDelete() {
    fetch(`http://localhost:3000/posts/${currentPost.id}`, {
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

function commentDelete() {
    fetch(`http://localhost:3000/comments/${currComment.id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        })
        .then((response) => response.json())
        .then((post) => {
            console.log('Success:', post);
            location.href = '/sites/post.html'
        })
        .catch((error) => {
            console.error('Error:', error);
        })
}

function commentCreate() {
    fetch('http://localhost:3000/comments', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
        })
        .then((response) => response.json())
        .then((post) => {
            console.log('Success:', post);
            location.href = '/sites/post.html'
        })
        .catch((error) => {
            console.error('Error:', error);
        })
        .then();
};

function updateVotes() {
    fetch(`http://localhost:3000/posts/${currentPost.id}`, {
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
            location.href = '/sites/post.html'
        })
        .catch((error) => {
            console.error('Error:', error);
        })
        .then();
};

function updateVotesComments(){
    fetch(`http://localhost:3000/comments/${currComment.id}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentPatch),
        })
        .then((response) => response.json())
        .then((post) => {
            console.log('Success:', post);
            location.href = '/sites/post.html'
        })
        .catch((error) => {
            console.error('Error:', error);
        })
        .then();
}