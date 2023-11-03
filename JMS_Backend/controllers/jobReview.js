const JobReview=require("../models/jobReview");

async function handleGetJobReview(req,res){
    
}

async function handlePostJobReview(req,res){
    let jobReviewId=req.body.jobReviewId;

    if(!jobReviewId){
        res.send('Invalid body parameters');
        return ;
    }

    const jobReview=new JobReview({
        job:jobReviewId
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
    
}

module.exports={
    handleGetJobReview,
    handlePostJobReview,
    handleUpdateJobReview,
    handleDeleteJobReview
}