const Job=require("../models/job");
const redisController=require("./redis");

async function handleGetJob(req,res){
    let jobid=req.query.jobid;
    let title=req.query.title;

    if(jobid){

        const cacheKey = `jobId:${jobid}`;

        const result= await redisController.getFromCache(cacheKey);

        if(result.status=='HIT'){
            console.log('CACHE HIT.....');
            res.send(JSON.parse(result.data));
            return ;
        }

        console.log('CACHE MISS......');

        Job.findById(jobid)
        .then((job)=>{
            if(!job){
                res.send({msg:'No Job found'});
                return ;
            }
            res.send(job);

            redisController.setIntoCache(cacheKey,JSON.stringify(job));
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

    const result= await redisController.getFromCache('allJobs');

    if(result.status=='HIT'){
        console.log('CACHE HIT.....');
        res.send(JSON.parse(result.data));
        return ;
    }

    console.log('CACHE MISS......');

    Job.find()
    .then((jobs)=>{
        res.send(jobs);

        redisController.setIntoCache('allJobs',JSON.stringify(jobs));
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

        redisController.deleteFromCache('allJobs');
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

    if(!jobid){
        res.send({msg:'Invalid parameter'});
        return ;
    }

    if(!title && !description){
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
        
        job.save()
        .then((task)=>{
            res.send({'msg':'Successfully updated the job'});

            const cacheKey = `jobId:${jobid}`;
            redisController.deleteFromCache('allJobs');
            redisController.deleteFromCache(cacheKey);
            return;
        })
        .catch((err)=>{
            console.log(err);
            res.send('Error while updating job');
            return;
        });
    })

}

async function handleDeleteJob(req,res){
    let jobid=req.params.id;

    Job.findByIdAndDelete(jobid)
    .then(()=>{
        res.send({msg:"Job deleted"});

        const cacheKey = `jobId:${jobid}`;
        redisController.deleteFromCache('allJobs');
        redisController.deleteFromCache(cacheKey);
    })
}

module.exports={
    handleGetJob,
    handlePostJob,
    handleUpdateJob,
    handleDeleteJob
}