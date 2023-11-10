const redis=require('redis');
require('dotenv').config({path : "config/.env"});


async function getFromCache(key){
    const client=redis.createClient(process.env.REDIS_HOST,process.env.REDIS_PORT)
    await client.connect().catch((err)=>{
        console.log('Error connecting to redis : ',err);
    });


    const data=await client.get(key);

    client.quit();

    if(data!=null){
        return {'status':'HIT','data':data};
    }
    else{
        return {'status':'MISS'};
    }
}


async function setIntoCache(key,value){
    const client=redis.createClient(process.env.REDIS_HOST,process.env.REDIS_PORT)
    await client.connect().catch((err)=>{
        console.log('Error connecting to redis : ',err);
    });
    await client.set(key,value);

    client.quit();
}

async function deleteFromCache(key){
    const client=redis.createClient(process.env.REDIS_HOST,process.env.REDIS_PORT)
    await client.connect().catch((err)=>{
        console.log('Error connecting to redis : ',err);
    });

    await client.del(key);

    client.quit();
}


async function getMembersOfSet(name){
    const client=redis.createClient(process.env.REDIS_HOST,process.env.REDIS_PORT)
    await client.connect().catch((err)=>{
        console.log('Error connecting to redis : ',err);
    });


    const res=await client.exists(name);

    if(res){
        const members= await client.sMembers(name);

        if(members!=null){
            return {status:"HIT",data:members};
        }
    }

    return {status:"MISS"};


}


async function addMembersToSet(name,members){
    console.log('Adding members in set: ',name);
    const client=redis.createClient(process.env.REDIS_HOST,process.env.REDIS_PORT)
    await client.connect().catch((err)=>{
        console.log('Error connecting to redis : ',err);
    });

    result=client.sAdd(name,members);      

}

// async function updateCache(key,value,operation){
//     const client=redis.createClient(process.env.REDIS_HOST,process.env.REDIS_PORT)
//     await client.connect().catch((err)=>{
//         console.log('Error connecting to redis : ',err);
//     });

//     if(operation=='add'){

//         client.get(key, (redisErr, val) => {
//             if (redisErr) {
//               return ;
//             } else {
//               const data = JSON.parse(val);
//               data.push(value);
//               client.setEx(key, 3600, JSON.stringify(data));
//             }
//           });
//     }
//     else if(operation=='update'){


//     }

//     else if(operation=='update_list'){

//     }
//     else if(operation=='remove'){

//     }
// }

module.exports={
    getFromCache,
    setIntoCache,
    deleteFromCache,
    getMembersOfSet,
    addMembersToSet
}