//for access .env file
require('dotenv').config()
const express = require('express');
const {static, urlencoded} = require('express');
const mainRoute = require('./src/route');
require('module-alias/register');
const cors = require('cors');
const chatController = require('./src/controller/chatController');
const {socketAuth} = require("./src/middleware/authMidlleware");
//create app
const app = express();
const PORT = process.env.PORT || 3000;

// app.use(cors());
app.use(cors({
    origin: "*", // Allows all domains (change to specific domains in production)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

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
        origin: "*", // Allow all domains (change in production)
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    },
    handlePreflightRequest: (req, res) => {
        res.writeHead(200, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true",
        });
        res.end();
    },
});
io.use(socketAuth)
chatController.initSocket(io);

//serve app
http.listen(PORT, () => console.log(`Server is running on port http://localhost:${PORT}`));
