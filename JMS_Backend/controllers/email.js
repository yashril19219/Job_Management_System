const publishMessage = require('../connections/rabbitmq');

const produce = async (req,res)=>{
    const {message} = req.body;
    try {
        await publishMessage(message);
        return res.status(200).json({success : true,message : `message ${message} published`});
    } catch (error) {
        return res.status(400).json({success :false, message : "could not produce" , error : error});
    }
}



module.exports = {produce};