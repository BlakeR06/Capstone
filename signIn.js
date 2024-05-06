const usernameLogin = document.getElementById('usernameLogin');
const passwordLogin = document.getElementById('passwordLogin');
const usernameSignUp = document.getElementById('usernameSignUp');
const passwordSignUp = document.getElementById('passwordSignUp');

const loadingIndicator = document.getElementById('loadingIndicator');
const loadingCover = document.getElementById('loadingCover');

const loginContainer = document.getElementById('loginContainer');
const signUpContainer = document.getElementById('signUpContainer');

const sheetsUrl = 'https://script.google.com/macros/s/AKfycbzi-exCjX_JMQWolXjOzQoKW6UO43miPeaUSB1ajFILMQYm8h6jn-45KvRcMwQcquA/exec';

function CheckForAccount(event) {
  if(usernameLogin.value && passwordLogin.value){
    event.preventDefault(); // Prevent the default form submission behavior
    LoadingStart();
    
    var loginForm = document.getElementById('loginForm');
    var loginFormData = new FormData(loginForm); // Collect form data
    
    fetch(sheetsUrl, {
      method: 'POST', 
      body: loginFormData
    })
    .then(response => response.text())
    .then(data => {
      CheckPassword(data);
    })
    .catch(error => {
      alert('Incorrect username or password.');
      usernameLogin.value = ''
      passwordLogin.value = ''
      LoadingStop();
    });
  }
}

function CheckPassword(data){
  LoadingStop();
  if(data === passwordLogin.value){
    localStorage.setItem('currentUser', usernameLogin.value)
    usernameLogin.value = ''
    passwordLogin.value = ''
    window.location.href = 'content.html'
  } else {
    alert('Incorrect username or password.');
    usernameLogin.value = ''
    passwordLogin.value = ''
  }
}

function CreateAccount(event){
  if(usernameSignUp.value && passwordSignUp.value){
    event.preventDefault();
    LoadingStart();

    var signupForm = document.getElementById('signupForm');
    var signupFormData = new FormData(signupForm);

    fetch(sheetsUrl, {
      method: 'POST',
      body: signupFormData
    })
    .then(response => response.text())
    .then(data => {
      CheckUsername(data);
    })
    .catch(error => {
      alert('Error. Please try again.' + error);
      LoadingStop();
    });
  }
}

function CheckUsername(data){
  LoadingStop();
  if(data === 'true'){
    alert('Account created successfully! Return to Login.');
    SwitchToLogin()
  } else {
    alert('Username already exists! Please enter a new username.');
    usernameSignUp.value = '';
  }
}

function LoadingStart(){
  loadingIndicator.style.display = 'block';
  loadingCover.style.display = 'block';
}

function LoadingStop(){
  loadingIndicator.style.display = 'none';
  loadingCover.style.display = 'none';
}

function SwitchToCreateAccount(){
  loginContainer.style.display = 'none';
  signUpContainer.style.display = 'block';
  usernameLogin.value = ''
  passwordLogin.value = ''
}

function SwitchToLogin(){
  loginContainer.style.display = 'block';
  signUpContainer.style.display = 'none';
  usernameSignUp.value = ''
  passwordSignUp.value = ''
}

