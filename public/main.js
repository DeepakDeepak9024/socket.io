const socket = io();
let s=[];
// Global Variables 
const userTable = document.querySelector('.users');
const userTagline = document.querySelector('#users-tagline');
let sabkanaam;
const userTitle = document.getElementById('user-title');
// Global methods

const methods = {
  socketConnect: async (username, userID,usermail) => {
    socket.auth = { username, userID,usermail }
    await socket.connect();
  },
  createSession: async (username,usermail) => {
    const data={
      username,usermail
    }
    
    let options = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }
    await fetch('/session', options)
    .then( res => res.json() )
    .then( data => {
      
      methods.socketConnect(data.username, data.userID,usermail);
      // set localstorage for session
      localStorage.setItem('session-username', data.username);
      
      localStorage.setItem('session-usermail', data.usermail);
      localStorage.setItem('session-userID', data.userID);
  
      document.querySelector(".login-container").style.display="none"
      document.querySelector(".chat-body").style.display="block"
      // userTitle.innerHTML = data.username;
      // console.log(data.username);
    })
    .catch( err => console.log(err) )
  }
}
// session variables
const sessUsername = localStorage.getItem('session-username');
const sessUsermail = localStorage.getItem('session-usermail');
const sessUserID = localStorage.getItem('session-userID');

if(sessUsername && sessUserID && sessUsermail) {

  methods.socketConnect(sessUsername, sessUserID,sessUsermail);

  document.querySelector(".login-container").style.display="none"
  document.querySelector(".chat-body").style.display="block"

  // userTitle.innerHTML = sessUsername;
}
    
// login form handler
const loginForm = document.querySelector('.user-login');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('username');
  const usermail = document.getElementById('usermail');
  methods.createSession(username.value.toLowerCase(),usermail.value.toLowerCase());
  username.value = '';
  usermail.value='';
});
  
// user list table
socket.on('users', ({users}) => {
  // console.log(users);

  const index = users.findIndex( user => user.userID === socket.id );
  if ( index > -1) {
    users.slice(index, 1);
}
console.log(users);
userTable.innerHTML = '';
  let ul = `<table class="table table-hover">`;
  for (const user of users) {
    
    ul += `<tr class="socket-users" onclick="methods.setActiveUser('${user.username} ', '${user.userID}')"><td onclick=greet();>Name : ${user.username} ; Mail-Id : ${user.usermail} <span class="text-danger ps-1 d-none" id="${user.userID}"></span></td></tr>`;
    
    let fst=user.username;
     let sco=user.usermail;
    s.push(fst,sco);
  
  }
  
  ul += `</table>`;
  if ( users.length > 0 ) {
    userTable.innerHTML = ul;
  }
})
function greet(){
  alert(s);
}