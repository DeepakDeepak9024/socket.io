const express = require('express');

const app = express();
const ejs=require("ejs");
const port=process.env.PORT || 3000;
// init socket server
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
app.set("view engine","ejs");
// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(cors());

// app homepage
app.get('/', (req, res) => {
  res.render("index");
});

// session post page
const { v4: uuidv4 } = require('uuid');
app.post('/session', (req, res) => {
  let data = {
    username: req.body.username,
    usermail: req.body.usermail,
    userID: uuidv4()
  }
  res.send(data);
});

// socket.io middleware
io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  const usermail = socket.handshake.auth.usermail;
  const userID = socket.handshake.auth.userID;
  if(!username) {
    return next(new Error('Invalid username'));
  }
  // create new session
  socket.username = username;
  socket.usermail = usermail;
  socket.id = userID;
  next();
});

// socket events
let users = [];
io.on('connection', async socket => {
  
  // get all users
  let userData = {
    username : socket.username,
    usermail : socket.usermail,
    userID : socket.id
  }

  users.push(userData);
  io.emit('users', {users});
  // console.log(users);
  
  socket.on('disconnect', () => {
    users = users.filter( user => user.userID !== socket.id);
    io.emit('users', {users} );
    io.emit('user-away', socket.id);
  });
  
})
server.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});