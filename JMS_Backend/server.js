const express = require('express');
const app = express();

require('dotenv').config({path : "config/.env"});



//server config
PORT = process.env.PORT || 8000;

app.listen(PORT, ()=> console.log(`App is running on port ${PORT}`));


