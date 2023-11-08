const JobReview=require("../models/jobReview");
const redisController=require("./redis");
const Job=require("../models/job");
const User=require("../models/user");
const {sendMessage} = require("./rabbitmq");

async function handleGetJobReview(req,res){
    let id=req.query.id;
    let status=req.query.status;
    let createdBy=req.query.createdBy;

    if(id){

        const cacheKey = `jobReviewId:${id}`;

        const result= await redisController.getFromCache(cacheKey);

        if(result.status=='HIT'){
            console.log('CACHE HIT.....');
            res.send(JSON.parse(result.data));
            return ;
        }

        console.log('CACHE MISS......');

        JobReview.findById(id)
        .then((jobreview)=>{
            if(!jobreview){
                res.send({msg:'No Job Review found'});
                return ;
            }
            res.send(jobreview);

            redisController.setIntoCache(cacheKey,JSON.stringify(jobreview));

        })
        .catch((err)=>{
            console.log(err);
            res.send({msg:'Error finding Job Review'});
        })

        return ;
    }

    if(!status && createdBy){
        JobReview.find({createdBy:createdBy})
        .then((jobreview)=>{
            if(!jobreview){
                res.send({msg:'No Job Review found'});
                return ;
            }
            res.send(jobreview);
        })
        .catch((err)=>{
            console.log(err);
            res.send({msg:'Error finding Job Review'});
        })

        return ;
    }

    if(status && !createdBy){

        const cacheKey = `jobReviewStatus:${status}`;

        const result= await redisController.getFromCache(cacheKey);

        if(result.status=='HIT'){
            console.log('CACHE HIT.....');
            res.send(JSON.parse(result.data));
            return ;
        }

        console.log('CACHE MISS......');

        JobReview.find({status:status})
        .then((jobreview)=>{
            if(!jobreview){
                res.send({msg:'No Job Review found'});
                return ;
            }
            res.send(jobreview);

            redisController.setIntoCache(cacheKey,JSON.stringify(jobreview));
        })
        .catch((err)=>{
            console.log(err);
            res.send({msg:'Error finding Job Review'});
        })

        return ;
    }

    if(status && createdBy){
        JobReview.find({status:status,createdBy:createdBy})
        .then((jobreview)=>{
            if(!jobreview){
                res.send({msg:'No Job Review found'});
                return ;
            }
            res.send(jobreview);
        })
        .catch((err)=>{
            console.log(err);
            res.send({msg:'Error finding Job Review'});
        })

        return ;
    }

    const cacheKey = 'alljobReview';

    const result= await redisController.getFromCache(cacheKey);

    if(result.status=='HIT'){
        console.log('CACHE HIT.....');
        res.send(JSON.parse(result.data));
        return ;
    }

    console.log('CACHE MISS......');

    JobReview.find()
    .then((jobreview)=>{
        res.send(jobreview);

        redisController.setIntoCache(cacheKey,JSON.stringify(jobreview));
    })
    .catch((err)=>{
        res.send({msg:'Error finding Job Review'});
    })
    
}

async function handlePostJobReview(req,res){
    let jobId=req.body.jobId;
    let createdBy=req.body.createdBy;

    if(!jobId){
        res.send('Invalid body parameters');
        return ;
    }

    const jobReview=new JobReview({
        job:jobId,
        createdBy:createdBy
    });

    jobReview.save()
    .then((jobReview)=>{
        res.send({msg:'Job Review request created successfully'});

        const cacheKey = 'jobReviewStatus:Pending';
        redisController.deleteFromCache('alljobReview');
        redisController.deleteFromCache(cacheKey);
    })
    .catch((err)=>{
        console.log(err);
        res.send({msg:'Erorr while creating the Job Review request'});
    })   
}

async function handleUpdateJobReview(req,res){
    let id=req.params.id;
    let reviewer=req.body.reviewer;
    let status=req.body.status;

    if(!id){
        res.send({msg:'Invalid parameter'});
        return ;
    }

    if(!reviewer || !status){
        res.send({msg:'Invalid body parameters'});
        return ;
    }

    if(status=='Pending'){
        res.send({msg:'Updated status cannot be Pending'});
        return ;
    }

    JobReview.findById(id)
    .then((jobReview)=>{

        let prevStatus=jobReview.status;

        jobReview.reviewer=reviewer;
        jobReview.status=status;
    
        jobReview.save()
        .then((jobReview)=>{
            Job.findById(jobReview.job._id)
            .then((job)=>{

                job.status=status;
                job.save()
                .then((job)=>{
                    res.send({'msg':'Successfully updated the Job Review'});
                    
                    
                    let emails=[]
                    User.findById(jobReview.createdBy._id)
                    .then((user)=>{
                        emails.push(user.email);

                        const message={
                            emails:emails,
                            content:{
                                status:status,
                                title:job.title
                            }
                        }
                        sendMessage(message,'JobReview');
                    })

                    

                    let cacheKey = `jobReviewStatus:${prevStatus}`;
                    redisController.deleteFromCache(cacheKey);
                    cacheKey = `jobReviewStatus:${status}`;
                    redisController.deleteFromCache(cacheKey);
                    redisController.deleteFromCache('alljobReview');
                    cacheKey = `jobId:${job._id}`;
                    redisController.deleteFromCache('allJobs');
                    redisController.deleteFromCache(cacheKey);
                    
                })
                .catch((err)=>{
                    console.log('Error in saving job!!!!!!!!!!',err);
                    res.send({msg:"Something went wrong!!"})
                    return;
                })
            })
            .catch((err)=>{
                console.log('Error!!!!!!!',err);
                res.send({msg:"Something went wrong!!"})
                return;
            })
            
        })
        .catch((err)=>{
            console.log(err);
            res.send('Error while updating Job Review');
            return;
        });
    })
}

async function handleDeleteJobReview(req,res){
    let id=req.params.id;

    if(!id){
        res.send({msg:'Invalid parameter'});
        return ;
    }

    JobReview.findByIdAndDelete(id)
    .then((jobreview)=>{
        res.send({msg:"Review deleted successfully"});

        let cacheKey = `jobReviewStatus:${jobreview.status}`;
        redisController.deleteFromCache(cacheKey);
        redisController.deleteFromCache('alljobReview');
    })
    .catch((err)=>{
        res.send({msg:"Error deleting the review"})
    })


}

module.exports={
    handleGetJobReview,
    handlePostJobReview,
    handleUpdateJobReview,
    handleDeleteJobReview
}