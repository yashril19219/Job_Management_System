
const redis = require('redis');
require('dotenv').config({path : "../config/.env"});

const getFromCatch = async (key)=>{

    try {
        const client = await redis.createClient(process.env.REDIS_HOST, process.env.REDIS_PORT);
        
        client.on('error', (err)=>{
            console.error(err.message)
        })
        await client.connect();
        const data = await client.get(key);
    
        if(data!=null){
            console.log('Cache HIT')
            return {'status' : "CACHE HIT" , 'data' : JSON.parse(data)};
        }
        console.log('CACHE MISS');
        return {'status' : "CACHE MISS" , 'data' : null};

    } catch (error) {
        console.log(error);
    }
}

const saveInCatch = async (key, data) =>{
    
    try {
        const client = await redis.createClient(process.env.REDIS_HOST, process.env.REDIS_PORT);
        client.on('error', (err)=>{
            console.error(err.message)
        })
        await client.connect();
        const redisValue = JSON.stringify(data);
        client.set(key, redisValue, function(err, reply) {
            console.log(reply);
        });

    } catch (error) {
        console.log(error);        
    }
}
const deleteKey = async (key)=>{
    
    try {
        const client = await redis.createClient(process.env.REDIS_HOST, process.env.REDIS_PORT);
        client.on('error', (err)=>{
            console.error(err.message)
        })
        await client.connect();
        
        client.del(key);

    } catch (error) {
        console.log(error);
        
    }
}


module.exports = {getFromCatch, saveInCatch,deleteKey};