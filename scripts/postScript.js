const a = jsondata.posts
a.forEach(post => {
    let postDisplay = document.createElement('div');
    postDisplay.classList.add('post');
    posts.appendChild(postDisplay);

    let divleft = document.createElement('div');
    let divright = document.createElement('div');
    postDisplay.appendChild(divleft);
    postDisplay.appendChild(divright);
})