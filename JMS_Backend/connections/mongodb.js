const mongoose=require("mongoose");

async function connectMongoDb(url){
    return mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true});
}

module.exports={
    connectMongoDb,
}