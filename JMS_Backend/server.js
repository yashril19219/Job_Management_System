const express = require('express');
const app = express();
const connectDB = require('./connections/mongodb');
const cookieParser = require('cookie-parser');
require('dotenv').config({path : "config/.env"});

connectDB(process.env.URI);

const userRoutes = require('./routes/user.js');

app.use(cookieParser())
app.use(express.json());
app.use('/', userRoutes);

//server config

PORT = process.env.PORT || 8000;
app.listen(PORT, ()=> console.log(`App is running on port ${PORT}`));

