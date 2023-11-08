var nodemailer =require('nodemailer');
require('dotenv').config({path : "config/.env"});

async function sendEmail(email,content){
    var transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD
        }
      });

      var subject=content.subject;
      var text=content.body;


      var mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: subject,
        text: text
      };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            return {status:"Fail",error:error};
        } 
        else {
            return {status:"Success"};
            console.log('Email sent: ' + info.response);
        }
      });
}

module.exports={
    sendEmail
}