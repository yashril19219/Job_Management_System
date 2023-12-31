const mongoose = require('mongoose');
 
const {Schema} = mongoose;
 
const userSchema = new Schema({
    username: {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password :{
        type: String,
        required : true
    },
    role : {
        type: String,
        enum: ['User','SuperAdmin','Admin','Moderator','Manager'],
        default : "User"
    }

},{timestamps:true});
 
const User= mongoose.model('User',userSchema);
 
module.exports = User;

