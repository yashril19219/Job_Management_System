const mongoose = require('mongoose');
require('dotenv').config({path : "config/.env"})

const connectDB = async ()=>{
    await mongoose.connect(process.env.URI);
    console.log('MongoDB Database is Connected to: cluster0');
};

module.exports = connectDB;