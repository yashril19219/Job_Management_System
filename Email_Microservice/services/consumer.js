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

  channel.consume(queueName, async (msg) => {
    
    console.log(`Received message from ${queueName}:`);

    const message=JSON.parse(msg.content.toString());

    console.log(message);

  
    if(queueName=='JobReview'){
      var subject='Your Job review request is completed';

      var body=`Your job review request for job: ${message.content.title} has been reviewed:\n\nStatus: ${message.content.status}`

      console.log('emails: ',message.emails);      
      
      //await sendEmail(message.emails,{subject:subject,body:body});

    } 

    else if(queueName='Job'){
      var subject='A new job has been added!';
      var body=`Hi,\nA new job has been added:\n\nTitle: ${message.content.title}\nDescription: ${message.content.description}`;

      //await sendEmail(message.emails,{subject:subject,body:body});
    }
    
    channel.ack(msg);
    
  });

}



module.exports={
    listenToQueue
}