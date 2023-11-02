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
        required: true
    },
    status:{
        type: String,
        enum:['Approved','Pending','Rejected'],
        default:'Pending',
        required: true
    }
})

const JobReview=mongoose.model('JobReview',jobReviewSchema);


module.exports=Job;