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

      sendEmail(message.emails,{subject:subject,body:body});

      channel.ack(msg);
    }
    else if(queueName =='Register'){
      console.log('sending mail');
      console.log(message);
      console.log(message.emails);
      sendEmail(message.emails, {subject : message.content.subject, body : message.content.message});
      console.log('mail sent successfully');
      channel.ack(msg);
    }
    
    else if(queueName =="JobRequest"){
      console.log('sending mail');
      sendEmail(message.emails, {subject : "Action Taken on your application", body : message.content.message});
      console.log('mail sent successfully');
      channel.ack(msg);
    }


    else if(queueName='Job'){
      var subject='A new job has been added!';
      var body=`Hi,\nA new job has been added:\n\nTitle: ${message.content.title}\nDescription: ${message.content.description}`;

      sendEmail(message.emails,{subject:subject,body:body});
      channel.ack(msg);
    }
    
    
    
    
  });

}



module.exports={
    listenToQueue
}