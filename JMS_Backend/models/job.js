const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema= new Schema({

    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum:['Approved','Pending','Rejected'],
        default:'Pending',
        required: true
    }

},{timestamps:true})


const Job=mongoose.model('Job',jobSchema);


module.exports=Job;