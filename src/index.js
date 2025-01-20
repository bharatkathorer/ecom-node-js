const express = require('express');
const {static, urlencoded} = require('express');
const mainRoute = require('./route/index');
require('module-alias/register');

require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 3000;


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

app.listen(PORT, () => console.log(`Server is running on port http://localhost:${PORT}`));
