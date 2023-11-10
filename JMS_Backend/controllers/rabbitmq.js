const {connectRabbitmq} = require('../connections/rabbitmq');
require('dotenv').config({path : "config/.env"});

const User=require('../models/user');

const redisController =require('./redis');

async function sendInBatch(emails,content,batchSize,queueName){
    const connection=await connectRabbitmq(process.env.RABBITMQ_CONNECTION_URL);

    const channel=await connection.createChannel();
    
    channel.assertQueue(queueName,{durable: false});

    for (let i = 0; i < emails.length; i += batchSize) {
        const batch = emails.slice(i, i + batchSize);
        const mess={'content':content,'emails':batch};
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(mess)));
    }

}


async function sendMessage(message,queueName){
    console.log('Received req for: ',queueName);
    try{
        let emails=message.emails;

        let content=message.content;


    
        sendInBatch(emails,content,10,queueName);
     
    }
  
    catch(error){
        console.log(error);
    }
}


async function jobAdded(job,queueName){

    setname='Job:Subscription:alljobs';

    const result= await redisController.getMembersOfSet(setname);

    if(result.status=='HIT'){
        console.log('Cache HIT');
        console.log(result.data);
    }
    else{
        console.log('Cache MISS');
    }


    const users=await User.find();

    var emails=users.map(user=>user.email);

    let content={
        title:job.title,
        description:job.description,
    }

    sendInBatch(emails,content,10,queueName);

    if(result.status=='MISS'){
        redisController.addMembersToSet(setname,emails);
    }
    

}


module.exports={sendMessage,jobAdded};