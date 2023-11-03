const Job=require("../models/job");

async function handleGetJob(req,res){
    let jobid=req.query.jobid;
    let title=req.query.title;

    if(jobid){
        Job.findById(jobid)
        .then((job)=>{
            if(!job){
                res.send({msg:'No Job found'});
                return ;
            }
            res.send(job);
        })
        .catch((err)=>{
            console.log(err);
            res.send({msg:'Error finding Job'});
        })

        return ;
    }

    if(title){
        Job.find({title:{
            $regex:title,
            $options: 'i',
        }})
        .then((jobs)=>{
            if(jobs.length ==0){
                res.send({msg:'No jobs found'})
                return ;
            }
            res.send(jobs);
        })
        .catch((err)=>{
            console.log('Error');
            res.send({msg:'Error finding jobs'});
        })

        return ;
    }

    Job.find()
    .then((jobs)=>{
        res.send(jobs);
    })
    .catch((err)=>{
        res.send({msg:'Error getting all jobs'})
    })
}

async function handlePostJob(req,res){
    let title=req.body.title;
    let description=req.body.description;

    if(!title || !description){
        res.send('Invalid body parameters');
        return ;
    }

    const job=new Job({
        title: title,
        description: description
    });

    job.save()
    .then((job)=>{
        res.send({msg:'Job created successfully'});
    })
    .catch((err)=>{
        console.log(err);
        res.send({msg:'Erorr while creating the Job'});
    })
}


async function handleUpdateJob(req,res){
    let jobid=req.params.id;
    let title=req.body.title;
    let description=req.body.description;
    let status=req.body.status;

    if(!jobid){
        res.send({msg:'Invalid parameter'});
        return ;
    }

    if(!title && !description && !status){
        res.send({msg:'Invalid body parameters'});
        return ;
    }

    Job.findById(jobid)
    .then((job)=>{
        if(title){
            job.title=title;
        }
        if(description){
            job.description=description;
        }
        if(status){
            job.status=status;
        }
    
        job.save()
        .then((task)=>{
            res.send({'msg':'Successfully updated the job'});
            return;
        })
        .catch((err)=>{
            console.log(err);
            res.send('Error while updating job');
            return;
        });
    })

}

module.exports={
    handleGetJob,
    handlePostJob,
    handleUpdateJob
}