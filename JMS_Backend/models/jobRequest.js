const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobRequestSchema= new Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job',
        required: true
    },
    applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    status:{
        type: String,
        enum:['Approved','Pending','Rejected'],
        default:'Pending',
        required: true
    }
},{timestamps:true})

const JobRequest=mongoose.model('JobRequest',jobRequestSchema);


module.exports=JobRequest;