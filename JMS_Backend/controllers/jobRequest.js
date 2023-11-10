const jobRequestModel = require('../models/jobRequest');
const jobModel = require('../models/job');
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
const {getFromCatch, saveInCatch,deleteKey} = require('../connections/redis');
const {sendMessage} = require("./rabbitmq");

const apply = async (req,res)=>{

    const id = req.params.id;

    try {   
        const job = await jobModel.findOne({_id : id});
        const userID = await jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_TOKEN).userID;
        const user = await userModel.findOne({_id :userID});
        

        if(!job){
            return res.status(400).json({success : false, message : `Could not find any job with id ${id}`});
        }
        
        //checking if user has already applied for the job
        
        const alreadyApplied = await jobRequestModel.findOne({job : job._id, applicant : user._id});
        if(alreadyApplied){
            return res.status(400).json({success : false, message : "You have already applied for this job"});
        }

        jobRequestModel({
            job : job._id,
            applicant : user._id,
            status : "Pending"
        }).save();
        console.log(typeof job._id);

        deleteKey(userID + 'jobRequests');
        res.status(201).json({success : true, message : `You have successfully applied for job with id ${id}`});

    } catch (error) {
        return res.status(400).json({success : false, message: "Could not able to apply for this job", "error" : error});
    }
}   

const getJobRequests = async (req,res)=>{

    try {

        const cacheData = await getFromCatch('jobRequests');
        let data;
        
        if(cacheData.status=='CACHE HIT'){
            data=cacheData.data;
        }else{ 
            data = await jobRequestModel.find();
            saveInCatch('jobRequests', data);
        }
        
        if(!data){
            return res.status(200).json({message : "No Job Requests at this moment"});
        }

        return res.status(200).send(data);
        
    } catch (error) {
        return res.status(400).json({success : false, message: "Could not able to load job request", "error" : error});
    }
}

const takeAction = async (req,res) => {
    
    const id = req.params.id;
    const newStatus = req.body.status;

    try {
        await jobRequestModel.updateOne({_id : id},{status : newStatus});
        const requestDetails = await jobRequestModel.findOne({_id : id});
        const applicantID = (requestDetails.applicant).toString();
        const userDetails = await userModel.findOne({_id: applicantID});
        const email = userDetails.email.toString();
        deleteKey('jobRequests');

        const message={
            emails:[email],
            content:{
                message: `You job request has been with id : ${id},  has been ${newStatus}`
            }
        }

        await sendMessage(message,'JobRequest');

        return res.status(200).send({success : true, message : `JobRequest with id ${id} has been ${newStatus}`});
    } catch (error) {
        return res.status(500).json({success : false, message: "Internal error has been occured", "error" : error});
        
    }
};

module.exports = {apply,getJobRequests,takeAction};
