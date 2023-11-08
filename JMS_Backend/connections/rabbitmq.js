const amqp=require('amqplib');

async function connectRabbitmq(url){
    return amqp.connect(url);
}

module.exports={
    connectRabbitmq,
}