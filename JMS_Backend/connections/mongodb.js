
const mongoose=require("mongoose");

const connectDB = async (uri)=>{
    await mongoose.connect(uri);
    console.log("Database connected");
};

module.exports = connectDB;

