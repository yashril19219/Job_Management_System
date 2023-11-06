const redis=require('redis');
require('dotenv').config({path : "config/.env"});


async function getFromCache(key){
    const client=redis.createClient(process.env.REDIS_HOST,process.env.REDIS_PORT)
    await client.connect().catch((err)=>{
        console.log('Error connecting to redis : ',err);
    });


    const data=await client.get(key);

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
    await client.setEx(key,120,value);
}

async function deleteFromCache(key){
    const client=redis.createClient(process.env.REDIS_HOST,process.env.REDIS_PORT)
    await client.connect().catch((err)=>{
        console.log('Error connecting to redis : ',err);
    });

    await client.del(key);
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
    deleteFromCache
}