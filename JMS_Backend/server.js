const express = require('express');
const connectDB = require('./connections/mongodb');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
require('dotenv').config({path : "config/.env"});
const jobRouter=require("./routes/job");
const jobReviewRouter=require("./routes/jobReview");
const userRoutes = require('./routes/user.js');

const app = express();


//Middlewares
app.use(cookieParser())
app.use(express.json());
app.use(bodyParser.json());

//server config
PORT = process.env.JMS_SERVER_PORT || 5000;



//MongoDB connection

connectDB(process.env.MONGODB_CONNECTION_URL)
.then(()=>{
    app.listen(PORT, ()=> console.log(`App is running on port ${PORT}`));
})
.catch((err)=>{
    console.log(err);
})


app.use("/job",jobRouter);
app.use("/job-review",jobReviewRouter)
app.use('/', userRoutes);



