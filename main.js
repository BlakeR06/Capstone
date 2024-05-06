var signedInUser

const amountOfRows = document.getElementById('amountOfRows')

const sheetsUrl = 'https://script.google.com/macros/s/AKfycbzi-exCjX_JMQWolXjOzQoKW6UO43miPeaUSB1ajFILMQYm8h6jn-45KvRcMwQcquA/exec';

SwitchWindows()

window.onload = function(){
    var storedUsername = localStorage.getItem('currentUser');
    if(storedUsername){
        document.getElementById('userName').textContent = storedUsername
        signedInUser = storedUsername
    }
    else{
        alert('Error. Returning to login.')
        window.location.href = 'home.html'
    }

    LoadPosts()
    
}

function CreateNewPost(event){
    event.preventDefault();
    LoadingStart();

    const newPostInput = document.getElementById('newPostInput')
    const privateCheckbox = document.getElementById('privateCheckbox')

    const newPostUsername = document.getElementById('newPostUsername')
    newPostUsername.value = signedInUser

    var newPostForm = document.getElementById('newPostForm')
    var newPostFormData = new FormData(newPostForm);

    fetch(sheetsUrl, {
        method: 'POST',
        body: newPostFormData
    })
    .then(response => response.text())
    .then(data => {
        if(data === 'posted'){
            alert('Posted!')
            newPostInput.value = ''
            privateCheckbox.checked = false
            LoadingStop()
            location.reload();
        }
        else{
            alert('Post failed. Please try again.')
            newPostInput.value = ''
            LoadingStop()
        }
    })
    .catch(error => {
        alert('Post failed. Please try again.');
        newPostInput.value = ''
        LoadingStop();
    });
}

function LoadPosts(){

    var pageLoadedForm = document.getElementById('pageLoadedForm')
    var pageLoadedFormData = new FormData(pageLoadedForm)

    LoadingStart()

    fetch(sheetsUrl, {
        method: 'POST',
        body: pageLoadedFormData
    })
    .then(response => response.text())
    .then(data => {

        for(i = data; i >= 2; i--){

            amountOfRows.value = i

            var rowCounterForm = document.getElementById('rowCounterForm')
            var rowCounterFormData = new FormData(rowCounterForm)

            fetch(sheetsUrl, {
                method: 'POST',
                body: rowCounterFormData
            })
            .then(response => response.json())
            .then(data => {
                var date = data.date;
                var user = data.user;
                var private = data.private;
                var content = data.content;
                
                var postContainer = document.createElement('div')
                postContainer.className = 'postContainer'

                var postUsername = document.createElement('div')
                postUsername.className = 'postUsername'
                postUsername.textContent = user

                var postContent = document.createElement('div')
                postContent.className = 'postContent'
                postContent.textContent = content

                var postDate = document.createElement('div')
                postDate.className = 'postDate'
                postDate.textContent = date

                var globalPostsContainer = document.getElementById('globalPostsContainer')

                postContainer.appendChild(postUsername)
                postContainer.appendChild(postContent)
                postContainer.appendChild(postDate)

                if(!private){
                    globalPostsContainer.appendChild(postContainer)

                    if(user === signedInUser){
                        var usersPostsContainer = document.getElementById('usersPostsContainer')
                        usersPostsContainer.appendChild(postContainer.cloneNode(true))
                    }
                }
                else{
                    if(user === signedInUser){
                        var usersPrivatePostsContainer = document.getElementById('usersPrivatePostsContainer')
                        usersPrivatePostsContainer.appendChild(postContainer)
                    }
                }

            })
            .catch(error => {
                alert('Error fetching data:' + error);
                LoadingStop()
            });
        }
        LoadingStop()
    })
    .catch(error => {
      alert('Error fetching data:' + error);
      LoadingStop()
    });
}

function LoadingStart(){
    loadingIndicator.style.display = 'block';
    loadingCover.style.display = 'block';
}
  
  function LoadingStop(){
    loadingIndicator.style.display = 'none';
    loadingCover.style.display = 'none';
}

function SwitchWindows(){
    const globalIcon = document.getElementById('globalIcon')
    const newIcon = document.getElementById('newIcon')
    const userIcon = document.getElementById('userIcon')

    const privateIcon = document.getElementById('privateIcon')

    const newPostContainer = document.getElementById('newPostContainer')
    const globalPostsContainer = document.getElementById('globalPostsContainer')
    const accountContainer = document.getElementById('accountContainer')

    globalIcon.addEventListener('click', function(){
        CloseAllWindows()
        globalPostsContainer.style.display = 'block'
        globalIcon.style.filter = 'invert(100%)'
    })

    newIcon.addEventListener('click', function(){
        CloseAllWindows()
        newPostContainer.style.display = 'block'
        newIcon.style.filter = 'invert(100%)'
    })

    userIcon.addEventListener('click', function(){
        CloseAllWindows()
        privateIcon.style.display = 'block'
        accountContainer.style.display = 'block'
        userIcon.style.filter = 'invert(100%)'
    })

    function CloseAllWindows(){
        newPostContainer.style.display = 'none'
        globalPostsContainer.style.display = 'none'
        accountContainer.style.display = 'none'
        privateIcon.style.display = 'none'

        globalIcon.style.filter = 'invert(0%)'
        newIcon.style.filter = 'invert(0%)'
        userIcon.style.filter = 'invert(0%)'
    }

    let clicked = false

    const usersPrivatePostsContainer = document.getElementById('usersPrivatePostsContainer')
    const usersPostsContainer = document.getElementById('usersPostsContainer')

    privateIcon.addEventListener('click', function(){
        if(!clicked){
            privateIcon.style.filter = 'invert(100%)'
            usersPrivatePostsContainer.style.display = 'block'
            usersPostsContainer.style.display = 'none'
            clicked = true
            return
        }
        privateIcon.style.filter = 'invert(0)'
        clicked = false
        usersPrivatePostsContainer.style.display = 'none'
        usersPostsContainer.style.display = 'block'
    })
}