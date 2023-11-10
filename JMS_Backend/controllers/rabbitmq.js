const {connectRabbitmq} = require('../connections/rabbitmq');
require('dotenv').config({path : "config/.env"});


async function sendMessage(message,queue){
    try{
        const connection=await connectRabbitmq(process.env.RABBITMQ_CONNECTION_URL);

        const channel=await connection.createChannel();

        let queueName=queue;
        
        channel.assertQueue(queueName,{durable: false});
        const prefetchCount = 1; // Set your desired limit
        channel.prefetch(prefetchCount);

        let emails=message.emails;

        let content=message.content;

        for(let email of emails){
            const mess={'content':content,'email':email};
            channel.sendToQueue(queueName,Buffer.from(JSON.stringify(mess)));
        }


              
    }
    catch(error){
        console.log(error);
    }
}


module.exports={sendMessage};