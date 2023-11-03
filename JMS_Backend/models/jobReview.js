const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobReviewSchema= new Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job',
        required: true
    },
    reviewer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    status:{
        type: String,
        enum:['Approved','Pending','Rejected'],
        default:'Pending',
        required: true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    }
},{timestamps:true})


const JobReview=mongoose.model('JobReview',jobReviewSchema);



module.exports=JobReview;

