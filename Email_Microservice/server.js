const { listenToQueue } =require("./services/consumer");

// Listen to multiple queues simultaneously
const queuesToListen = ['JobReview'];

queuesToListen.forEach((queueName) => {
  listenToQueue(queueName);
});



