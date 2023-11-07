const amqp = require('amqplib');

async function publishMessage(message) {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queueName = "queue1";

    await channel.assertQueue(queueName, { durable: false });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));

    console.log(`Sent: ${message}`);
  } catch (error) {
    console.error(error);
  }
}

module.exports = publishMessage;