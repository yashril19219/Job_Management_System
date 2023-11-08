const amqp = require('amqplib');
const {sendEmail}=require('./email');


async function listenToQueue(queueName) {
  const connection = await amqp.connect('amqp://localhost:5672');
  const channel = await connection.createChannel();

  // Assert the queue
  await channel.assertQueue(queueName, { durable: false });

  console.log(`Listening to ${queueName}...`);

  const prefetchCount = 1; // Set your desired limit
  channel.prefetch(prefetchCount);

  channel.consume(queueName, (msg) => {
    
    console.log(`Received message from ${queueName}:`);

    const message=JSON.parse(msg.content.toString());

  
    if(queueName=='JobReview'){
      var subject='Your Job review request is completed';

      var body=`Your job review request for job: ${message.content.title} has been reviewed:\n\nStatus: ${message.content.status}`

      
      //sendEmail(message.email,{subject:subject,body:body});

    }

    setTimeout(()=>{
      console.log('completed');
      channel.ack(msg);
    },5000)


    
  

    
  });

}



module.exports={
    listenToQueue
}