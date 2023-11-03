const JobReview=require("../models/jobReview");

async function handleGetJobReview(req,res){
    let id=req.query.id;
    let status=req.query.status;
    let createdBy=req.query.createdBy;

    if(id){
        JobReview.findById(id)
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
        JobReview.find({status:status})
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

    JobReview.find()
    .then((jobreview)=>{
        res.send(jobreview);
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
        jobReview.reviewer=reviewer;
        jobReview.status=status;
    
        jobReview.save()
        .then((jobReview)=>{
            res.send({'msg':'Successfully updated the Job Review'});
            return;
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
    .then(()=>{
        res.send({msg:"Review deleted successfully"});
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