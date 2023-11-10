const { listenToQueue } =require("./services/consumer");

// Listen to multiple queues simultaneously

const queuesToListen = ['JobReview', 'JobRequest', 'Register','Job'];



queuesToListen.forEach((queueName) => {
  listenToQueue(queueName);
});



