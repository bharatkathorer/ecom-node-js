//for access .env file
require('dotenv').config()
const express = require('express');
const {static, urlencoded} = require('express');
const mainRoute = require('./route/index');
require('module-alias/register');
const cors = require('cors');
const chatController = require('./controller/chatController');
const {socketAuth} = require("./middleware/authMidlleware");
//create app
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

//for api need file upload body get all type of data
app.use(urlencoded({extended: true}));
//post and read body and query  from api
app.use(express.json());
// App.use(cors());

// all routes register here
app.use('/', mainRoute);

// for folder Access
app.use('/storage', static('storage'))
app.use('/', static('public'))
// for folder Access


const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origins: ['http://localhost:3000']
    }
});
io.use(socketAuth)
chatController.initSocket(io);

//serve app
http.listen(PORT, () => console.log(`Server is running on port http://localhost:${PORT}`));
