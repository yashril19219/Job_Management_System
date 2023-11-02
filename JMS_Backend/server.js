const express = require('express');
const app = express();
const connectDB = require('./connections/mongodb');
const cookieParser = require('cookie-parser');
require('dotenv').config({path : "config/.env"});

connectDB(process.env.URI);

//middlewares
app.use(cookieParser())
app.use(express.json());

//server config
PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> console.log(`App is running on port ${PORT}`));


