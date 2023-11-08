const { listenToQueue } =require("./services/consumer");

// Listen to multiple queues simultaneously
const queuesToListen = ['JobReview', 'JobRequest', 'Register'];

queuesToListen.forEach((queueName) => {
  listenToQueue(queueName);
});



