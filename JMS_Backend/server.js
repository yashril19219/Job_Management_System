const express = require('express');
const connectDB = require('./connections/mongodb');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
require('dotenv').config({path : "config/.env"});
const jobRouter=require("./routes/job");
const jobReviewRouter=require("./routes/jobReview");
const userRoutes = require('./routes/user.js');
const emailRoutes = require('./routes/email.js');
const JobRequest = require('./routes/jobRequest.js');
const app = express();
const consume = require('./middlewares/consume.js');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 100 requests per windowMs
    message: {message : "To many requests please try again later"},
});
  
// Apply the rate limiter to a specific route
app.use(limiter);
  

//Middlewares
app.use(cookieParser())
app.use(express.json());
app.use(bodyParser.json());

consume();


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
app.use("/job", JobRequest);
app.use('/', emailRoutes);


