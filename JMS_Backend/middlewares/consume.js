const amqp = require('amqplib');
const nodemailer = require('nodemailer');

require('dotenv').config({path : "config/.env"});

// Configure your email service (e.g., Gmail)
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.G_MAIL,
    pass: process.env.G_PASS,
  },
});

async function consumeMessage() {
  try {
    console.log("consuming....");
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queueName = 'queue1';

    await channel.assertQueue(queueName, { durable: false });
    console.log(`Waiting for messages in ${queueName}. To exit, press CTRL+C`);

    channel.consume(queueName, async (message) => {
    
      const messageContent = JSON.parse(message.content.toString());
      console.log(`Received: ${messageContent.message}`);

      // Email configuration
      const mailOptions = {
        from: process.env.G_MAIL,
        to: messageContent.email,
        subject: 'Message from RabbitMQ',
        text: messageContent.message,
      };

      try {
        // Send the email
        await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${messageContent}`);
      } catch (error) {
        console.error(`Error sending email: ${error}`);
      }
    }, { noAck: true });
  } catch (error) {
    console.error(error);
  }
}

module.exports = consumeMessage;